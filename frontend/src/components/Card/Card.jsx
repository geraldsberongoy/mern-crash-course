import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { set } from "mongoose";

const Card = ({
  product,
  setProducts,
  setIsModalOpen,
  setSelectedProductId,
  setSelectedProduct,
}) => {
  return (
    <div className="card bg-base-100 card-lg border-accent max-w-68 shadow-xl">
      <figure className="card-image bg-base-300 relative h-52 w-full">
        <FontAwesomeIcon
          size="lg"
          icon={faTrash}
          className="text-primary absolute top-5 right-5"
          onClick={() => {
            setSelectedProductId(product._id);
            setIsModalOpen(true);
            setSelectedProduct(product);
          }}
        />
        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full object-cover"
        />
      </figure>
      <div className="h-1/2 p-5">
        <h2 className="card-title">{product.name}</h2>
        <div className="flex items-center gap-2 text-center">
          <span className="text-secondary font-bold">
            ${product.updatedPrice}
          </span>
          {product.discount && (
            <>
              <span className="text-default text-sm line-through opacity-80">
                ${product.price}
              </span>
              <div className="badge badge-soft badge-secondary">
                -{product.discount}%
              </div>
            </>
          )}
        </div>
        <div className="card-actions justify-end pt-8">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
