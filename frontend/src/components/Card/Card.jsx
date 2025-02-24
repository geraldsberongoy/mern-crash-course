import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

const Card = ({
  product,
  setProducts,
  setIsModalOpen,
  setSelectedProductId,
  setSelectedProduct,
}) => {
  return (
    <div className="card bg-base-200 card-lg group min-w-68 shadow-xl">
      <figure className="card-image bg-base-300 relative h-52 w-full">
        <div className="absolute top-2 right-2 flex opacity-0 transition-opacity group-hover:opacity-100">
          <Link to={"/edit/" + product._id}>
            <div
              className="btn btn-square btn-ghost text-primary tooltip tooltip-left"
              data-tip="Edit Product"
            >
              <FontAwesomeIcon
                size="xl"
                icon={faPenToSquare}
                onClick={() => {
                  setSelectedProductId(product._id);
                  setSelectedProduct(product);
                }}
              />
            </div>
          </Link>
          <div
            className="btn btn-square btn-ghost text-primary tooltip tooltip-left"
            data-tip="Delete Product"
          >
            <FontAwesomeIcon
              size="xl"
              icon={faTrash}
              onClick={() => {
                setSelectedProductId(product._id);
                setIsModalOpen(true);
                setSelectedProduct(product);
              }}
            />
          </div>
        </div>

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
