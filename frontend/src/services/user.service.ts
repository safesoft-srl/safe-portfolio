import type { User } from "@/types/users";

export const hasPermission = (user: User | null, permission?: string) => {
  if (!user) return false;

  if (user.role === "Super Admin") return true;

  if (!permission) {
    return true;
  }

  return user.permissions?.includes(permission) ?? false;
};
