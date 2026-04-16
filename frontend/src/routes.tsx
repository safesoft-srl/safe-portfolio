import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import DashboardHome from "./pages/DashboardHome";
import PublicPortfolio from "./pages/PublicPortfolio";
import UserLayout from "./layouts/UserLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/p/:slug",
    element: <PublicPortfolio />,
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
        element: <Register />,
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
            element: <DashboardHome />,
          },

          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "projects",
            element: <Projects />,
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
    ],
  },
]);
