import React from "react";

const ProductForm = ({ product, setProduct, handleSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fieldset bg-base-200 border-base-300 rounded-box h-auto w-xs border-2 p-4"
    >
      <legend className="fieldset-legend justify-center">
        <span className="text-center text-xl font-bold">
          {product._id ? "Edit Product" : "Create Product"}
        </span>
      </legend>

      <label className="fieldset-label font-semibold">
        Name<span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="name"
        className="input"
        placeholder="Name"
        value={product.name}
        required={true}
        onChange={handleChange}
      />

      <label className="fieldset-label font-semibold">
        Price<span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name="price"
        className="input"
        placeholder="Price"
        value={product.price}
        required={true}
        onChange={handleChange}
      />

      <label className="fieldset-label font-semibold">Discount</label>
      <input
        type="number"
        name="discount"
        className="input"
        placeholder="Discount"
        value={product.discount}
        onChange={handleChange}
      />

      <label className="fieldset-label font-semibold">
        Image Link<span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="image"
        className="input"
        placeholder="Image Link"
        value={product.image}
        required={true}
        onChange={handleChange}
      />
      <label className="fieldset-label font-semibold">
        Creator
      </label>
      <input
        type="text"
        name="creator"
        className="input"
        placeholder="Creator Name"
        value={product.creator}
        required={false}
        onChange={handleChange}
      />

      <button type="submit" className="btn btn-primary mt-4">
        {product._id ? "Save Changes" : "Create"}
      </button>
    </form>
  );
};

export default ProductForm;
