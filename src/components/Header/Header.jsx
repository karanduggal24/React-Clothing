import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/Slices/authSlice';
import { selectCartTotalItems } from '../../features/Slices/CartSlice';
import logo from '/src/assets/Clothing.png';
import { Menu, Search, X } from 'lucide-react';
import SearchBar from '../../features/products/SearchBar/SearchBar';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);
  const totalItems = useSelector(selectCartTotalItems);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `font-sans text-sm font-medium no-underline text-black rounded transition-all uppercase tracking-wider border-2 border-transparent
    ${isActive ? 'bg-black text-white border-black' : 'hover:bg-gray-50 hover:border-gray-200'}`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-center text-lg uppercase tracking-wider w-full transition-colors
    ${isActive ? 'bg-black text-white font-semibold' : 'hover:bg-gray-100'}`;

  return (
    <header className="w-full bg-white shadow-md border-b-2 border-black top-0 z-50">
      <div
        className="max-w-7xl mx-auto"
        style={{ paddingLeft: '4rem', paddingRight: '4rem', marginLeft: 'auto', marginRight: 'auto' }}
      >
        {/* Row: logo | centered search | right actions */}
        <div className="flex items-center justify-between" style={{ height: '80px' }}>
          {/* Left: Logo */}
          <div className="shrink-0">
            <img
              src={logo}
              alt="logo"
              style={{ width: '75px', height: '75px', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </div>

          {/* Center: Search - visible on md+ */}
          <div
            className="flex-1 flex justify-center"
            style={{ paddingLeft: '4rem', paddingRight: '4rem' }}
          >
            <div className="w-full md:max-w-[720px]">
              <div className="hidden md:block">
                <SearchBar />
              </div>
            </div>
          </div>

          {/* Right: desktop nav/auth or mobile icons */}
          <div className="flex items-center gap-3">
            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-3">
              <NavLink to="/" className={navLinkClass} style={{ padding: '8px 16px' }}>
                Home
              </NavLink>
              <NavLink to="/ProductsList" className={navLinkClass} style={{ padding: '8px 16px' }}>
                Products
              </NavLink>
              <NavLink to="/cart" className={navLinkClass} style={{ padding: '8px 16px' }}>
                Cart ({totalItems})
              </NavLink>
              {isAdmin && (
                <NavLink to="/ProductForm" className={navLinkClass} style={{ padding: '8px 16px' }}>
                  Admin
                </NavLink>
              )}
              {!isAuthenticated ? (
                <NavLink to="/login" className={navLinkClass} style={{ padding: '8px 16px' }}>
                  Login
                </NavLink>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Welcome, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    style={{
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                    }}
                    className='bg-black text-white rounded uppercase font-medium text-sm border-2 border-black hover:bg-white hover:text-black transition cursor-pointer'
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile: search icon (opens search overlay) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="md:hidden border border-gray-300 rounded-full hover:bg-gray-100 transition"
              style={{ padding: '8px' }}
            >
              <Search className="w-6 h-6 text-gray-700" />
            </button>

            {/* Mobile: hamburger menu */}
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label="Open menu"
              className="md:hidden border border-gray-300 rounded-full hover:bg-gray-100 transition"
              style={{ padding: '8px' }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sliding menu (from right) */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div
          className="flex items-center justify-between border-b border-gray-200"
          style={{ padding: '16px' }}
        >
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="logo"
              style={{ width: '40px', height: '40px' }}
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
            />
            <span className="font-semibold">Menu</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <ul
          className="flex flex-col items-stretch justify-start gap-3"
          style={{ padding: '24px 16px' }}
        >
          <li>
            <NavLink
              to="/"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
              style={{ padding: '12px 0' }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ProductsList"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
              style={{ padding: '12px 0' }}
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cart"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
              style={{ padding: '12px 0' }}
            >
              Cart ({totalItems})
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink
                to="/ProductForm"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
                style={{ padding: '12px 0' }}
              >
                Admin Panel
              </NavLink>
            </li>
          )}

          <li style={{ marginTop: '24px' }}>
            {!isAuthenticated ? (
              <NavLink
                to="/login"
                className="block w-full text-center rounded bg-black text-white uppercase font-medium"
                onClick={() => setIsMenuOpen(false)}
                style={{ padding: '12px 0' }}
              >
                Login
              </NavLink>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="text-center font-medium">Welcome, {user?.username}</div>
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="w-full rounded bg-white text-black border-2 border-black uppercase font-medium"
                  style={{ padding: '12px 0' }}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile search overlay (from SearchBar) */}
      <SearchBar isMobile={true} isVisible={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

export default Header;
