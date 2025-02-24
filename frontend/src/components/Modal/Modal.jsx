import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const Modal = ({ setIsModalOpen, handleDelete, selectedProduct }) => {
  console.log(selectedProduct);
  return (
    <div className="bg-base-200/80 fixed inset-0 flex items-center justify-center">
      <div className="bg-base-100 flex flex-col items-center justify-center rounded-lg p-6 text-center shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 p-2">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="2xl"
            className="text-error -mt-1"
          />
        </div>
        <p className="my-5 text-2xl font-bold">
          Delete {selectedProduct.name}?
        </p>
        <p className="mb-4">Are you sure you want to delete this item?</p>
        <div className="flex w-full justify-center gap-4">
          <button
            className="btn btn-neutral"
            onClick={() => setIsModalOpen(false)}
          >
            No, Keep It.
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Yes, Delete it.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
