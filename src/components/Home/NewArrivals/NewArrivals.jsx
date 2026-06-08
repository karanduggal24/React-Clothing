import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, addToCartBackend } from "../../../features/Slices/CartSlice";
import { toast } from "react-toastify";
import { Button } from "../../ui";
import ProductCard from "./ProductCard";
import { theme } from "../../../styles/theme";

function NewArrivals({ products, fallbackSlides }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const handleAddToCart = async (product) => {
    dispatch(addToCart(product));
    try {
      await dispatch(addToCartBackend(product)).unwrap();
    } catch {
      // optimistic update already applied
    }
  };

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' });
    }
  };

  const newArrivals = products && products.length > 0 ? products.slice(0, 6) : null;
  const displayItems = newArrivals || fallbackSlides;

  return (
    <section style={{ paddingTop: '128px', paddingBottom: '128px', backgroundColor: theme.colors.background }}>

      {/* Section header */}
      <div
        className="flex justify-between items-end"
        style={{ padding: '0 32px', marginBottom: '64px', maxWidth: '1920px', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div style={{ maxWidth: '400px' }}>
          <h2
            className="uppercase tracking-[0.2em]"
            style={{ fontSize: '11px', marginBottom: '16px', color: theme.colors.text.primary }}
          >
            02 / New Arrivals
          </h2>
          <h3
            className="font-black tracking-tighter"
            style={{ fontSize: '2.5rem', color: theme.colors.text.primary }}
          >
            THE COLLECTION
          </h3>
        </div>
        <div className="hidden md:flex" style={{ gap: '16px' }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
          </Button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar"
        style={{ gap: '32px', padding: '0 32px', scrollBehavior: 'smooth' }}
      >
        {displayItems.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            isProduct={newArrivals !== null}
            onAddToCart={handleAddToCart}
            onNavigate={navigate}
            onError={(msg) => toast.error(msg)}
          />
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;
