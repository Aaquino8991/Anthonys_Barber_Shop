import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from 'formik'


const SignupForm = ({ onLogin }) => {

    const formSchema = yup.object().shape({
        name: yup
            .string()
            .required("Name cannot be empty.")
            .max(20, "Must be less than 20 characters"),
        email: yup
            .string()
            .required("Email cannot be empty")
            .email("Invalid email"),
        password: yup
            .string()
            .required("Please enter password")
            .matches(/[A-Za-z0-9]+$/, "Must contain letters or numbers only"),
        confirmPassword: yup
            .string()
            .required("Re-enter password")
            .oneOf([yup.ref('password'), null], "Passwords must match")
    })

    const formik = useFormik({
        initialValues: {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
        validationSchema: formSchema,
        onSubmit: handleSubmit,
      });

    const [serverErrors, setServerErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(values) {
        setServerErrors([]);
        setIsLoading(true);
        fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(values, null, 2)
        }).then((res) => {
            setIsLoading(false);
            if (res.ok) {
                res.json().then((client) => onLogin(client));
                const nav = navigate('/')
                nav()
            } else {
                res.json().then((error) => {
                    setServerErrors(error["error:"]);
                });
            }
        })
    }

  return (
    <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input 
            type="text" 
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
        />
        <p style={{color: 'red' }}>{formik.errors.name}</p>

        <label htmlFor="email">Email:</label>
        <input 
            type="text" 
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
        />
        <p style={{ color: 'red' }}>{formik.errors.email}</p>

        <label htmlFor="password">Password:</label>
        <input 
            type="password" 
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
        />
        <p style={{ color: 'red' }}>{formik.errors.password}</p>

        <label htmlFor="confirm-password">Confirm Password:</label>
        <input 
            type="password" 
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
        />
        <p style={{ color: 'red' }}>{formik.errors.confirmPassword}</p>

        <button type="submit">{isLoading ? "Loading..." : "Sign up"}</button>
        {serverErrors && <p style={{ color: 'red' }}>{serverErrors}</p>}
    </form>
  )
}

export default SignupForm