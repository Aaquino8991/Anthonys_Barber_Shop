import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ViewAppointments from "../components/ViewAppointments"


const AppointmentPage = () => {

    const navigate = useNavigate()
    const [client, setClient] = useState([])
    const [appointments, setAppointments] = useState([])
    const [errors, setErrors] = useState([])

    useEffect(() => {
        fetch('/api/my_appointments')
        .then((res) => res.json())
        .then((data) => {
            if (!data.error) {
                setAppointments(data)
            } else {
                setErrors(data.error)
            }
        })
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

      const handleDelete = (appointmentId) => {
        fetch(`/api/appointments/${appointmentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.message) {
              setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== appointmentId))
            } else {
              setErrors([response.error])
            }
          })
          .catch((error) => setErrors(["Failed to delete appointment"]))
      }

  return (
    <section className="flex flex-col items-center">
      <h2 className="text-3xl">Hello {client.name}</h2>
      {appointments.length > 0 ? (
        <div>
          <h2 style={{textAlign: 'center'}}>My Appointments</h2>
          {appointments.map((appointment) => (
            <ViewAppointments 
                key={appointment.id}
                appointment={appointment}
                handleDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-center">No appointments</h3>
          <button onClick={() => navigate('/new_appointment')} className="bg-gray-500 hover:bg-gray-400 text-white rounded-md p-2">Schedule an appointment</button>
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

export default AppointmentPage