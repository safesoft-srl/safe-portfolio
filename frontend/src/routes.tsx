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
import SkillsSoftPublic from "./pages/public-portfolio/SkillsSoftPublic";
import SkillsThechnicalPublic from "./pages/public-portfolio/SkillsThechnicalPublic";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import ExperiencePage from "./pages/Experience";
import FormationPage from "./pages/Formation";
import Skills from "./pages/Skills";
import Configuration from "./pages/Configuration";
import SoftSkillModerationSection from "./pages/SoftSkillModerationSection";
import ProjectsPage from "./pages/ProjectsPage";
import AdminModerators from "./pages/admin/AdminModerators";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminFormation from "./pages/admin/AdminFormation";
import AdminCourses from "./pages/admin/AdminCourses";

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
    path: "/p/:slug/skillssoft",
    element: <SkillsSoftPublic />,
  },
  {
    path: "/p/:slug/skillstechnical",
    element: <SkillsThechnicalPublic />,
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
            path: "moderators",
            element: <AdminModerators />,
          },
          {
            path: "skills-technical",
            element: <AdminSkills />,
          },
          {
            path: "skills-soft",
            element: <SoftSkillModerationSection />,
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
          {
            path: "courses",
            element: <AdminCourses />,
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
