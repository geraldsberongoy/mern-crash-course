import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faInfoCircle,
  faExclamationTriangle,
  faCheck,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../context/NotificationContext";

const ProductForm = ({
  product,
  setProduct,
  handleSubmit,
  isSubmitting = false,
}) => {
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [touched, setTouched] = useState({});
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { showNotification } = useNotification();

  // Calculate the updated price when price or discount changes
  const updatedPrice = useMemo(() => {
    if (!product.price || product.price <= 0) return 0;
    if (!product.discount || product.discount <= 0) return product.price;

    const discountedPrice = (product.price * (100 - product.discount)) / 100;
    return parseFloat(discountedPrice.toFixed(2));
  }, [product.price, product.discount]);

  // Update the product's updatedPrice field when calculated value changes
  useEffect(() => {
    if (updatedPrice !== product.updatedPrice) {
      setProduct((prev) => ({ ...prev, updatedPrice }));
    }
  }, [updatedPrice, product.updatedPrice, setProduct]);

  // Set image preview when image URL changes
  useEffect(() => {
    if (product.image) {
      setIsImageLoading(true);
      setImagePreview(product.image);
    } else {
      setImagePreview("");
    }
  }, [product.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for numeric fields
    if (name === "price" || name === "discount" || name === "stock") {
      const numValue = value === "" ? "" : Number(value);
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: numValue,
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }

    // Mark field as touched
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateField = (name, value) => {
    let fieldError = null;

    switch (name) {
      case "name":
        if (!value?.trim()) {
          fieldError = "Product name is required";
        } else if (value.length > 100) {
          fieldError = "Name cannot exceed 100 characters";
        }
        break;

      case "price":
        if (value === "" || value === null) {
          fieldError = "Price is required";
        } else if (isNaN(value) || Number(value) <= 0) {
          fieldError = "Price must be greater than 0";
        } else if (Number(value) > 1000000) {
          fieldError = "Price cannot exceed 1,000,000";
        }
        break;

      case "discount":
        if (value !== "" && value !== null) {
          if (isNaN(value)) {
            fieldError = "Discount must be a number";
          } else if (Number(value) < 0) {
            fieldError = "Discount cannot be negative";
          } else if (Number(value) > 100) {
            fieldError = "Discount cannot exceed 100%";
          }
        }
        break;

      case "image":
        if (!value?.trim()) {
          fieldError = "Image URL is required";
        } else if (!/^(https?:\/\/.+|data:image\/.+;base64,.+)/i.test(value)) {
          fieldError =
            "Please enter a valid URL (http://, https://, or data:image/)";
        }
        break;

      case "stock":
        if (value !== "" && value !== null) {
          if (isNaN(value)) {
            fieldError = "Stock must be a number";
          } else if (Number(value) < 0) {
            fieldError = "Stock cannot be negative";
          } else if (!Number.isInteger(Number(value))) {
            fieldError = "Stock must be a whole number";
          } else if (Number(value) > 10000) {
            fieldError = "Stock cannot exceed 10,000 units";
          }
        }
        break;

      case "description":
        if (value?.length > 500) {
          fieldError = "Description cannot exceed 500 characters";
        }
        break;

      case "creator":
        if (value?.length > 50) {
          fieldError = "Creator name cannot exceed 50 characters";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: fieldError }));
    return !fieldError;
  };

  const validateForm = () => {
    // Validate all fields
    const fieldNames = ["name", "price", "image"];
    if (product.discount !== undefined) fieldNames.push("discount");
    if (product.stock !== undefined) fieldNames.push("stock");
    if (product.description !== undefined) fieldNames.push("description");
    if (product.creator !== undefined) fieldNames.push("creator");

    const validations = fieldNames.map((name) =>
      validateField(name, product[name]),
    );
    return validations.every((isValid) => isValid);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(product).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate form before submitting
    const isValid = validateForm();
    if (isValid) {
      handleSubmit(e);
    } else {
      showNotification("Please correct the errors before submitting", "error");

      // Find the first invalid field and focus it
      const firstInvalidField = Object.keys(errors).find((key) => errors[key]);
      if (firstInvalidField) {
        const element = document.querySelector(`[name="${firstInvalidField}"]`);
        if (element) element.focus();
      }
    }
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImagePreview("https://placehold.co/300x200?text=Invalid+Image+URL");
    if (touched.image) {
      showNotification(
        "Could not load the image from the provided URL",
        "warning",
      );
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleRandomImage = () => {
    const categories = [
      "electronics",
      "clothing",
      "furniture",
      "toys",
      "food",
      "books",
    ];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomId = Math.floor(Math.random() * 100) + 1;
    const imageUrl = `https://source.unsplash.com/300x200/?${randomCategory}`;

    setProduct((prev) => ({ ...prev, image: imageUrl }));
    showNotification("Random image URL generated", "info");
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-base-200 w-full max-w-lg rounded-lg p-6 shadow-lg"
      noValidate
    >
      {/* Image Preview */}
      <div className="mb-6 flex flex-col items-center">
        <div className="bg-base-300 relative mb-2 h-48 w-full overflow-hidden rounded-lg">
          {isImageLoading && (
            <div className="bg-base-300 absolute inset-0 flex items-center justify-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          )}

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Product preview"
              className="h-full w-full object-contain"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="text-base-content/50 flex h-full w-full flex-col items-center justify-center">
              <FontAwesomeIcon icon={faImage} size="3x" />
              <span className="mt-2">Image Preview</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Name */}
        <div className="form-control w-full md:col-span-2">
          <label className="label">
            <span className="label-text font-medium">
              Product Name<span className="text-error">*</span>
            </span>
          </label>
          <input
            type="text"
            name="name"
            className={`input input-bordered w-full ${errors.name && touched.name ? "input-error" : ""}`}
            placeholder="Enter product name"
            value={product.name || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={100}
            required
          />
          {errors.name && touched.name ? (
            <label className="label">
              <span className="label-text-alt text-error flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-1"
                />
                {errors.name}
              </span>
            </label>
          ) : touched.name && !errors.name && product.name ? (
            <label className="label">
              <span className="label-text-alt text-success flex items-center">
                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                Looks good!
              </span>
            </label>
          ) : null}
          {product.name && (
            <label className="label">
              <span className="label-text-alt">
                {product.name.length}/100 characters
              </span>
            </label>
          )}
        </div>

        {/* Price */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">
              Price ($)<span className="text-error">*</span>
            </span>
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0.01"
            max="1000000"
            className={`input input-bordered w-full ${errors.price && touched.price ? "input-error" : ""}`}
            placeholder="0.00"
            value={product.price || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.price && touched.price ? (
            <label className="label">
              <span className="label-text-alt text-error flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-1"
                />
                {errors.price}
              </span>
            </label>
          ) : touched.price && !errors.price && product.price ? (
            <label className="label">
              <span className="label-text-alt text-success flex items-center">
                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                Valid price
              </span>
            </label>
          ) : null}
        </div>

        {/* Discount */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">
              Discount (%)
              <span className="text-base-content/60 ml-1 text-xs">
                (optional)
              </span>
            </span>
          </label>
          <input
            type="number"
            name="discount"
            min="0"
            max="100"
            className={`input input-bordered w-full ${errors.discount && touched.discount ? "input-error" : ""}`}
            placeholder="0"
            value={product.discount ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.discount && touched.discount ? (
            <label className="label">
              <span className="label-text-alt text-error flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-1"
                />
                {errors.discount}
              </span>
            </label>
          ) : null}
        </div>

        {/* Image URL */}
        <div className="form-control w-full md:col-span-2">
          <label className="label">
            <span className="label-text font-medium">
              Image URL<span className="text-error">*</span>
            </span>
            <span
              className="label-text-alt text-info cursor-pointer hover:underline"
              onClick={handleRandomImage}
            >
              Get random image
            </span>
          </label>
          <input
            type="text"
            name="image"
            className={`input input-bordered w-full ${errors.image && touched.image ? "input-error" : ""}`}
            placeholder="https://example.com/image.jpg"
            value={product.image || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.image && touched.image ? (
            <label className="label">
              <span className="label-text-alt text-error flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-1"
                />
                {errors.image}
              </span>
            </label>
          ) : touched.image && !errors.image && product.image ? (
            <label className="label">
              <span className="label-text-alt text-success flex items-center">
                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                Valid URL format
              </span>
            </label>
          ) : null}
        </div>

        {/* Stock */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">
              Stock
              <span className="text-base-content/60 ml-1 text-xs">
                (optional)
              </span>
            </span>
          </label>
          <input
            type="number"
            name="stock"
            min="0"
            max="10000"
            step="1"
            className={`input input-bordered w-full ${errors.stock && touched.stock ? "input-error" : ""}`}
            placeholder="0"
            value={product.stock ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.stock && touched.stock ? (
            <label className="label">
              <span className="label-text-alt text-error flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-1"
                />
                {errors.stock}
              </span>
            </label>
          ) : null}
        </div>

        {/* Creator */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">
              Creator
              <span className="text-base-content/60 ml-1 text-xs">
                (optional)
              </span>
            </span>
          </label>
          <input
            type="text"
            name="creator"
            className={`input input-bordered w-full ${errors.creator && touched.creator ? "input-error" : ""}`}
            placeholder="Who created this product?"
            value={product.creator || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={50}
          />
          {errors.creator && touched.creator ? (
            <label className="label">
              <span className="label-text-alt text-error flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-1"
                />
                {errors.creator}
              </span>
            </label>
          ) : null}
          {product.creator && (
            <label className="label">
              <span className="label-text-alt">
                {product.creator.length}/50 characters
              </span>
            </label>
          )}
        </div>

        {/* Description */}
        <div className="form-control w-full md:col-span-2">
          <label className="label">
            <span className="label-text font-medium">
              Description
              <span className="text-base-content/60 ml-1 text-xs">
                (optional)
              </span>
            </span>
          </label>
          <textarea
            name="description"
            className={`textarea textarea-bordered h-24 w-full ${errors.description && touched.description ? "textarea-error" : ""}`}
            placeholder="Enter product description"
            value={product.description || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={500}
          ></textarea>
          {errors.description && touched.description ? (
            <label className="label">
              <span className="label-text-alt text-error flex items-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-1"
                />
                {errors.description}
              </span>
            </label>
          ) : null}
          {product.description && (
            <label className="label">
              <span
                className={`label-text-alt ${product.description.length >= 450 ? "text-warning" : ""}`}
              >
                {product.description.length}/500 characters
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Final price calculation */}
      {product.price > 0 && (
        <div
          className={`alert mt-4 flex items-center ${product.discount > 0 ? "bg-base-300" : ""}`}
        >
          <FontAwesomeIcon icon={faInfoCircle} className="text-info mr-2" />
          <div>
            {product.discount > 0 ? (
              <>
                <span className="font-medium">Final price: </span>
                <span className="text-primary font-bold">
                  ${updatedPrice.toFixed(2)}
                </span>
                <span className="text-base-content/70 ml-2 text-sm">
                  (${product.price.toFixed(2)} - {product.discount}%)
                </span>
              </>
            ) : (
              <span>
                Price:{" "}
                <span className="font-bold">${product.price.toFixed(2)}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Required fields note */}
      <div className="text-base-content/70 mt-4 text-xs">
        <span className="text-error">*</span> Required fields
      </div>

      {/* Form validation status */}
      {Object.keys(errors).some((key) => errors[key] && touched[key]) && (
        <div className="alert alert-warning mt-4 items-start justify-start">
          <FontAwesomeIcon icon={faExclamationCircle} className="mt-1" />
          <div>
            <h3 className="font-bold">Please fix the following errors:</h3>
            <ul className="mt-1 list-inside list-disc">
              {Object.entries(errors).map(([field, error]) =>
                error && touched[field] ? <li key={field}>{error}</li> : null,
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : product._id
              ? "Save Changes"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
