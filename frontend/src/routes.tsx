import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import DashboardHome from "./pages/DashboardHome";
import Portfolios from "./pages/Portfolios";
import PublicPortfolio from "./pages/PublicPortfolio";
import ProjectsPublic from "./pages/public-portfolio/ProjectsPublic";
import ExperiencePublic from "./pages/public-portfolio/ExperiencePublic";
import SkillsPublic from "./pages/public-portfolio/SkillsPublic";
import FormationPublic from "./pages/public-portfolio/FormationPublic";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import ExperiencePage from "./pages/Experience";
import FormationPage from "./pages/Formation";
import Skills from "./pages/Skills";
import Configuration from "./pages/Configuration";
import ProjectsPage from "./pages/ProjectsPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminModerators from "./pages/admin/AdminModerators";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminFormation from "./pages/admin/AdminFormation";

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
    path: "/p/:slug/formation",
    element: <FormationPublic />,
  },
  {
    path: "/p/:slug/projects",
    element: <ProjectsPublic />,
  },
  {
    path: "/p/:slug/skills",
    element: <SkillsPublic />,
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
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
          {
            path: "moderators",
            element: <AdminModerators />,
          },
          {
            path: "skills",
            element: <AdminSkills />,
          },
          {
            path: "projects",
            element: <AdminProjects />,
          },
          {
            path: "experience",
            element: <AdminExperience />,
          },
          {
            path: "formation",
            element: <AdminFormation />,
          },
        ],
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
