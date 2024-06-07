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
		<>
			<section>
				<div>
					<div>
						{barbers.map((barber) => (
							<div key={barber.id}>
								<div>{barber.name}</div>
							</div>
						))}
					</div>
				</div>
			</section>
			<button onClick={() => navigate('/create-barber')}>Add Barber</button>
		</>
  )
}

export default BarberPage