import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import DashboardHome from "./pages/DashboardHome";
import Portfolios from "./pages/Portfolios";
import PublicPortfolio from "./pages/PublicPortfolio";
import ExperiencePublic from "./pages/public-portfolio/ExperiencePublic";
import UserLayout from "./layouts/UserLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";
import ExperiencePage from "./pages/Experience";
import FormationPage from "./pages/Formation";
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
    path: "/p/:slug/experience",
    element: <ExperiencePublic />,
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
    path: "/portfolios",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Portfolios />,
      },
    ],
  },

  {
    path: "/dashboard/:idPortfolio",
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
            element: <ProjectsPage />,
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
            path: "formation",
            element: <FormationPage />,
          },
          {
            path: "configuration",
            element: <Configuration />,
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
