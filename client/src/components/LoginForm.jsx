import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";

const LoginForm = ({ onLogin }) => {

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required("Must enter email")
      .email("Invalid email"),
    password: yup
      .string()
      .required("Must enter password"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: handleSubmit,
  });

  const [serverErrors, setServerErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(values) {
    setServerErrors(null);
    setIsLoading(true);
    fetch('/api/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(values, null, 2),
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          res.json().then((client) => onLogin(client));
          navigate('/');
        } else {
          res.json().then((error) => {
            setServerErrors(error["error"]);
          });
        }
      })
      .catch(() => {
        setIsLoading(false);
        setServerErrors("An unexpected error occurred.");
      });
  }

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center bg-white shadow-md p-8 rounded">
      <div className="mb-4 w-full">
        <label htmlFor="email" className="block mb-2 text-gray-700">Email:</label>
        <input 
          type="text" 
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="p-2 border border-gray-300 rounded w-full"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500">{formik.errors.email}</p>
        )}
      </div>

      <div className="mb-4 w-full">
        <label htmlFor="password" className="block mb-2 text-gray-700">Password:</label>
        <input 
          type="password" 
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="p-2 border border-gray-300 rounded w-full"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500">{formik.errors.password}</p>
        )}
      </div>

      <button 
        type="submit" 
        className="bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600 transition duration-200"
      >
        {isLoading ? "Loading..." : "Login"}
      </button>
      
      {serverErrors && (
        <p className="text-red-500 mt-4">{serverErrors}</p>
      )}
    </form>
  );
}

export default LoginForm;
