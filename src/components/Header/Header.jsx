import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/Slices/authSlice';
import styles from './Header.module.css'


function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={styles.main} >
      <nav>
        <div className={styles.NavComp}>
          <ul>
            <li>
              <NavLink to="/">Product List</NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink to="/ProductForm">Admin Panel</NavLink>
              </li>
            )}
            {!isAuthenticated && (
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <div className={styles.UserInfo}>
                  Welcome, {user?.username} {isAdmin ? '(Admin)' : ''}
                </div>
                <button className={styles.primary} onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
