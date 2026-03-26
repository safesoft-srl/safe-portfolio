import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Landing Page</div>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <div>Register Page</div>,
  },
  {
    path: "/dashboard",
    element: <div>Dashboard Page</div>,
  },
]);
