import { useState } from "react";
import axios from "axios";
import AddAlert from "../components/Alert/AddAlert.jsx";
import ProductForm from "../components/ProductForm.jsx";

const CreatePage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    discount: "",
    image: "",
  });

  const [productName, setProductName] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);

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
    <div className="relative mt-16 flex flex-1 items-center justify-center">
      {alertVisible && (
        <AddAlert productName={productName} setProduct={setProduct} />
      )}
      <ProductForm
        product={product}
        setProduct={setProduct}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreatePage;
