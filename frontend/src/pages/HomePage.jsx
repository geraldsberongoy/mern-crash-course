import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card/Card";
import Modal from "../components/Modal/Modal";
import DeleteAlert from "../components/Alert/DeleteAlert";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`,
        );
        setProducts(response.data.data);
        console.log("Products fetched:", response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${selectedProductId}`,
      );
      console.log("Product deleted:", response.data);

      // Remove the product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== selectedProductId),
      );
      setIsModalOpen(false); // Close the modal after deletion
      setIsDeleteAlertVisible(true); // Show the delete alert

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setIsDeleteAlertVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="mt-16 flex flex-1 items-center justify-center py-6 pt-8">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product._id}
            product={product}
            setProducts={setProducts}
            setIsModalOpen={setIsModalOpen}
            setSelectedProductId={setSelectedProductId}
            setSelectedProduct={setSelectedProduct}
          />
        ))}
      </div>
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          handleDelete={handleDelete}
          selectedProduct={selectedProduct}
        />
      )}

      {isDeleteAlertVisible && (
        <DeleteAlert selectedProduct={selectedProduct} />
      )}
    </div>
  );
};

export default HomePage;
