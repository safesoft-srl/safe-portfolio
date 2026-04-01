import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import UserLayout from "./layouts/UserLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Landing page</div>,
  },
  {
    path: "/login",
    element: <GuestRoute />,
    children: [
      {
        path: "",
        element: <Login />,
      },
    ],
  },
  {
    path: "/register",
    element: <GuestRoute />,
    children: [
      {
        path: "",
        element: <div>Register Page</div>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <UserLayout />,
        children: [
          {
            path: "",
            element: <div>Dashboard Page</div>,
          },
          {
            path: "test",
            element: <div>Testing Page</div>,
          },
        ],
      },
    ],
  },
]);
