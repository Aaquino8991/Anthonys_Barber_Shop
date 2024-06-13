import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ClientContext } from './App';

const NavBar = () => {
  const context = useContext(ClientContext)

  if (!context) {
    return null;
  }

  const { client, setClient } = context

  const handleLogoutClick = () => {
    fetch('/api/logout', {
      method: 'DELETE',
    })
    .then((res) => {
      if (res.ok) {
        setClient(null);
      }
    });
  };

  return (
    <nav className="bg-gray-700 border-b border-gray-800">
      <ul className="flex h-20 items-center justify-between px-7">
        <li>
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        </li>
        {client ? (
          <>
            <li>
              <Link to="/new_review" className="text-white hover:text-gray-300">Add Review</Link>
            </li>
            <li>
              <Link to="/appointments" className="text-white hover:text-gray-300">View Appointments</Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:text-gray-300" onClick={handleLogoutClick}>Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/barbers" className="text-white hover:text-gray-300">Barbers</Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
