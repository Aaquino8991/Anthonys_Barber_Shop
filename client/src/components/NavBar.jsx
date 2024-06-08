import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ client, setClient }) => {

  const handleLogoutClick = () => {
    fetch('/api/logout', {
      method: 'DELETE',
    })
    .then((res) => {
      if (res.ok) {
        setClient(null);
      }
    })
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {client ? (
          <>
            <li>
              <Link to='/new_review'>Add Review</Link>
            </li>
            <li>
              <Link to="/login" onClick={handleLogoutClick}>Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/barbers">Barbers</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
