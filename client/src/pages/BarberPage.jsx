import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const BarberPage = () => {
	const navigate = useNavigate()
	const [barbers, setBarbers] = useState([])

	useEffect(() => {
		fetch('api/barbers')
		.then((res) => res.json())
		.then((data) => setBarbers(data))
	}, [])

  return (
		<div className="flex flex-col items-center">
			<section>
				<div>
					<div>
						{barbers.map((barber) => (
							<div key={barber.id} className="shadow-md p-5 rounded">
								<div>{barber.name}</div>
							</div>
						))}
					</div>
				</div>
			</section>
			<button onClick={() => navigate('/create-barber')} className="bg-gray-500 text-white p-2 rounded-md">Add Barber</button>
		</div>
  )
}

export default BarberPage