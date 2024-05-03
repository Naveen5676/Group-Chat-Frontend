import React, { useRef } from "react";
import axios from "axios";
function SignInForm() {
  const email = useRef();
  const password = useRef();

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    const data = {
      email: email.current.value,
      password: password.current.value,
    };
    axios
      .post("http://localhost:3000/login", data)
      .then(() => {
        alert("successfully logged in");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>

        <span>or use your account</span>
        <input type="email" placeholder="Email" name="email" ref={email} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          ref={password}
        />
        <a href="#">Forgot your password?</a>
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
