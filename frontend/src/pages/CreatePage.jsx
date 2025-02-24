import { useState } from "react";
import axios from "axios";
import AddAlert from "../components/Alert/AddAlert.jsx";

const CreatePage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    discount: "",
    image: "",
  });

  const [productName, setProductName] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);

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

      // Show the alert
      setAlertVisible(true);
      setProductName(product.name);

      setProduct({
        name: "",
        price: "",
        discount: "",
        image: "",
      });

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="relative flex flex-1 items-center justify-center">
      {alertVisible && (
        <AddAlert productName={productName} setProduct={setProduct} />
      )}
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

        <button type="submit" className="btn btn-success mt-4">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
