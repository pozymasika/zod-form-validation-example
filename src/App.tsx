import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import RegisterForm from "./components/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <div className="row">
        <div className="col-4 offset-4">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default App;
