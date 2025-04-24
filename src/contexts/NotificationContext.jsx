import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  useEffect,
} from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

// Constants
const TOAST_TYPES = { SUCCESS: "success", ERROR: "error", INFO: "info" };
const ACTIONS = { ADD_TOAST: "add", REMOVE_TOAST: "remove" };

// Context setup
const ToastContext = createContext(null);
const initialState = { toasts: [] };

// Reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TOAST:
      return { ...state, toasts: [...state.toasts, action.payload] };
    case ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    default:
      return state;
  }
};

// Individual Toast component - completely separate from context
const Toast = ({ toast, onRemove }) => {
  const { id, message, type } = toast;
  const [animationState, setAnimationState] = useState("enter");

  // Handle initial entrance animation
  useEffect(() => {
    // Start with offscreen state
    setAnimationState("enter-start");

    // Trigger entrance animation after a small delay (for DOM to be ready)
    const enterTimer = setTimeout(() => {
      setAnimationState("enter-end");
    }, 10);

    // Set up auto-removal
    const removeTimer = setTimeout(() => {
      handleDismiss();
    }, toast.duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.duration]);

  // Handle exit animation
  const handleDismiss = () => {
    setAnimationState("exit");
    // Wait for animation to complete before actual removal
    setTimeout(() => onRemove(id), 300);
  };

  // Define animation classes based on current state
  const getAnimationClasses = () => {
    switch (animationState) {
      case "enter-start":
        return "translate-x-full opacity-0";
      case "enter-end":
        return "translate-x-0 opacity-100";
      case "exit":
        return "translate-x-full opacity-0";
      default:
        return "translate-x-full opacity-0";
    }
  };

  // Define styling based on type
  const typeClasses = {
    [TOAST_TYPES.SUCCESS]: "bg-green-50 border-l-4 border-green-800",
    [TOAST_TYPES.ERROR]: "bg-red-50 border-l-4 border-red-800",
    [TOAST_TYPES.INFO]: "bg-blue-50 border-l-4 border-blue-800",
  };

  const icons = {
    [TOAST_TYPES.SUCCESS]: <CheckCircle className="w-5 h-5 text-green-800" />,
    [TOAST_TYPES.ERROR]: <AlertCircle className="w-5 h-5 text-red-800" />,
    [TOAST_TYPES.INFO]: <Info className="w-5 h-5 text-blue-800" />,
  };

  return (
    <div
      className={`
        flex items-center p-4 rounded-md shadow-lg w-full max-w-md mb-3 
        transform transition-all duration-300 ease-in-out
        ${getAnimationClasses()} ${typeClasses[type]}
      `}
    >
      <div className="flex-shrink-0 mr-3">{icons[type]}</div>
      <div className="flex-1 ml-2">
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = useCallback(
    (message, type = TOAST_TYPES.INFO, duration = 3000) => {
      const id = Date.now().toString();
      dispatch({
        type: ACTIONS.ADD_TOAST,
        payload: { id, message, type, duration },
      });
      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_TOAST, payload: id });
  }, []);

  // Convenience methods
  const success = useCallback(
    (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration),
    [addToast]
  );

  const errorToast = useCallback(
    (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration),
    [addToast]
  );

  const info = useCallback(
    (message, duration) => addToast(message, TOAST_TYPES.INFO, duration),
    [addToast]
  );

  const contextValue = {
    toasts: state.toasts,
    addToast,
    removeToast,
    success,
    errorToast,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={state.toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
