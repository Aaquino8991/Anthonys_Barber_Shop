import { useEffect, useState} from "react"
import { Link } from "react-router-dom"


const ReviewPage = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch("/api/reviews_index")
      .then((res) => res.json())
      .then((data) => {
        if(!data.error) {
          setReviews(data)
        } else {
          console.error(data.error)
        }
      })

  }, [])

  return (
    <div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.review_id}>
            <h2>{review.title}</h2>
          </div>
        ))
      ) : (
        <div>
          <h2>No reviews</h2>
          <Link to="/new_review">Write a review</Link>
        </div>
      )}
    </div>
  )
}

export default ReviewPage