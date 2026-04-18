import { toast } from "sonner";

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
