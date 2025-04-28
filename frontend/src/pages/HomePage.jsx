import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card/Card";
import Modal from "../components/Modal/Modal";
import { productAPI } from "../services/api";
import { useNotification } from "../context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSearch } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("createdAt-desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  // Parse URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search");
    const page = parseInt(queryParams.get("page")) || 1;

    if (search) setSearchTerm(search);
    if (page !== currentPage) setCurrentPage(page);
  }, [location.search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Add search if present
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      // Add sorting
      const [sortBy, sortOrder] = sortOption.split("-");
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;

      const response = await productAPI.getAll(params);

      setProducts(response.data);
      setTotalPages(response.pagination?.pages || 1);
      setTotalProducts(response.total || response.data.length);
      console.log("Products fetched:", response.data.length);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message || "Failed to load products. Please try again.");
      showNotification("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, sortOption, showNotification]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    try {
      await productAPI.delete(selectedProductId);

      // Show success notification
      showNotification(
        `"${selectedProduct.name}" was deleted successfully`,
        "success",
      );

      // Remove the product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== selectedProductId),
      );
      setIsModalOpen(false); // Close the modal after deletion

      // If we deleted the last item on the page, go to previous page
      if (products.length === 1 && currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else {
        // Refresh the current page
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification(error.message || "Failed to delete product", "error");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Update URL with page parameter
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate(`?${queryParams.toString()}`);

    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Update URL with search parameter
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) {
      queryParams.set("search", searchTerm.trim());
    }
    queryParams.set("page", 1); // Reset to first page on new search
    navigate(`?${queryParams.toString()}`);

    setCurrentPage(1);
  };

  return (
    <div className="mt-16 flex flex-1 flex-col items-center justify-center px-4 py-6 pt-8">
      {/* Search and sort bar */}
      <div className="mb-6 w-full max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute top-2 right-3">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>

          {/* Sort button */}
          <div className="flex gap-2">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn">
                <FontAwesomeIcon icon={faSort} className="mr-2" />
                Sort
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box bg-base-100 z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a
                    className={sortOption === "createdAt-desc" ? "active" : ""}
                    onClick={() => setSortOption("createdAt-desc")}
                  >
                    Newest First
                  </a>
                </li>
                <li>
                  <a
                    className={sortOption === "createdAt-asc" ? "active" : ""}
                    onClick={() => setSortOption("createdAt-asc")}
                  >
                    Oldest First
                  </a>
                </li>
                <li>
                  <a
                    className={sortOption === "price-asc" ? "active" : ""}
                    onClick={() => setSortOption("price-asc")}
                  >
                    Price: Low to High
                  </a>
                </li>
                <li>
                  <a
                    className={sortOption === "price-desc" ? "active" : ""}
                    onClick={() => setSortOption("price-desc")}
                  >
                    Price: High to Low
                  </a>
                </li>
                <li>
                  <a
                    className={sortOption === "name-asc" ? "active" : ""}
                    onClick={() => setSortOption("name-asc")}
                  >
                    Name: A to Z
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error mb-6 w-full max-w-4xl shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 flex-shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Search results summary */}
      {searchTerm && !loading && (
        <div className="mb-4 w-full max-w-7xl">
          <p>
            {totalProducts > 0
              ? `Found ${totalProducts} results for "${searchTerm}"`
              : `No products found for "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">No products found</h2>
          {searchTerm && (
            <p className="text-gray-600">Try adjusting your search</p>
          )}
        </div>
      ) : (
        <>
          {/* Product count */}
          <div className="mb-4 w-full max-w-7xl">
            <h2 className="text-xl font-semibold">
              {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
            </h2>
          </div>

          {/* Products grid */}
          <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="join mt-8">
              <button
                className="join-item btn"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                «
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`join-item btn ${currentPage === index + 1 ? "btn-active" : ""}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="join-item btn"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          handleDelete={handleDelete}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
};

export default HomePage;
