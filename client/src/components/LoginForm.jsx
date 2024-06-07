import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"

const LoginForm = ({ onLogin }) => {

  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => {
      setIsLoading(false)
      if (res.ok) {
        res.json().then((client) => {
          onLogin(client)
          navigate("/")
        })
      } else {
        res.json().then((error) => setErrors(error.errors))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input 
        type="text" 
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password:</label>
      <input 
        type="password" 
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">{isLoading ? "Loading..." : "Login"}</button>
      <p>{errors}</p>
    </form>
  )
}

export default LoginForm
