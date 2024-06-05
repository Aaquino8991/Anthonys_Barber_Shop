import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NavBar from "./NavBar"
import Login from "../pages/Login"
import ReviewPage from "../pages/ClientReviewPage"
import NewReview from "../pages/NewReview"

const App = () => {
  const [client, setClient] = useState(null)

  useEffect(() => {
    fetch('/api/check_session')
      .then((res) => {
        if (res.ok) {
          res.json()
            .then((client) => setClient(client))
        }
      })
  }, [])

  return (
    <Router>
      <NavBar client={client} setClient={setClient} />
      <Routes>
        <Route path="/login" element={<Login onLogin={setClient} />} />
        {client ? (
          <>
            <Route path="/new_review" element={<NewReview client={client} />} />
            <Route path="/" element={<ReviewPage />} />
          </>
        ) : (
          <Route path="/*" element={<Login onLogin={setClient} />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
