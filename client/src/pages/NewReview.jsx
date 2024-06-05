import { useEffect, useState } from "react"

const NewReview = () => {
  const [title, setTitle] = useState("")
  const [rating, setRating] = useState("")
  const [comments, setComments] = useState("")
  const [barberId, setBarberId] = useState("")
  const [barbers, setBarbers] = useState([])
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch("/api/barbers")
      .then((res) => res.json())
      .then((data) => setBarbers(data))
      .catch((error) => console.error("Error fetching barbers:", error))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    const date_posted = new Date().toISOString()

    fetch("/api/reviews_index", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        rating,
        comments,
        date_posted,
        barber_id: barberId
      }),
    }).then((res) => {
      setIsLoading(false)
      if (res.ok) {
        res.json().then((newReview) => {
          console.log("Review submitted successfully:", newReview)
        })
      } else {
        res.json().then((err) => setErrors(err.errors))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="rating">Rating:</label>
      <input
        type="number"
        id="rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <label htmlFor="comments">Comments:</label>
      <textarea
        id="comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      <label htmlFor="barber">Barber:</label>
      <select id="barber" value={barberId} onChange={(e) => setBarberId(e.target.value)}>
        <option value="">Select a barber</option>
        {barbers.map((barber) => (
          <option key={barber.id} value={barber.id}>{barber.name}</option>
        ))}
      </select>

      <button type="submit">{isLoading ? "Loading..." : "Submit Review"}</button>
      {errors && <p>{errors}</p>}
    </form>
  )
}

export default NewReview
