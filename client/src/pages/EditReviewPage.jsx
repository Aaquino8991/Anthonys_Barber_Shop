import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";

const EditReviewPage = () => {

  const formSchema = yup.object().shape({
    title: yup
      .string()
      .required("Must have a title")
      .max(20, "Less than 20 characters"),
    rating: yup
      .number()
      .min(1, "Min: 1")
      .max(5, "Max: 5")
      .required("Rating is required"),
    comments: yup
      .string()
      .max(120, "Max: 120 characters")
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: "",
    rating: "",
    comments: ""
  });

  useEffect(() => {
    fetch(`/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setInitialValues({
            title: data.title,
            rating: data.rating,
            comments: data.comments
          });
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => console.error("Error fetching review:", error));
  }, [id]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setErrors([data.error]);
          } else {
            console.log("Updated Review", data);
            navigate(-1);  // Navigate back to the previous page
          }
        })
        .catch((error) => setErrors(["Failed to edit review"]));
    }
  });

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Review</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500">{formik.errors.title}</div>
          )}
        </div>
        <div>
          <label htmlFor="rating" className="block text-gray-700">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formik.values.rating}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {formik.touched.rating && formik.errors.rating && (
            <div className="text-red-500">{formik.errors.rating}</div>
          )}
        </div>
        <div>
          <label htmlFor="comments" className="block text-gray-700">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={formik.values.comments}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {formik.touched.comments && formik.errors.comments && (
            <div className="text-red-500">{formik.errors.comments}</div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button 
            type="submit" 
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Save
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
      {errors.length > 0 && (
        <div className="mt-4">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500">{error}</p>
          ))}
        </div>
      )}
    </div>

  );
};

export default EditReviewPage;
