import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

export function PageTransition() {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Outlet />
    </motion.div>
  );
}
