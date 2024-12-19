import { toast, ToastContent, ToastOptions, Id } from "react-toastify";

export const helperToast = {
  success: (content: ToastContent, opts?: ToastOptions) => {
    toast.dismiss();
    toast.success(content, opts);
  },
  error: (content: ToastContent, opts?: ToastOptions) => {
    toast.dismiss();
    toast.error(content, opts);
  },
  info: (content: ToastContent, opts?: ToastOptions) => {
    toast.dismiss();
    toast(content, opts);
  },
  pending: (content: ToastContent, opts?: ToastOptions): Id => {
    toast.dismiss();
    return toast.loading(content, {
      ...opts,
      isLoading: true,
    });
  },
  update: (toastId: Id, content: ToastContent, opts?: ToastOptions) => {
    toast.update(toastId, {
      render: content,
      type: opts?.type || "default",
      isLoading: false,
      autoClose: 3000, // Close after 3 seconds, adjust as needed
      closeButton: true, // Add a close button
      ...opts,
    });
  },
};
