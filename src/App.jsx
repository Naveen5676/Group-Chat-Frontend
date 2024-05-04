import SignInForm from './Components/Auth/SignInForm'
import { Route, Routes } from "react-router-dom";
import Chat from "./Components/Chat/Chat";
import SignUpForm from './Components/Auth/SignUpForm';

function App() {
  return (
    
    <Routes>

      <Route path="/login"  element={<SignInForm />}/>
      <Route path="/signup" element={<SignUpForm />}/>
      <Route path="/chat" element={<Chat />}/>
      
    
    </Routes>
  )
}

export default App;
