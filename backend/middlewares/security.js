/**
 * Security middleware to add important HTTP headers
 * This helps protect your app from some well-known web vulnerabilities
 */
const securityHeaders = (req, res, next) => {
  // Prevent browsers from incorrectly detecting non-scripts as scripts
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Don't allow the site to be framed - helps prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent XSS attacks - browsers block if they detect an attack
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Keep referrer data off of HTTP connections
  res.setHeader("Referrer-Policy", "no-referrer");

  next();
};

export default securityHeaders;
