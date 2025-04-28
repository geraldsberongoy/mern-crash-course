import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { productAPI } from "../services/api.js";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    updatedPrice: "",
    discount: "",
    image: "",
    creator: "",
    description: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await productAPI.getById(id);
        setProduct(response.data);
        console.log("Product fetched:", response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(
          error.message ||
            "Failed to fetch product. It might have been deleted or doesn't exist.",
        );
        showNotification(
          "Failed to load product. Please check if the ID is correct.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, showNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await productAPI.update(id, product);

      showNotification(`"${product.name}" updated successfully!`, "success");
      console.log("Product updated:", response);

      // Navigate back after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error updating product:", error);
      showNotification(
        error.message || "Failed to update product. Please try again.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="mt-16 flex h-[70vh] flex-col items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 flex h-[70vh] flex-col items-center justify-center">
        <div className="card bg-base-200 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-error">Error</h2>
            <p>{error}</p>
            <div className="card-actions mt-4 justify-end">
              <button className="btn btn-primary" onClick={handleGoBack}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 flex flex-1 flex-col items-center px-4 py-8">
      <div className="flex w-full max-w-lg items-center">
        <h1 className="relative flex-1 pb-5 text-center text-3xl font-bold">
          <button
            className="btn btn-ghost btn-sm absolute top-1 left-0"
            onClick={handleGoBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="xl" />
          </button>
          Edit Product
        </h1>
      </div>

      <ProductForm
        product={product}
        setProduct={setProduct}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditPage;
