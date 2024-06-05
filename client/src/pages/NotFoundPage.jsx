import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <section>
      <h1>404 Not Found</h1>
      <p>Nothing to see here</p>
      <Link to="/">Go Back</Link>
    </section>
  )
}

export default NotFoundPage