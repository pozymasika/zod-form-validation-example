import React, { useReducer, useState } from "react";
import { z } from "zod";

const formReducer = (state: Record<string, string>, event: React.ChangeEvent<HTMLInputElement>) => {
  return {
    ...state,
    [event.target.name]: event.target.value,
  };
};

const User = z
  .object({
    username: z
      .string({
        required_error: "Username is required",
        invalid_type_error:
          "Username must be a string with a minimum length of 3 and a maximum length of 20",
      })
      .min(3)
      .max(20),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error:
          "Password must be a string with a minimum length of 6 and a maximum length of 20",
      })
      .min(6)
      .max(20),
    confirmPassword: z.string().min(6).max(20),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

const RegisterForm = () => {
  const [formData, setFormData] = useReducer(formReducer, {});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("formData", formData);
    const parsedUser = User.safeParse(formData);
    if (!parsedUser.success) {
      const error = parsedUser.error;
      let newErrors = {};
      for (const issue of error.issues) {
        newErrors = {
          ...newErrors,
          [issue.path[0]]: issue.message,
        };
      }
      return setFormErrors(newErrors);
    }
    setFormErrors({});
    // TODO: Send data to server
  };

  return (
    <div className="register-form">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            onChange={setFormData}
            className="form-control"
            placeholder="Enter username"
          />
          {formErrors.username && <p className="text-danger">{formErrors.username}</p>}
        </div>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            onChange={setFormData}
            className="form-control"
            placeholder="Enter email"
          />
          {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={setFormData}
            className="form-control"
            placeholder="Enter password"
          />
          {formErrors.password && <p className="text-danger">{formErrors.password}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={setFormData}
            className="form-control"
            placeholder="Enter password again"
          />
          {formErrors.confirmPassword && (
            <p className="text-danger">{formErrors.confirmPassword}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
