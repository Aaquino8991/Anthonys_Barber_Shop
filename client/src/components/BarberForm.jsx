import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";

const BarberForm = () => {

    const formSchema = yup.object().shape({
        name: yup
            .string()
            .required("Must enter name")
            .max(20, "Must be less than 20 characters"),
        email: yup
            .string()
            .required("Must enter email")
            .email("Invalid email")
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
        },
        validationSchema: formSchema,
        onSubmit: handleSubmit,
    });

    const [serverErrors, setServerErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(values) {
        setServerErrors(null);
        setIsLoading(true);
        fetch('/api/barbers', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2)
        }).then((res) => {
            setIsLoading(false);
            if (res.ok) {
                navigate('/barbers');
            } else {
                res.json().then((error) => {
                    setServerErrors(error["error:"]);
                });
            }
        }).catch(() => {
            setIsLoading(false);
            setServerErrors("An unexpected error occurred.");
        });
    }

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                <label htmlFor="name" className="block text-gray-700">Name:</label>
                <input 
                    type="text"
                    id="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.errors.name && (
                    <p className="text-red-500">{formik.errors.name}</p>
                )}
                </div>
                <div>
                <label htmlFor="email" className="block text-gray-700">Email:</label>
                <input 
                    type="text"
                    id="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.errors.email && (
                    <p className="text-red-500">{formik.errors.email}</p>
                )}
                </div>
                <div className="flex space-x-4">
                <button 
                    type="submit" 
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                    {isLoading ? "Loading..." : "Create Barber"}
                </button>
                {serverErrors && (
                    <p className="text-red-500">{serverErrors}</p>
                )}
                </div>
                <div className="mt-4">
                    <button 
                    onClick={() => navigate('/barbers')} 
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                    Cancel
                    </button>
                </div>
            </form>
        </div>

    );
};

export default BarberForm;
