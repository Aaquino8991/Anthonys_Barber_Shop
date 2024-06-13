import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from 'formik';

const SignupForm = ({ onLogin }) => {

  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name required.")
      .max(20, "Must be less than 20 characters"),
    email: yup
      .string()
      .required("Email required")
      .email("Invalid email"),
    password: yup
      .string()
      .required("Please enter password")
      .matches(/[A-Za-z0-9]+$/, "Must contain letters or numbers only"),
    confirmPassword: yup
      .string()
      .required("Re-enter password")
      .oneOf([yup.ref('password'), null], "Passwords must match")
  });

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

  const [serverErrors, setServerErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate('/')
      } else {
        res.json().then((error) => {
          setServerErrors(error["error:"]);
        });
      }
    })
  }

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center bg-white shadow-md p-8 rounded w-full max-w-md mx-auto">
      <label htmlFor="name" className="mb-2 text-gray-700">Name:</label>
      <input 
        type="text" 
        id="name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="mb-1 p-2 border border-gray-300 rounded w-full"
      />
      {formik.touched.name && formik.errors.name && (
        <p className="mb-4 text-red-500">{formik.errors.name}</p>
      )}

      <label htmlFor="email" className="mb-2 text-gray-700">Email:</label>
      <input 
        type="text" 
        id="email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="mb-1 p-2 border border-gray-300 rounded w-full"
      />
      {formik.touched.email && formik.errors.email && (
        <p className="mb-4 text-red-500">{formik.errors.email}</p>
      )}

      <label htmlFor="password" className="mb-2 text-gray-700">Password:</label>
      <input 
        type="password" 
        id="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="mb-1 p-2 border border-gray-300 rounded w-full"
      />
      {formik.touched.password && formik.errors.password && (
        <p className="mb-4 text-red-500">{formik.errors.password}</p>
      )}

      <label htmlFor="confirmPassword" className="mb-2 text-gray-700">Confirm Password:</label>
      <input 
        type="password" 
        id="confirmPassword"
        name="confirmPassword"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="mb-1 p-2 border border-gray-300 rounded w-full"
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <p className="mb-4 text-red-500">{formik.errors.confirmPassword}</p>
      )}

      <button 
        type="submit" 
        className="bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600 transition duration-200"
      >
        {isLoading ? "Loading..." : "Sign up"}
      </button>
      {serverErrors && <p className="mt-4 text-red-500">{serverErrors}</p>}
    </form>
  )
}

export default SignupForm;
