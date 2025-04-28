import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { productAPI } from "../services/api.js";

const CreatePage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    discount: "",
    image: "",
    creator: "",
    description: "",
    stock: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await productAPI.create(product);
      console.log("Product created:", response);

      // Show success notification
      showNotification(
        `Product "${product.name}" created successfully!`,
        "success",
      );

      // Reset form
      setProduct({
        name: "",
        price: "",
        discount: "",
        image: "",
        creator: "",
        description: "",
        stock: "",
      });

      // Redirect to home page after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);

      // Show error notification with specific message if available
      showNotification(
        error.message || "Failed to create product. Please try again.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 flex flex-1 flex-col items-center justify-center px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Create New Product</h1>

      <ProductForm
        product={product}
        setProduct={setProduct}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CreatePage;
