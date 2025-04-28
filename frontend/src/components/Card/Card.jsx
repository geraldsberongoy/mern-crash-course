import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCartPlus,
  faHeart,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare, faClock } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";

const Card = ({
  product,
  setProducts,
  setIsModalOpen,
  setSelectedProductId,
  setSelectedProduct,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { showNotification } = useNotification();

  // Check localStorage for favorite status on mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(product._id)) {
      setIsFavorite(true);
    }
  }, [product._id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Update state
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Update localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (newFavoriteStatus) {
      // Add to favorites if not already included
      if (!favorites.includes(product._id)) {
        favorites.push(product._id);
        showNotification(`Added "${product.name}" to favorites`, "info");
      }
    } else {
      // Remove from favorites
      const index = favorites.indexOf(product._id);
      if (index > -1) {
        favorites.splice(index, 1);
        showNotification(`Removed "${product.name}" from favorites`, "info");
      }
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const calculateDiscount = () => {
    if (!product.discount) return null;
    return (
      <div className="bg-secondary absolute top-2 left-2 rounded-lg px-2 py-1 text-xs font-bold text-white shadow-md">
        <FontAwesomeIcon icon={faTag} className="mr-1" />
        {product.discount}% OFF
      </div>
    );
  };

  const handleAddToCart = () => {
    // In a real app, this would add to cart state or call an API
    // For now, we'll just show a notification
    showNotification(`Added "${product.name}" to cart`, "success");

    // You could implement a cart context and persist to localStorage similar to favorites
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === product._id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.updatedPrice || product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="card bg-base-200 h-full transition-all duration-300 hover:shadow-2xl">
      {/* Image container with overlay actions */}
      <figure className="bg-base-300 relative h-52 w-full overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          className={`h-52 w-full object-cover transition-transform duration-500 hover:scale-110 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.target.src = "https://placehold.co/300x300?text=No+Image";
            setIsImageLoaded(true);
          }}
        />

        {/* Discount badge */}
        {calculateDiscount()}

        {/* Action buttons overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`btn btn-circle btn-sm ${isFavorite ? "btn-error" : "btn-ghost bg-white/30"}`}
              aria-label="Add to favorites"
            >
              <FontAwesomeIcon
                icon={faHeart}
                className={isFavorite ? "text-white" : ""}
              />
            </button>
            <Link
              to={`/edit/${product._id}`}
              className="btn btn-circle btn-sm btn-ghost bg-white/30"
              aria-label="Edit product"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
            <button
              onClick={() => {
                setSelectedProductId(product._id);
                setIsModalOpen(true);
                setSelectedProduct(product);
              }}
              className="btn btn-circle btn-sm btn-ghost bg-white/30"
              aria-label="Delete product"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </figure>

      {/* Card content */}
      <div className="card-body p-4">
        <h2
          className="card-title line-clamp-1 text-lg font-bold"
          title={product.name}
        >
          {product.name}
        </h2>

        {/* Description - if available */}
        {product.description && (
          <p className="line-clamp-2 text-sm opacity-80">
            {product.description}
          </p>
        )}

        {/* Price section */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-primary text-lg font-bold">
            ${(product.updatedPrice || product.price).toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm line-through opacity-60">
              ${product.price?.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock indicator - if available */}
        {product.stock !== undefined && (
          <div className="mt-1 text-xs">
            Stock:{" "}
            <span className={product.stock > 0 ? "text-success" : "text-error"}>
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </span>
          </div>
        )}

        {/* Creator and date info */}
        <div className="mt-auto flex items-center justify-between text-xs opacity-70">
          <div>By {product.creator || "Anonymous"}</div>
          {product.createdAt && (
            <div
              className="flex items-center gap-1"
              title={`Created on ${formatDate(product.createdAt)}`}
            >
              <FontAwesomeIcon icon={faClock} />
              {formatDate(product.createdAt)}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="card-actions mt-3 justify-end">
          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={handleAddToCart}
            disabled={product.stock !== undefined && product.stock <= 0}
          >
            <FontAwesomeIcon icon={faCartPlus} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
