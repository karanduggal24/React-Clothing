import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  fetchCartFromBackend,
  updateCartItemBackend,
  removeFromCartBackend,
  clearCartBackend,
} from "../../Slices/CartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal/DeleteConfirmModal";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

function ProductCart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const loading = useSelector((state) => state.cart.loading);
  const synced = useSelector((state) => state.cart.synced);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    document.title = `Cart • ${totalItems} item${totalItems > 1 ? "s" : ""}`;
    if (!synced) {
      dispatch(fetchCartFromBackend()).catch((err) =>
        console.error("Cart fetch failed:", err)
      );
    }
  }, [totalItems, synced, dispatch]);

  const handleIncrement = async (item) => {
    if (item.quantity >= item.stockQuantity) {
      toast.warning(
        `${item.name} reached stock limit (${item.stockQuantity}).`,
        { autoClose: 2000 }
      );
      return;
    }

    dispatch(incrementQuantity(item.id));

    if (item.cartItemId) {
      try {
        await dispatch(
          updateCartItemBackend({
            cartItemId: item.cartItemId,
            quantity: item.quantity + 1,
          })
        ).unwrap();
      } catch {
        console.error("Quantity update failed.");
      }
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity > 1) {
      dispatch(decrementQuantity(item.id));

      if (item.cartItemId) {
        try {
          await dispatch(
            updateCartItemBackend({
              cartItemId: item.cartItemId,
              quantity: item.quantity - 1,
            })
          ).unwrap();
        } catch {
          console.error("Quantity update failed.");
        }
      }
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = async (item) => {
    if (item.cartItemId) {
      try {
        await dispatch(removeFromCartBackend(item.cartItemId)).unwrap();
      } catch {
        dispatch(removeFromCart(item.id));
      }
    } else dispatch(removeFromCart(item.id));
  };

  const handleClearCartConfirm = async () => {
    try {
      await dispatch(clearCartBackend()).unwrap();
    } catch {
      dispatch(clearCart());
    } finally {
      setShowClearModal(false);
    }
  };

  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        padding: "28px 18px 40px",
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between border-b border-gray-300"
        style={{
          paddingBottom: "12px",
          marginBottom: "28px",
        }}
      >
        <h2
          className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900"
          style={{ margin: 0 }}
        >
          Your Cart
        </h2>

        <button
          onClick={() => setShowClearModal(true)}
          className="text-sm text-gray-600 hover:text-black transition"
          style={{ margin: 0, padding: 0 }}
        >
          Clear All
        </button>
      </div>

      {/* CART ITEMS */}
      <div
        className="flex flex-col"
        style={{
          gap: "16px",
          marginBottom: "36px",
        }}
      >
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            loading={loading}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
            onProductClick={(id) => navigate(`/product/${id}`)}
          />
        ))}
      </div>

      {/* SUMMARY */}
      <div
        className="bg-white rounded-xl shadow-md border border-gray-200"
        style={{
          padding: "20px",
        }}
      >
        <CartSummary
          totalItems={totalItems}
          totalPrice={totalPrice}
          loading={loading}
          onClearCart={() => setShowClearModal(true)}
        />
      </div>

      {/* MODAL */}
      <DeleteConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearCartConfirm}
        productName={`${totalItems} item${totalItems > 1 ? "s" : ""}`}
        loading={loading}
        type="cart"
      />
    </div>
  );
}

export default ProductCart;
