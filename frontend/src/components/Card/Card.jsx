import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
const Card = ({ product }) => {
  return (
    <div className="card bg-base-100 card-lg border-accent relative max-w-68 shadow-xl">
      {/* <FontAwesomeIcon icon={faTrash} /> */}
      <figure className="card-image bg-base-300 h-52 w-full">
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
