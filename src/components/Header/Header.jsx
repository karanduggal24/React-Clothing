import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/Slices/authSlice';
import { selectCartTotalItems, clearCart } from '../../features/Slices/CartSlice';
import { resetPaymentForm } from '../../features/Slices/PaymentFormSlice';
import { X, Search } from 'lucide-react';
import SearchBar from '../../features/products/SearchBar/SearchBar';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useSelector((state) => state.auth);
  const totalItems = useSelector(selectCartTotalItems);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(resetPaymentForm());
    setIsMenuOpen(false);
    navigate('/');
  };

  const close = () => setIsMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/ProductsList', label: 'Shop' },
    ...(isAuthenticated ? [{ to: '/profile', label: 'Profile' }] : []),
    ...(isAdmin ? [{ to: '/admin/dashboard', label: 'Admin' }] : []),
  ];

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl transition-all duration-300"
        style={{ backgroundColor: 'rgba(252,249,248,0.85)' }}
      >
        <div
          className="flex items-center w-full max-w-[1920px] mx-auto relative"
          style={{ padding: '20px 32px', gap: '32px' }}
        >
          {/* Logo */}
          <div style={{ flex: '0 0 auto', minWidth: '120px' }}>
            <span
              className="text-xl font-black tracking-tighter text-[#1c1b1b] cursor-pointer select-none"
              onClick={() => navigate('/')}
            >
              CS ATELIER
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center" style={{ gap: '36px', flex: '0 0 auto' }}>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-[#004dea] border-b border-[#004dea] font-medium tracking-tight transition-colors text-sm'
                    : 'text-[#1c1b1b] hover:text-[#004dea] font-medium tracking-tight transition-colors text-sm'
                }
                style={{ paddingBottom: '4px' }}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Search bar — absolute centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2" style={{ width: '100%', maxWidth: '480px', pointerEvents: 'auto' }}>
            <SearchBar />
          </div>

          {/* Spacer to push right icons */}
          <div className="flex-1"></div>

          {/* Right icons */}
          <div
            className="flex items-center"
            style={{ gap: '20px', flex: '0 0 auto', minWidth: '120px', justifyContent: 'flex-end' }}
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden hover:opacity-70 transition-opacity"
              aria-label="Search"
            >
              <Search size={20} className="text-[#1c1b1b]" />
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="hover:opacity-70 transition-opacity duration-300 relative cursor-pointer"
              aria-label="Cart"
            >
              <span className="hover:cursor-pointer material-symbols-outlined text-[#1c1b1b]">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#004dea] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => navigate('/login')}
                className="hover:opacity-70 transition-opacity duration-300"
                aria-label="Login"
              >
                <span className="material-symbols-outlined text-[#1c1b1b]">person</span>
              </button>
            ) : (
              <>
                {user?.profile_picture ? (
                  <button
                    onClick={() => navigate('/profile')}
                    className="hidden md:block hover:opacity-70 transition-opacity duration-300"
                    aria-label="Profile"
                  >
                    <img 
                      src={user.profile_picture} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#1c1b1b]"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/profile')}
                    className="hidden md:block hover:opacity-70 transition-opacity duration-300"
                    aria-label="Profile"
                  >
                    <span className="material-symbols-outlined text-[#1c1b1b]">person</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="hidden md:block uppercase text-[10px] tracking-widest text-[#1c1b1b] hover:text-[#004dea] transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-[#1c1b1b]">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile search overlay */}
      <SearchBar isMobile={true} isVisible={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#fcf9f8] z-50 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ padding: '32px 24px' }}
      >
        <div className="flex justify-between items-center" style={{ marginBottom: '48px' }}>
          <span className="text-xl font-black tracking-tighter text-[#1c1b1b]">CS ATELIER</span>
          <button onClick={close} aria-label="Close menu">
            <X size={20} className="text-[#1c1b1b]" />
          </button>
        </div>

        <nav className="flex flex-col" style={{ gap: '32px' }}>
          {[...navLinks, { to: '/cart', label: `Cart (${totalItems})` }].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                `font-black text-3xl tracking-tighter transition-colors ${
                  isActive ? 'text-[#004dea]' : 'text-[#1c1b1b] hover:text-[#004dea]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute left-6 right-6" style={{ bottom: '48px' }}>
          {!isAuthenticated ? (
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <button
                onClick={() => { navigate('/login'); close(); }}
                className="w-full bg-[#1c1b1b] text-[#fcf9f8] uppercase text-xs tracking-widest font-medium"
                style={{ padding: '16px' }}
              >
                Login
              </button>
              <button
                onClick={() => { navigate('/signup'); close(); }}
                className="w-full border border-[#1c1b1b] text-[#1c1b1b] uppercase text-xs tracking-widest font-medium"
                style={{ padding: '16px' }}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full border border-[#1c1b1b] text-[#1c1b1b] uppercase text-xs tracking-widest font-medium"
              style={{ padding: '16px' }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={close} />
      )}
    </>
  );
}

export default Header;
