import { useState } from "react"


const SignupForm = ({ onLogin }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        setErrors([])
        setIsLoading(true)
        fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirm_password: confirmPassword,
            }),
        }).then((res) => {
            setIsLoading(false)
            if(res.ok) {
                res.json().then((client) => onLogin(client))
            } else {
                res.json().then((error) => setErrors(error.errors))
            }
        })
    }

  return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input 
            type="text" 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />

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

        <label htmlFor="confirm-password">Confirm Password:</label>
        <input 
            type="password" 
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">{isLoading ? "Loading..." : "Sign up"}</button>
        <p>{errors}</p>
    </form>
  )
}

export default SignupForm