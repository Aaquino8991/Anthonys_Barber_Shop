import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditReviewPage = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch(`/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setReview(data);
          setTitle(data.title);
          setRating(data.rating);
          setComments(data.comments);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => console.error("Error fetching review:", error));
  }, []);

  const handleRatingChange = (e) => {
    const intRating = parseInt(e.target.value, 10)
    setRating(intRating)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, rating, comments }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.error) {
          setErrors([data.error]);
        } else {
          console.log("Updated Review")
        }
      })
      .catch((error) => setErrors(["Failed to edit review"]));
  };

  if (!review) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Review</h2>
      <form onSubmit={handleEditSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={handleRatingChange}
          />
        </div>
        <div>
          <label>Comments:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)}>Cancel</button>
      </form>
      {errors.length > 0 && (
        <div>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditReviewPage;
