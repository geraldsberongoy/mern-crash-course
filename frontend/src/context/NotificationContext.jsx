import { createContext, useContext, useState } from "react";

// Create context
const NotificationContext = createContext({
  showNotification: () => {},
  notifications: [],
  removeNotification: () => {},
});

/**
 * NotificationProvider component that handles creating and dismissing toast notifications
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = "success", duration = 5000) => {
    // Generate unique ID
    const id = Date.now().toString();

    // Add new notification
    setNotifications((prev) => [...prev, { id, message, type, duration }]);

    // Optional: Auto-remove after some time to prevent memory leaks
    if (notifications.length > 10) {
      setNotifications((prev) => prev.slice(1));
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        notifications,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook to use the notification context
 * @returns {Object} { showNotification, notifications, removeNotification }
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  return context;
};
