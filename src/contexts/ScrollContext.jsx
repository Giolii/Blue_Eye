import React, { createContext, useContext, useRef, useCallback } from "react";

const ScrollContext = createContext();

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};

export const ScrollProvider = ({ children }) => {
  // Create refs for different scrollable areas
  const mainContentRef = useRef(null);

  // Scroll to top function with options
  const scrollToTop = useCallback((options = { behavior: "smooth" }) => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        ...options,
      });
    }
  }, []);

  // Scroll to element function
  const scrollToElement = useCallback(
    (elementId, options = { behavior: "smooth" }) => {
      const element = document.getElementById(elementId);
      if (element && mainContentRef.current) {
        const container = mainContentRef.current;
        const elementPosition = element.offsetTop;

        container.scrollTo({
          top: elementPosition,
          ...options,
        });
      }
    },
    []
  );

  const value = {
    mainContentRef,
    scrollToTop,
    scrollToElement,
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};
