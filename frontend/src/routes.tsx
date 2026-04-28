import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import DashboardHome from "./pages/DashboardHome";
import PublicPortfolio from "./pages/PublicPortfolio";
import UserLayout from "./layouts/UserLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";
import ExperiencePage from "./pages/Experience";
import Skills from "./pages/Skills";
import Configuration from "./pages/Configuration";
import ProjectsPage from "./pages/ProjectsPage";
//import Projects from "./pages/Projects";

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
            element: <ProjectsPage/>,
          },
          {
            path: "skills",
            element: <Skills />,
          },
          {
            path: "experience",
            element: <ExperiencePage />,
          },
          {
            path: "configuration",
            element: <Configuration/>,
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
