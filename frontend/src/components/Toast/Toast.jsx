import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Toast notification component
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of toast: 'success', 'error', 'info'
 * @param {number} props.duration - Duration in ms before auto-closing
 * @param {function} props.onClose - Function to call when toast is closed
 */
const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  // Auto-hide toast after duration
  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Close toast manually
  const closeToast = () => {
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300); // Wait for animation to complete
  };

  // Get appropriate icon and style based on type
  const getToastProps = () => {
    switch (type) {
      case "success":
        return {
          icon: faCheckCircle,
          bgClass: "bg-success/10 border-success/20",
          iconClass: "text-success",
        };
      case "error":
        return {
          icon: faExclamationCircle,
          bgClass: "bg-error/10 border-error/20",
          iconClass: "text-error",
        };
      case "info":
      default:
        return {
          icon: faInfoCircle,
          bgClass: "bg-info/10 border-info/20",
          iconClass: "text-info",
        };
    }
  };

  const { icon, bgClass, iconClass } = getToastProps();

  return (
    <div
      className={`mb-2 flex w-full transform items-center rounded-lg border p-4 shadow-md transition-all duration-300 ${bgClass} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      role="alert"
    >
      <div className={`mr-3 flex-shrink-0 ${iconClass}`}>
        <FontAwesomeIcon icon={icon} size="lg" />
      </div>
      <div className="mr-2 flex-1 text-sm font-medium">{message}</div>
      <button
        className="bg-base-100/30 hover:bg-base-100/50 -mx-1.5 -my-1.5 ml-auto rounded-lg p-1.5 focus:outline-none"
        onClick={closeToast}
        aria-label="Close"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Toast;
