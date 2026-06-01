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
      title: "Experiencia",
      url: "experience",
      icon: <GraduationCapIcon />,
    },
    {
      title: "Formación",
      url: "formation",
      icon: <GraduationCapIcon />,
    },
    {
      title: "Configuración",
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
    },
    {
      title: "Administrar Habilidades",
      url: "skills",
      icon: <MedalIcon />,
    },

    {
      title: "Administrar Proyectos",
      url: "projects",
      icon: <BriefcaseIcon />,
    },

    {
      title: "Administrar Experiencia",
      url: "experience",
      icon: <GraduationCapIcon />,
    },
    {
      title: "Administrar Formación",
      url: "formation",
      icon: <GraduationCapIcon />,
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { admin?: boolean }) {
  let admin = false;
  if (props.admin) {
    admin = true;
  }
  const { user } = useAuthStore();
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={admin ? adminData.teams : data.teams} />
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <NavMain items={admin ? adminData.navMain : data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || {}} />
        <Button
          onClick={() => navigate("/portfolios")}
          className="gap-2 bg-[#0A0B1E] hover:bg-[#5c61eb] text-white rounded-ms h-10 mb-2 px-15 py-2 w-fit mx-auto"
        >
          <ArrowLeftIcon size={16} weight="bold" />
          <span>Ir a Portafolios</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
