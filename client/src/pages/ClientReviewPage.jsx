import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


const ReviewPage = () => {
  const [reviews, setReviews] = useState([])
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

  const handleDelete = (reviewId) => {
    fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.message) {
        setReviews(reviews.filter((review) => review.review_id !== reviewId))
      } else {
        setErrors([response.error])
      }
    })
    .catch((error) => setErrors(["Failed to delete review"]))
  }

  const handleEdit = (reviewId, updatedData) => {
    fetch(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData)
    })
    .then((res) => res.json())
    .then((response) => {
      if (!response.error) {
        setReviews(reviews.map((review) => review.review_id === reviewId ? response : review))
      } else {
        setErrors([response.error])
      }
    })
    .catch((error) => setErrors(["Failed to edit review"]))
  }

  return (
    <section>
      {reviews.length > 0 ? (
        <div>
        <h2>My Reviews</h2>
        {reviews.map((review) => (
          <div key={review.review_id} className="review-card">
            <h3>{review.title}</h3>
            <p><strong>Date Posted:</strong> {review.date_posted}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comments}</p>
            <button onClick={() => handleDelete(review.review_id)}>Delete</button>
            <button onClick={() => handleEdit(review.review_id, { title: "Updated Title" })}>Edit</button>
          </div>
        ))}
      </div>
      ) : (
        <div>
          <h2>No reviews</h2>
          <Link to="/new_review">Write a review</Link>
        </div>
      )}
    </section>
  )
}

export default ReviewPage