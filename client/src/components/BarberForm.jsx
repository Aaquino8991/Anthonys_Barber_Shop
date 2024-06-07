import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BarberForm = () => {
    const navigate = useNavigate()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [errors, setErrors] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('/api/barbers', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if(res.ok) {
                console.log('Barber created!')
                const nav = () => navigate('/barbers')
                nav()
            } else {
                res.json().then((error) => setErrors(error.errors))
            }
            })
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input 
                type="text"
                onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="email">Email:</label>
            <input 
                type="text"
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Create Barber</button>
            <p>{errors}</p>
        </form>
        <div className="cancel-btn">
            <button onClick={() => navigate('/barbers')}>Cancel</button>
        </div>
    </div>
  )
}

export default BarberForm