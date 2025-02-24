import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductForm from "../components/ProductForm.jsx";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    updatedPrice: "",
    discount: "",
    image: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${id}`,
        );
        setProduct(response.data.data);
        console.log("Product fetched:", response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/products/${id}`, product);
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="relative mt-16 flex flex-1 items-center justify-center">
      <ProductForm
        product={product}
        setProduct={setProduct}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditPage;
