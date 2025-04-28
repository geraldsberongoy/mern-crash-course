import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Modal = ({ setIsModalOpen, handleDelete, selectedProduct }) => {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Focus trap and keyboard navigation
  useEffect(() => {
    // Auto focus the cancel button as it's the safer option
    cancelButtonRef.current?.focus();

    // Handle ESC key to close modal
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }

      // Handle Tab key to trap focus
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === cancelButtonRef.current) {
          e.preventDefault();
          confirmButtonRef.current?.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === confirmButtonRef.current
        ) {
          e.preventDefault();
          cancelButtonRef.current?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEsc);

    // Prevent scrolling of background content
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [setIsModalOpen]);

  // Handle backdrop click to close
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="animate-modal-appear bg-base-100 max-w-md rounded-lg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-error/20 mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                size="lg"
                className="text-error"
              />
            </div>
            <h3 id="modal-title" className="text-lg font-bold">
              Confirm Deletion
            </h3>
          </div>

          <button
            className="btn btn-circle btn-ghost btn-sm"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-error mb-3 text-xl font-semibold">
            Delete "{selectedProduct.name}"?
          </p>
          <p className="text-base-content/70">
            This action cannot be undone. The product will be permanently
            deleted from the database.
          </p>

          {selectedProduct.image && (
            <div className="mt-4 flex justify-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-24 w-24 rounded-lg object-cover opacity-70"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            className="btn btn-ghost"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            className="btn btn-error"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-modal-appear {
          animation: modalAppear 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;
