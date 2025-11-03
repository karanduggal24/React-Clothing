import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/Slices/authSlice';
import { selectCartTotalItems } from '../../features/Slices/CartSlice';
import { Menu, Search, X, ShoppingCart } from 'lucide-react';
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
    <header className="w-full bg-white shadow-md border-b-2 border-black  top-0 z-1000 sticky">
      <div className=" mx-auto" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        {/* Top bar */}
        <div
          className="flex items-center justify-between h-20"
          style={{ paddingInline: '8px' }}
        >
          {/* Left - Logo */}
          <div
            className="cursor-pointer flex items-center justify-center"
            style={{ width: '70px', height: '70px', marginRight: '10px' }}
            onClick={() => navigate('/')}
          >
            <span
              className=" select-none text-4xl font-bold text-black tracking-tight hover:text-gray-700 transition-colors"
              style={{ margin: 0 }}
            >
              <h1 style={{userSelect:"none"}}>CS</h1>
            </span>
          </div>

          {/* Center - Search (desktop only) */}
          <div className="hidden md:flex flex-1 justify-center" style={{ marginInline: '24px' }}>
            <div style={{ width: '100%', maxWidth: '700px' }}>
              <SearchBar />
            </div>
          </div>

          {/* Right - Nav / Buttons */}
          <div className="flex items-center" style={{ gap: '24px' }}>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center" style={{ gap: '16px' }}>
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
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <span
                    className="text-sm font-medium"
                    style={{ padding: '8px', margin: 0 }}
                  >
                    Welcome, {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-black text-white rounded uppercase font-medium text-sm border-2 border-black hover:bg-white hover:text-black transition cursor-pointer"
                    style={{ padding: '8px 16px' }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile buttons */}
            <div className="flex items-center md:hidden" style={{ gap: '8px' }}>
              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                aria-label="View cart"
                className="relative border border-gray-300 rounded-full hover:bg-gray-100 transition"
                style={{ padding: '8px' }}
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {totalItems > 0 && (
                  <span
                    className="absolute bg-black text-white text-xs rounded-full flex items-center justify-center"
                    style={{
                      top: '-4px',
                      right: '-4px',
                      width: '20px',
                      height: '20px',
                      fontSize: '10px',
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
                className="border border-gray-300 rounded-full hover:bg-gray-100 transition"
                style={{ padding: '8px' }}
              >
                <Search className="w-6 h-6 text-gray-700" />
              </button>

              {/* Menu */}
              <button
                onClick={() => setIsMenuOpen((s) => !s)}
                aria-label="Open menu"
                className="border border-gray-300 rounded-full hover:bg-gray-100 transition"
                style={{ padding: '8px' }}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ padding: '10px' }}
      >
        <div
          className="flex items-center justify-between border-b border-gray-200"
          style={{ padding: '16px 8px' }}
        >
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div
              className="cursor-pointer flex items-center justify-center"
              style={{ width: '40px', height: '40px' }}
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
            >
              <span
                className="text-2xl font-bold text-black hover:text-gray-700 transition"
                style={{ margin: 0 }}
              >
                CS
              </span>
            </div>
            <span className="font-semibold">Menu</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col" style={{ gap: '12px', padding: '24px 12px' }}>
          <li>
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)} style={{ padding: '12px 0' }}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/ProductsList" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)} style={{ padding: '12px 0' }}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)} style={{ padding: '12px 0' }}>
              Cart ({totalItems})
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink to="/ProductForm" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)} style={{ padding: '12px 0' }}>
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
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="text-center font-medium">Welcome, {user?.username}</div>
                <button
                  onClick={handleLogout}
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

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Search Overlay */}
      <SearchBar isMobile={true} isVisible={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

export default Header;
