import AppError from "../utils/AppError.js";

/**
 * Role-based access control middleware.
 * Usage: roleMiddleware("admin", "manager")
 * Must be used AFTER authMiddleware.
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${allowedRoles.join(" or ")}.`,
          403
        )
      );
    }

    next();
  };
};

export default roleMiddleware;
