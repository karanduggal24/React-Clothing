import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/ProductsList' },
    { label: 'Cart', path: '/cart' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <footer className="bg-[#f6f3f2] flex flex-col items-center" style={{ padding: '96px 48px' }}>
      <div className="flex flex-col items-center" style={{ gap: '24px', marginBottom: '48px' }}>
        <span
          className="font-black tracking-tighter text-[#1c1b1b] cursor-pointer"
          style={{ fontSize: '18px' }}
          onClick={() => navigate('/')}
        >
          CS ATELIER
        </span>
        <div className="flex flex-wrap justify-center" style={{ gap: '32px' }}>
          {links.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="text-[#777777] hover:text-[#004dea] transition-colors duration-300 uppercase font-bold tracking-[0.1em]"
              style={{ fontSize: '10px' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[#777777] uppercase font-bold tracking-[0.1em]" style={{ fontSize: '10px' }}>
        © {new Date().getFullYear()} CS ATELIER. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}

export default Footer;
