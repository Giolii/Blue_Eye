import { motion, AnimatePresence } from "motion/react";

const SpringDiv = ({ children }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{
          duration: 0.3,
          layout: { type: "spring", stiffness: 200, damping: 20 },
        }}
        layout
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default SpringDiv;
