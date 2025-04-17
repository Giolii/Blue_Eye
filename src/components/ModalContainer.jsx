import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const ModalContainer = ({ onClose, children }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Create a portal to render the modal outside the parent DOM hierarchy
  return createPortal(
    <div
      className="fixed inset-0 z-20 bg-black/10 backdrop-blur-[2px] flex items-center justify-center"
      onClick={() => onClose(false)}
    >
      <div className="bg-white rounded-lg shadow-xl z-30 max-w-md w-full mx-auto ">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalContainer;
