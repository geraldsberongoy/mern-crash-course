const Card = ({ product }) => {
  return (
    <div className="card bg-base-200 h-11/12 max-w-64 shadow-sm">
      <div className="card-body flex h-1/2">
        <h2 className="card-title">{product.name}</h2>
        <p>Price: ${product.price}</p>
        {product.discount && <p>Discount: {product.discount}%</p>}
        <p>Updated Price: ${product.updatedPrice}</p>
      </div>
      <figure className="h-1/2">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </figure>
    </div>
  );
};

export default Card;
