import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignInForm() {
  const navigate = useNavigate();
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
        navigate("/chat", { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900">
      <div className="grid gap-8">
        <div
          id="back-div"
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4"
        >
          <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
              Log in
            </h1>
            <form onSubmit={handleOnSubmit} className="space-y-4">
              <div>
                <label for="email" className="mb-2  dark:text-gray-400 text-lg">
                  Email
                </label>
                <input
                  id="email"
                  className="border p-3 dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  type="email"
                  placeholder="Email"
                  ref={email}
                  required
                />
              </div>
              <div>
                <label
                  for="password"
                  className="mb-2 dark:text-gray-400 text-lg"
                >
                  Password
                </label>
                <input
                  id="password"
                  className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  type="password"
                  placeholder="Password"
                  ref={password}
                  required
                />
              </div>
              <a
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <span className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Forget your password?
                </span>
              </a>
              <button
                className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                type="submit"
              >
                LOG IN
              </button>
            </form>
            <div className="flex flex-col mt-4 items-center justify-center text-sm">
              <h3 className="dark:text-gray-300">
                Don't have an account?
                <a
                  className="group text-blue-400 transition-all duration-100 ease-in-out"
                  href="http://localhost:5173/signup"
                >
                  <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Sign Up
                  </span>
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
