import { Button } from "../../ui";
import { theme } from "../../../styles/theme";

function ProductCard({ item, isProduct, onAddToCart, onNavigate, onError }) {
  const id = item.id;
  const name = isProduct ? item.name : item.title;
  const price = isProduct ? `₹${item.price}` : null;
  const category = isProduct ? item.category : 'New Collection';
  const img = isProduct ? item.img : item.image;
  const inStock = isProduct ? item.stockQuantity > 0 : true;

  const handleCardClick = () => {
    isProduct ? onNavigate(`/product/${id}`) : onNavigate('/ProductsList');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (isProduct && inStock) {
      onAddToCart(item);
    } else if (!inStock) {
      onError('Out of stock');
    } else {
      onNavigate('/ProductsList');
    }
  };

  return (
    <div style={{ flex: 'none', width: 'clamp(220px, 28vw, 320px)' }}>
      <div
        className="overflow-hidden relative group cursor-pointer"
        style={{ aspectRatio: '3/4', marginBottom: '16px', backgroundColor: theme.colors.backgroundDark }}
        onClick={handleCardClick}
      >
        {img ? (
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ objectPosition: 'top' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
            No Image
          </div>
        )}
        <Button
          variant="default"
          size="icon"
          disabled={!inStock}
          className="absolute opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          style={{ bottom: '24px', right: '24px', backgroundColor: theme.colors.secondary, color: theme.colors.text.light }}
          onClick={handleAddClick}
          aria-label="Add to cart"
        >
          <span className="material-symbols-outlined">add</span>
        </Button>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium uppercase tracking-tight" style={{ fontSize: '14px', color: theme.colors.text.primary }}>{name}</h4>
          <p className="uppercase tracking-widest" style={{ fontSize: '10px', marginTop: '4px', color: theme.colors.text.secondary }}>{category}</p>
        </div>
        {price && <span className="font-medium" style={{ fontSize: '14px', color: theme.colors.secondary }}>{price}</span>}
      </div>
    </div>
  );
}

export default ProductCard;
