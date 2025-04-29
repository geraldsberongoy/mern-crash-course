import colors from "colors";

/**
 * Custom logger middleware with colorized output and timestamp information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const logger = (req, res, next) => {
  // Define color scheme for different HTTP methods
  const methodColors = {
    GET: "green",
    POST: "yellow",
    PUT: "blue",
    PATCH: "cyan",
    DELETE: "red",
    OPTIONS: "grey",
    HEAD: "magenta",
  };

  // Get current timestamp
  // Get current timestamp in GMT+8
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Manila", // Philippines timezone (GMT+8)
    hour12: true, // Use 24-hour format
  });

  // Extract just the time part if needed
  const timeParts = timestamp.split(", ");
  const formattedTime = timeParts[1]; // This will be your local time

  // Get method and setup color
  const method = req.method;
  const color = methodColors[method] || "white";

  // Format the URL
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  // Log the request with colors and formatting
  console.log(
    `[${formattedTime}] ${method[color]} ${url} ${
      req.ip ? `from ${req.ip}` : ""
    }`
  );

  // Add response logging
  const startTime = Date.now();

  // Capture the response
  res.on("finish", () => {
    // Calculate request duration
    const duration = Date.now() - startTime;

    // Set status code color based on response status
    let statusColor = "green"; // 2xx success
    if (res.statusCode >= 400) statusColor = "red"; // 4xx client errors
    if (res.statusCode >= 300 && res.statusCode < 400) statusColor = "cyan"; // 3xx redirects
    if (res.statusCode >= 500) statusColor = "brightRed"; // 5xx server errors

    console.log(
      `[${formattedTime}] ${method[color]} ${url} ${
        `${res.statusCode}`[statusColor]
      } ${duration}ms`
    );
  });

  next();
};

export default logger;
