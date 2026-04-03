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
  GearIcon,
  BriefcaseIcon,
  ChartBarIcon,
  GraduationCapIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/lib/auth-store";

// This is sample data.
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
      url: "/dashboard",
      icon: <LayoutIcon />,
    },
    {
      title: "Perfil",
      url: "/dashboard/profile",
      icon: <UserIcon />,
    },
    {
      title: "Proyectos",
      url: "/dashboard/projects",
      icon: <BriefcaseIcon />,
    },
    {
      title: "Habilidades",
      url: "/dashboard/skills",
      icon: <MedalIcon />,
    },
    {
      title: "Experiencia",
      url: "/dashboard/experience",
      icon: <GraduationCapIcon />,
    },
    {
      title: "Configuración",
      url: "/dashboard/configuration",
      icon: <GearIcon />,
    },
    {
      title: "Reportes",
      url: "/dashboard/reports",
      icon: <ChartBarIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || {}} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
