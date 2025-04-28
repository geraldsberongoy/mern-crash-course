import React from "react";
import Toast from "./Toast";

/**
 * Toast container component that displays notifications in a stacked manner
 * with the newest notification at the bottom
 * @param {Object} props - Component props
 * @param {Array} props.notifications - Array of notification objects
 * @param {Function} props.removeNotification - Function to remove a notification
 */
const ToastContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="toast-container fixed top-0 right-0  z-40 flex max-h-screen w-full max-w-xs h-screen flex-col-reverse overflow-hidden">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
