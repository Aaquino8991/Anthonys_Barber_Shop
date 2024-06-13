import { useNavigate } from "react-router-dom"


const ViewAppointments = ({ appointment, handleDelete }) => {
  const navigate = useNavigate()

  return (
    <div className="drop-shadow-md bg-white p-6 rounded-lg w-full max-w-lg mx-auto mb-4">
      <h3 className="text-xl font-bold mb-2">{appointment.service_type}</h3>
      <p className="mb-2"><strong>When:</strong> {appointment.date}</p>
      <p className="mb-2"><strong>Time:</strong> {appointment.time}</p>
      <div className="flex space-x-4">
        <button 
          onClick={() => handleDelete(appointment.id)}
          className="bg-red-400 text-white p-2 rounded hover:bg-red-500 transition duration-200"
        >
          Delete
        </button>
        <button 
          onClick={() => navigate(`/edit_appointment/${appointment.id}`)} 
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

export default ViewAppointments