import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/register";
import UserLayout from "./layouts/UserLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Landing page</div>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
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
]);
