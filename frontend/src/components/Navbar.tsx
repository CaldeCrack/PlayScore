import { Home, User as UserIcon, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import '../styles/Navbar.css'
import { useBoundStore } from '../stores/boundStore'


const Navbar = () => {
  const navigate = useNavigate()
  const { user, setUser } = useBoundStore()

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      {/* Left: Home icon */}
      <div className="navbar-left">
        <Link to='/' className="navbar-link">
          <Home size={20} />
        </Link>
      </div>

      {/* Right: Profile + Logout */}
      <div className="navbar-right">
        <Link to={user ? '/profile' : '/login'} className="navbar-link">
          <UserIcon size={20} />
        </Link>
        {user && (
          <button className="navbar-button" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar