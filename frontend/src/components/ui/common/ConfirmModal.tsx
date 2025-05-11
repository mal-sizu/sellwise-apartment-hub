import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface ConfirmModalProps {
  title?: string;
  description?: ReactNode;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = "Confirm",
  description,
  isOpen,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-600 text-white hover:bg-red-700",
  cancelButtonClass = "bg-gray-100 text-gray-700 hover:bg-gray-200",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-2 text-gray-700 mb-6">
              {description}
            </DialogDescription>
          )}
          
          <DialogFooter className="flex justify-end space-x-3 mt-6">
            <DialogClose asChild>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg focus:outline-none transition ${cancelButtonClass}`}
              >
                {cancelText}
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded-lg focus:outline-none transition ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
