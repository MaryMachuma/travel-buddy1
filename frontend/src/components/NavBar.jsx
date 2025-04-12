import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaPlane } from 'react-icons/fa'; 

function NavBar() {
  return (
  <div>
    <div className="nav-logo">
    <img src="https://i.imgur.com/9UUHLHI.png" className="logo"/>
    </div>
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-icon-link">
          <FaHome size={20} title="home" />
        </Link>
      </div>
      <div className="nav-logo">
      </div>
      <Link to="/login">
        Login
      </Link>
      <div className="nav-right">
        <Link to="/account" className="nav-icon-link">
          <FaUser size={20} title="Create Account" />
        </Link>
        </div>
        <Link to="/trips" className="plane">
          <FaPlane size={20} title="Your Trips" />
        </Link>
    </nav>
  </div>
  );
}

export default NavBar;
