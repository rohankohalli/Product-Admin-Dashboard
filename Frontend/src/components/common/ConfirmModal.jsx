import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Product',
  message = 'Are you sure you want to delete this product? This action cannot be undone.',
  productTitle = '',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 pt-0.5">
            <p className="text-sm text-zinc-600 leading-relaxed">
              {message}
            </p>
            {productTitle && (
              <p className="text-xs font-semibold text-zinc-900 bg-zinc-50 border border-zinc-200/80 px-2.5 py-1.5 rounded-md break-all">
                "{productTitle}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
