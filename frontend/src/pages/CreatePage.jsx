import { useState } from "react";
import axios from "axios";

const CreatePage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    discount: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/products",
        product,
      );
      console.log("Product created:", response.data);

      // Clear the form after creating the product
      setProduct({
        name: "",
        price: "",
        discount: "",
        image: "",
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box h-auto w-xs border p-4"
      >
        <legend className="fieldset-legend justify-center">
          <span className="text-center text-xl font-bold">Create Product </span>
        </legend>

        <label className="fieldset-label font-semibold">Name</label>
        <input
          type="text"
          name="name"
          className="input"
          placeholder="Name"
          value={product.name}
          required={true}
          onChange={handleChange}
        />

        <label className="fieldset-label font-semibold">Price</label>
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

        <label className="fieldset-label font-semibold">Image Link</label>
        <input
          type="text"
          name="image"
          className="input"
          placeholder="Image Link"
          value={product.image}
          required={true}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary mt-4">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
