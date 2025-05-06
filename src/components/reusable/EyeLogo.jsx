import { useState, useEffect } from "react";

const EyeLogo = () => {
  // State to track mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Reference to store the eye's position
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  // Add state for hover effects
  const [isHovered, setIsHovered] = useState(false);
  // Add state for blinking
  const [isBlinking, setIsBlinking] = useState(false);

  // Calculate eye pupil position based on mouse coordinates
  const calculatePupilPosition = () => {
    // Get angle between eye center and mouse position
    const dx = mousePosition.x - eyePosition.x;
    const dy = mousePosition.y - eyePosition.y;

    // Calculate angle
    const angle = Math.atan2(dy, dx);

    // Maximum distance the pupil can move from center (70% of eye radius)
    const maxDistance = 12;

    // Calculate pupil position
    return {
      x: Math.cos(angle) * maxDistance,
      y: Math.sin(angle) * maxDistance,
    };
  };

  // Update eye position when component renders
  useEffect(() => {
    const updateEyePosition = () => {
      const eyeElement = document.getElementById("eye-container");
      if (eyeElement) {
        const rect = eyeElement.getBoundingClientRect();
        setEyePosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    // Set initial position
    updateEyePosition();

    // Update position on resize
    window.addEventListener("resize", updateEyePosition);

    return () => {
      window.removeEventListener("resize", updateEyePosition);
    };
  }, []);

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Always track mouse movement throughout the entire page
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Random blinking effect
  useEffect(() => {
    // Function to trigger a blink
    const triggerBlink = () => {
      setIsBlinking(true);

      // Reset blinking state after short duration
      setTimeout(() => {
        setIsBlinking(false);

        // Schedule next blink after random interval
        scheduleNextBlink();
      }, 200); // Blink lasts for 200ms
    };

    // Schedule the next blink with random timing
    const scheduleNextBlink = () => {
      const minInterval = 3000; // Minimum 3 seconds between blinks
      const maxInterval = 8000; // Maximum 8 seconds between blinks
      const nextBlinkDelay =
        Math.random() * (maxInterval - minInterval) + minInterval;

      setTimeout(triggerBlink, nextBlinkDelay);
    };

    scheduleNextBlink();
  }, []);

  // Calculate pupil position
  const pupilPosition = calculatePupilPosition();

  return (
    <div className="flex flex-col items-center p-2">
      {/* <span className="font-bold tracking-wider text-cyan-500">OPEN</span> */}

      <div
        id="eye-container"
        className="relative w-18 h-18 mx-auto cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Background - World/Globe hint */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full shadow-lg border-2 border-blue-600 overflow-hidden">
          {/* Subtle grid pattern to suggest a globe */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-full h-0.5 bg-white top-1/4" />
            <div className="absolute w-full h-0.5 bg-white top-1/2" />
            <div className="absolute w-full h-0.5 bg-white top-3/4" />
            <div className="absolute h-full w-0.5 bg-white left-1/4" />
            <div className="absolute h-full w-0.5 bg-white left-1/2" />
            <div className="absolute h-full w-0.5 bg-white left-3/4" />
          </div>
        </div>

        {/* Stylized Eye */}
        <div className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 bg-white rounded-full overflow-hidden border border-blue-600 shadow-inner">
          {/* Upper eyelid for blinking */}
          <div
            className={`absolute top-0 left-0 w-full bg-gradient-to-br from-blue-500 to-teal-400 rounded-b-full z-20 transition-all duration-200 ${
              isBlinking ? "h-full" : "h-0"
            }`}
          />

          {/* Iris */}
          <div
            className="absolute w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) translate(${
                pupilPosition.x * 0.3
              }px, ${pupilPosition.y * 0.3}px)`,
            }}
          >
            {/* Pupil */}
            <div
              className="absolute w-5 h-5 bg-blue-900 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
              }}
            >
              {/* Light reflection */}
              <div
                className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                style={{ top: "20%", left: "60%" }}
              />
            </div>
          </div>
        </div>

        {/* Subtle glow effect on hover */}
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isHovered ? "opacity-40" : "opacity-0"
          }`}
          style={{
            boxShadow: "0 0 15px 5px rgba(59, 130, 246, 0.7)",
          }}
        />
      </div>
      {/* <span className="font-bold tracking-wider text-blue-400">WORLD</span> */}
      {/* Company Name */}
      {/* <div className="mt-2 text-center">
        <h1 className="text-xl  text-blue-600">
          <span className="font-bold tracking-wider text-blue-800">OPEN</span>
          WORLD
        </h1>
        <div className="text-xs text-blue-500 font-medium -mt-1 tracking-widest">
          EXPLORE EVERYTHING
        </div>
      </div> */}
    </div>
  );
};

export default EyeLogo;
