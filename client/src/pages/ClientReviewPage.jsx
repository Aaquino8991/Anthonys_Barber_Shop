import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClientReviewPage = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([]);
  const [client, setClient] = useState([])
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch("/api/reviews_index")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setReviews(data);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

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
          setReviews(reviews.filter((review) => review.id !== reviewId));
        } else {
          setErrors([response.error]);
        }
      })
      .catch((error) => setErrors(["Failed to delete review"]));
  };

  return (
    <section style={{display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h2>Hello {client.name}</h2>
      {reviews.length > 0 ? (
        <div>
          <h2 style={{textAlign: 'center'}}>My Reviews</h2>
          {reviews.map((review) => (
            <div key={review.review_id} className="review-card">
              <h3>{review.title}</h3>
              <p><strong>Date Posted:</strong> {review.date_posted}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Comment:</strong> {review.comments}</p>
              <button onClick={() => handleDelete(review.review_id)}>Delete</button>
              <button onClick={() => navigate(`/edit-review/${review.review_id}`)}>Edit</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3 style={{textAlign: 'center'}}>No reviews</h3>
          <button onClick={() => navigate('/new_review')}>Write a review</button>
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
  );
};

export default ClientReviewPage;
