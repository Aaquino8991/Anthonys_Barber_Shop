import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"

const LoginForm = ({ onLogin }) => {

	const formSchema = yup.object().shape({
		email: yup
		.string()
		.required("Must enter email")
		.email("Invalid email"),
		password: yup
		.string()
		.required("Must enter password")
	})

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: formSchema,
		onSubmit: handleSubmit,
	})

    const [serverErrors, setServerErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(values) {
		setServerErrors(null)
		setIsLoading(true)
		fetch('/api/login', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify(values, null, 2)
		}).then((res) => {
			setIsLoading(false)
			if(res.ok) {
				res.json().then((client) => onLogin(client))
				const nav = navigate('/')
				nav()
			} else {
				res.json().then((error) => {
					setServerErrors(error["error:"])
				})
			}
		}).catch(() => {
			setIsLoading(false)
			setServerErrors("An unexpected error occurred.")
		})
	}

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input 
        type="text" 
        id="email"
        value={formik.values.email}
        onChange={formik.handleChange}
      />

      <label htmlFor="password">Password:</label>
      <input 
        type="password" 
        id="password"
        value={formik.password}
        onChange={formik.handleChange}
      />
      <button type="submit">{isLoading ? "Loading..." : "Login"}</button>
      {serverErrors && <p style={{ color: 'red' }}>{serverErrors}</p>}
    </form>
  )
}

export default LoginForm
