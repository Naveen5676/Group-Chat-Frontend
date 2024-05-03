import React  , {useRef} from "react";
function SignUpForm() {

  const name = useRef();
  const email = useRef();
  const phoneno = useRef();
  const password = useRef();

  const handleOnSubmit = (evt) => {
    evt.preventDefault()
    const data = {
      name:name.current.value,
      email:email.current.value,
      phoeno : phoneno.current.value,
      password :password.current.value
    }
    console.log(data)
    
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <span>or use your email for registration</span>
        <input
          type="text"
          name="name"
          placeholder="Name"
          ref={name}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          ref={email}
        />
        <input
          type="number"
          name="phonenumber"
          placeholder="Phone number"
          ref={phoneno}
        />  
        <input
          type="password"
          name="password"
          placeholder="Password"
          ref={password}
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
