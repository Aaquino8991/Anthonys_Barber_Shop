import { useState } from "react"
import LoginForm from "../components/LoginForm"
import SignupForm from "../components/SignupForm"

const Login = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <>
      {showLogin ? (
        <>
          <div className="toggle-form-btn">
            <LoginForm onLogin={onLogin} />
            <p>Don't have an account?</p>
            <button onClick={() => setShowLogin(!showLogin)}>Sign up</button>
          </div>
        </>
      ) : (
        <>
          <div className="toggle-form-btn">
            <SignupForm onLogin={onLogin} />
            <p>Have an account?</p>
            <button onClick={() => setShowLogin(!showLogin)}>Login</button>
          </div>
        </>
      )}
    </>
  )
}

export default Login
