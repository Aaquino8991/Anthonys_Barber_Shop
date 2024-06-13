import { useState } from "react"
import LoginForm from "../components/LoginForm"
import SignupForm from "../components/SignupForm"

const Login = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <div>
      {showLogin ? (
        <>
          <div className="flex flex-col items-center">
            <LoginForm onLogin={onLogin} />
            <p>Don't have an account?</p>
            <button onClick={() => setShowLogin(!showLogin)}>Sign up</button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <SignupForm onLogin={onLogin} />
            <p>Have an account?</p>
            <button onClick={() => setShowLogin(!showLogin)}>Login</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Login
