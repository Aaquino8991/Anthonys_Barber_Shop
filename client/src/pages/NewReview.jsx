import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as yup from "yup"

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
    <div className="flex flex-col items-center bg-white shadow-md p-8 rounded w-full max-w-md mx-auto">
  <form onSubmit={formik.handleSubmit} className="w-full">
    <label htmlFor="title" className="mb-2 text-gray-700">Title:</label>
    <input
      type="text"
      id="title"
      name="title"
      value={formik.values.title}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="mb-1 p-2 border border-gray-300 rounded w-full"
    />
    {formik.touched.title && formik.errors.title ? <p className="mb-4 text-red-500">{formik.errors.title}</p> : null}

    <label htmlFor="rating" className="mb-2 text-gray-700">Rating:</label>
    <input
      type="number"
      id="rating"
      name="rating"
      value={formik.values.rating}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="mb-1 p-2 border border-gray-300 rounded w-full"
    />
    {formik.touched.rating && formik.errors.rating ? <p className="mb-4 text-red-500">{formik.errors.rating}</p> : null}

    <label htmlFor="comments" className="mb-2 text-gray-700">Comments:</label>
    <textarea
      id="comments"
      name="comments"
      value={formik.values.comments}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="mb-1 p-2 border border-gray-300 rounded w-full"
    />
    {formik.touched.comments && formik.errors.comments ? <p className="mb-4 text-red-500">{formik.errors.comments}</p> : null}

    <label htmlFor="barber" className="mb-2 text-gray-700">Barber:</label>
    <select 
      id="barberId" 
      name="barberId" 
      value={formik.values.barberId} 
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="mb-1 p-2 border border-gray-300 rounded w-full"
    >
      <option value="">Select a barber</option>
      {barbers.map((barber) => (
        <option key={barber.id} value={barber.id}>{barber.name}</option>
      ))}
    </select>
    {formik.touched.barberId && formik.errors.barberId ? <p className="mb-4 text-red-500">{formik.errors.barberId}</p> : null}

    <button 
      type="submit" 
      className="bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600 transition duration-200"
    >
      {isLoading ? "Loading..." : "Submit Review"}
    </button>
    {serverErrors && <p className="mt-4 text-red-500">{serverErrors.error}</p>}
  </form>
  <div className="mt-4 w-full">
    <button 
      onClick={() => navigate('/')} 
      className="bg-gray-300 text-white p-2 rounded w-full hover:bg-gray-400 transition duration-200"
    >
      Cancel
    </button>
  </div>
</div>

  )
}

export default NewReview
