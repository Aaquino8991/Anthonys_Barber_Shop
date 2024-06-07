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
                    setServerErrors(error["error:"] || error.message || "An error occurred.");
                });
            }
        }).catch(() => {
            setIsLoading(false);
            setServerErrors("An unexpected error occurred.");
        });
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input 
                    type="text"
                    id="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
                <p style={{ color: 'red' }}>{formik.errors.name}</p>

                <label htmlFor="email">Email:</label>
                <input 
                    type="text"
                    id="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
                <p style={{ color: 'red' }}>{formik.errors.email}</p>

                <button type="submit">{isLoading ? "Loading..." : "Create Barber"}</button>
                {serverErrors && <p style={{ color: 'red' }}>{serverErrors}</p>}
            </form>
            <div className="cancel-btn">
                <button onClick={() => navigate('/barbers')}>Cancel</button>
            </div>
        </div>
    );
};

export default BarberForm;
