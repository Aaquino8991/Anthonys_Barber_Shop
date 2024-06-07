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
    <div>
      <h2>Edit Review</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title ? (
            <div style={{ color: 'red' }}>{formik.errors.title}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formik.values.rating}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.rating && formik.errors.rating ? (
            <div style={{ color: 'red' }}>{formik.errors.rating}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={formik.values.comments}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.comments && formik.errors.comments ? (
            <div style={{ color: 'red' }}>{formik.errors.comments}</div>
          ) : null}
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
      {errors.length > 0 && (
        <div>
          {errors.map((error, index) => (
            <p key={index} style={{ color: 'red' }}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditReviewPage;
