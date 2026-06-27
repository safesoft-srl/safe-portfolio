import { toast } from "sonner";

export function showSuccessToast(message: string) {
  toast.success(message, {
    style: {
      background: "#6c72ff",
      color: "#ffffff",
      border: "1px solid #8b90ff",
      fontWeight: "500",
      borderRadius: "12px",
      boxShadow: "0 10px 25px -5px rgba(108, 114, 255, 0.3)",
    },
    className: "custom-success-toast",
  });
}

export function showErrorToast(message: string) {
  toast.error(message, {
    style: {
      background: "#e53e3e",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    className: "custom-error-toast",
  });
}
