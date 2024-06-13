import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ReviewCard from "../components/ReviewCard"

const ClientReviewPage = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [client, setClient] = useState([])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    fetch("/api/reviews_index")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setReviews(data)
        } else {
          console.error(data.error)
        }
      })
      .catch((error) => console.error("Error fetching reviews:", error))
  }, [])

  useEffect(() => {
    fetch('/api/clients')
    .then((res) => res.json())
    .then((data) => {
      if (!data.error) {
        setClient(data)
      } else {
        console.error(data.error)
      }
    })
  }, [])

  const handleDelete = (reviewId) => {
    fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.message) {
          setReviews((prevReviews) => prevReviews.filter((review) => review.review_id !== reviewId))
        } else {
          setErrors([response.error])
        }
      })
      .catch((error) => setErrors(["Failed to delete review"]))
  }

  return (
    <section>
      <h2 className="text-center text-3xl">Hello {client.name}</h2>
      {reviews.length > 0 ? (
        <div>
          <h2 className="text-center font-bold">My Reviews</h2>
          {reviews.map((review) => (
            <ReviewCard 
              key={review.review_id} 
              review={review} 
              handleDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h3>No reviews</h3>
          <button onClick={() => navigate('/new_review')} className="bg-gray-400 hover:bg-gray-500 p-2 rounded-md text-white">Write a review</button>
        </div>
      )}

      {errors.length > 0 && (
        <div>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </section>
  )
}

export default ClientReviewPage
