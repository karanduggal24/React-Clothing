import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/Slices/authSlice';
import { selectCartTotalItems } from '../../features/Slices/CartSlice';
import logo from '/src/assets/Clothing.png';
import { Menu, X } from 'lucide-react';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);
  const totalItems = useSelector(selectCartTotalItems);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Common NavLink className logic (padding removed)
  const navLinkClass = ({ isActive }) =>
    `font-sans text-base font-normal no-underline text-black rounded transition-all uppercase tracking-wider border-2 border-transparent relative
    ${isActive 
      ? 'bg-black text-white border-black font-medium after:content-[""] after:absolute after:-bottom-2 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-black after:rounded-full'
      : 'hover:bg-gray-50 hover:border-gray-200'
    }`;

  // Mobile NavLink className logic (padding removed)
  const mobileNavLinkClass = ({ isActive }) =>
    `block text-center text-lg uppercase tracking-wider w-full transition-colors
    ${isActive ? 'bg-black text-white font-semibold' : 'hover:bg-gray-100'}`;


  return (
    <div className="w-full bg-white shadow-md border-b-2 border-black  top-0 z-50">
      {/* Kept your inline padding and removed the conflicting `px-5` class */}
      <nav style={{paddingLeft:"10px", paddingRight:"10px"}} className="w-full mx-auto">
        {/* Converted `m-0`, `min-h-80px` (corrected to min-h-[80px]), `p-0` to inline styles */}
        <div style={{ margin: 0, minHeight: '80px', padding: 0 }} className="flex justify-around items-center">
          {/* Logo */}
          <div className="shrink-0">
            <img 
              src={logo} 
              alt="logo" 
              className="w-[75px] h-[75px] cursor-pointer" 
              onClick={() => handleNavigate('/')} 
            />
          </div>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <ul className="hidden md:flex justify-around w-full items-center">
            {/* Converted `px-5 py-3` to inline style */}
            <li><NavLink to="/" className={navLinkClass} style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>Home</NavLink></li>
            <li><NavLink to="/ProductsList" className={navLinkClass} style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>Product List</NavLink></li>
            <li><NavLink to="/cart" className={navLinkClass} style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>Cart ({totalItems})</NavLink></li>
            {isAdmin && (
              <li><NavLink to="/ProductForm" className={navLinkClass} style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>Admin Panel</NavLink></li>
            )}
          </ul>
          
          {/* Desktop Auth Section - Hidden on mobile */}
          {/* Converted `gap-3` to inline style */}
          <div style={{ gap: '0.75rem' }} className="hidden md:flex items-center">
             {!isAuthenticated ? (
                <NavLink to="/login" className={navLinkClass} style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>Login</NavLink>
              ) : (
                <div style={{ gap: '0.75rem' }} className="flex items-center">
                  <div className="font-sans text-black">
                    Welcome, {user?.username} {isAdmin && '(Admin)'}
                  </div>
                  {/* Kept your inline padding and removed the conflicting `px-6 py-3` classes */}
                  <button 
                    style={{padding:"10px"}}
                    className="rounded bg-white text-black border-2 border-black cursor-pointer font-sans text-sm font-medium uppercase tracking-wider transition-all min-w-[100px] hover:bg-black hover:text-white" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black focus:outline-none">
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slides in from the right */}
        <div 
          className={`
            fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50
            transform transition-transform duration-300 ease-in-out
            md:hidden 
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Converted `p-5` to inline style */}
          <div style={{ padding: '1.25rem' }} className="flex justify-end">
             <button onClick={() => setIsMenuOpen(false)} className="text-black focus:outline-none">
                <X size={28} />
             </button>
          </div>
          {/* Converted `-mt-10` to inline style */}
          <ul style={{ marginTop: '-2.5rem' }} className="flex flex-col items-center justify-center h-full">
              {/* Converted `py-4 px-6` from mobileNavLinkClass to inline styles */}
              <li><NavLink to="/" className={mobileNavLinkClass} style={{ padding: '1rem 1.5rem' }} onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/ProductsList" className={mobileNavLinkClass} style={{ padding: '1rem 1.5rem' }} onClick={() => setIsMenuOpen(false)}>Product List</NavLink></li>
              <li><NavLink to="/cart" className={mobileNavLinkClass} style={{ padding: '1rem 1.5rem' }} onClick={() => setIsMenuOpen(false)}>Cart ({totalItems})</NavLink></li>
              {isAdmin && (
                <li><NavLink to="/ProductForm" className={mobileNavLinkClass} style={{ padding: '1rem 1.5rem' }} onClick={() => setIsMenuOpen(false)}>Admin Panel</NavLink></li>
              )}
              {/* Converted `mt-8 px-6` to inline styles */}
              <li style={{ marginTop: '2rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }} className="w-full">
                {!isAuthenticated ? (
                  // Converted `px-6 py-3` to inline style
                  <NavLink to="/login" style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }} className="block text-center w-full rounded bg-black text-white border-2 border-black cursor-pointer font-sans text-lg font-medium uppercase tracking-wider transition-all hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                ) : (
                  <div className="text-center">
                    {/* Converted `mb-4` to inline style */}
                    <div style={{ marginBottom: '1rem' }} className="font-sans text-black">
                      Welcome, {user?.username} {isAdmin && '(Admin)'}
                    </div>
                    {/* Converted `px-6 py-3` to inline style */}
                    <button 
                      style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
                      className="w-full rounded bg-white text-black border-2 border-black cursor-pointer font-sans text-lg font-medium uppercase tracking-wider transition-all hover:bg-black hover:text-white" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
          </ul>
        </div>
      </nav>
      {/* Optional: Overlay for when the menu is open */}
      {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}></div>}
    </div>
  );
}

export default Header;