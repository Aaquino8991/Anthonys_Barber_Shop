import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as yup from "yup"
import { GiConsoleController } from "react-icons/gi"

const NewReview = () => {

  const formSchema = yup.object().shape({
    title: yup
      .string()
      .required("Please enter a title")
      .max(25, "Max: 25 characters"),
    rating: yup
      .number()
      .required("Please enter a rating")
      .min(1, "Min: 1")
      .max(5, "Max: 5"),
    comments: yup
      .string()
      .max(120, "Max: 120 characters"),
    barberId: yup
      .string()
      .required("Please select a barber")
  })

  const navigate = useNavigate()
  const [barbers, setBarbers] = useState([])
  const [serverErrors, setServerErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch("/api/barbers")
      .then((res) => res.json())
      .then((data) => setBarbers(data))
      .catch((error) => console.error("Error fetching barbers:", error))
  }, [])

  const formik = useFormik({
    initialValues: {
      title: "",
      rating: "",
      comments: "",
      barberId: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      setServerErrors([])
      setIsLoading(true)

      console.log(formik.barberId)

      const date_posted = new Date().toISOString()

      fetch("/api/reviews_index", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          date_posted
        }),
      }).then((res) => {
        setIsLoading(false)
        if (res.ok) {
          res.json().then((newReview) => {
            console.log("Review submitted successfully:", newReview)
            navigate('/')
          })
        } else {
          res.json().then((err) => setServerErrors(err))
        }
      })
    },
  })

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        {formik.touched.title && formik.errors.title ? <p style={{ color: 'red' }}>{formik.errors.title}</p> : null}

        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={formik.values.rating}
          onChange={formik.handleChange}
        />
        {formik.touched.rating && formik.errors.rating ? <p style={{ color: 'red' }}>{formik.errors.rating}</p> : null}

        <label htmlFor="comments">Comments:</label>
        <textarea
          id="comments"
          name="comments"
          value={formik.values.comments}
          onChange={formik.handleChange}
        />
        {formik.touched.comments && formik.errors.comments ? <p style={{ color: 'red' }}>{formik.errors.comments}</p> : null}

        <label htmlFor="barber">Barber:</label>
        <select 
          id="barberId" 
          name="barberId" 
          value={formik.values.barberId} 
          onChange={formik.handleChange}
        >
          <option value="">Select a barber</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>{barber.name}</option>
          ))}
        </select>
        {formik.touched.barberId && formik.errors.barberId ? <p style={{ color: 'red' }}>{formik.errors.barberId}</p> : null}

        <button type="submit">{isLoading ? "Loading..." : "Submit Review"}</button>
        {serverErrors && <p style={{ color: 'red' }}>{serverErrors.error}</p>}
      </form>
      <div className="cancel-btn">        
        <button onClick={() => navigate('/')}>Cancel</button>
      </div>
    </div>
  )
}

export default NewReview
