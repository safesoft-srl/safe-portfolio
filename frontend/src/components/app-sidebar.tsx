import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  RowsIcon,
  LayoutIcon,
  UserIcon,
  MedalIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  GearIcon,
  ArrowLeftIcon,
  ShieldIcon,
  UserGearIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { hasPermission } from "@/services/user.service";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Safe Portfolio",
      logo: <RowsIcon />,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Panel",
      url: "",
      icon: <LayoutIcon />,
    },
    {
      title: "Perfil",
      url: "profile",
      icon: <UserIcon />,
    },
    {
      title: "Habilidades",
      url: "skills",
      icon: <MedalIcon />,
    },

    {
      title: "Proyectos",
      url: "projects",
      icon: <BriefcaseIcon />,
    },

    {
      title: "Experiencia Laboral",
      url: "experience",
      icon: <GraduationCapIcon />,
    },
    {
      title: "Formación Academica",
      url: "formation",
      icon: <GraduationCapIcon />,
    },
    {
      title: "Redes Profesionales",
      url: "configuration",
      icon: <GearIcon />,
    },
  ],
};
const adminData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Safe Portfolio Admin",
      logo: <ShieldIcon />,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Panel Administrador",
      url: "",
      icon: <LayoutIcon />,
    },
    {
      title: "Moderadores",
      url: "moderators",
      icon: <UserGearIcon />,
      permission: "manage_moderators",
    },
    {
      title: "Administrar H. Tecnicas",
      url: "skills-technical",
      icon: <MedalIcon />,
      permission: "manage_catalogs_technicals",
    },
    {
      title: "Administrar H. Blandas",
      url: "skills-soft",
      icon: <MedalIcon />,
      permission: "manage_catalogs_softskills",
    },
    {
      title: "Administrar Proyectos",
      url: "projects",
      icon: <BriefcaseIcon />,
      permission: "view_reports",
    },

    {
      title: "Administrar Experiencia",
      url: "experience",
      icon: <GraduationCapIcon />,
      permission: "view_reports",
    },
    {
      title: "Administrar Formación",
      url: "formation",
      icon: <GraduationCapIcon />,
      permission: "view_reports",
    },
    {
      title: "Administrar Cursos",
      url: "courses",
      icon: <GraduationCapIcon />,
      permission: "view_reports",
    },
  ],
};

export function AppSidebar({
  admin = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & { admin?: boolean }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const filteredAdminItems = adminData.navMain.filter((item) =>
    hasPermission(user, item.permission)
  );
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={admin ? adminData.teams : data.teams} />
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <NavMain items={admin ? filteredAdminItems : data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || {}} />
        {(hasPermission(user, "manage_portfolios") || user?.role == "user") && (
          <Button
            onClick={() => navigate("/portfolios")}
            className="gap-2 bg-[#0A0B1E] hover:bg-[#5c61eb] text-white rounded-ms h-10 mb-2 px-15 py-2 w-fit mx-auto"
          >
            <ArrowLeftIcon size={16} weight="bold" />
            <span>Ir a Portafolios</span>
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
