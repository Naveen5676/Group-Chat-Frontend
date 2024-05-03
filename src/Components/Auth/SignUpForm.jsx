import React  , {useRef} from "react";
import axios from 'axios'

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
      phoneno : phoneno.current.value,
      password :password.current.value
    }
    axios.post("http://localhost:3000/signup", data).then(()=>{
      alert("Sign Up Successfully")
      console.log(data)
    }).catch((err)=>{
      if (err.response.data){
        alert('User already exists, Please Login')
      }
      console.log(err)
    })
   
    
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
