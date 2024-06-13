import { useEffect, useState, createContext } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NavBar from "./NavBar"
import Login from "../pages/Login"
import ReviewPage from "../pages/ClientReviewPage"
import NewReview from "../pages/NewReview"
import NotFoundPage from '../pages/NotFoundPage'
import EditReviewPage from "../pages/EditReviewPage"
import BarberPage from "../pages/BarberPage"
import BarberForm from "./BarberForm"
import AppointmentPage from "../pages/AppointmentPage"
import NewAppointment from "../pages/NewAppointment"
import EditAppointmentPage from "./EditAppointmentPage"

export const ClientContext = createContext() 

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
      <ClientContext.Provider value={{ client, setClient }}>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login onLogin={setClient} />} />
          {client ? (
            <>
              <Route path="/new_appointment" element={<NewAppointment />} />
              <Route path="/appointments" element={<AppointmentPage />} />
              <Route path="/edit_appointment/:id" element={<EditAppointmentPage />} />
              <Route path="/new_review" element={<NewReview />} />
              <Route path="/" element={<ReviewPage />} />
            </>
          ) : (
            <Route path="/*" element={<Login onLogin={setClient} />} />
          )}
          <Route path="/edit-review/:id" element={<EditReviewPage />} />
          <Route path="/barbers" element={<BarberPage />} />
          <Route path="/create-barber" element={<BarberForm />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ClientContext.Provider>
    </Router>
  );
}

export default App
