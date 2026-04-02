import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
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
    element: <div>Register Page</div>,
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
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "projects",
        element: <div>Projects Page</div>,
      },
      {
        path: "skills",
        element: <div>Skills Page</div>,
      },
      {
        path: "experience",
        element: <div>Experience Page</div>,
      },
      {
        path: "configuration",
        element: <div>Configuration Page</div>,
      },
      {
        path: "reports",
        element: <div>Reports Page</div>,
      },
    ],
  },
]);
