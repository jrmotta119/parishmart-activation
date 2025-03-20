import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  type?: NotificationType;
  title?: string;
  message?: string;
  isVisible?: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification = ({
  type = "info",
  title = "Notification",
  message = "This is a notification message.",
  isVisible = true,
  onClose = () => {},
  autoClose = true,
  duration = 5000,
}: NotificationProps) => {
  const [visible, setVisible] = React.useState(isVisible);

  React.useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoClose && visible) {
      timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose, visible]);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-[#006699]" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-4 right-4 z-50 w-full max-w-sm overflow-hidden rounded-lg border shadow-md",
            getBackgroundColor(),
          )}
        >
          <div className="flex items-start p-4">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
