import { Link, useNavigate } from "react-router-dom"


const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <section>
      <h1>404 Not Found</h1>
      <p>Nothing to see here</p>
      <button onClick={() => navigate('/')}>Go Back</button>
    </section>
  )
}

export default NotFoundPage