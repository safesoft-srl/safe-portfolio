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
  /*MedalIcon,
  BriefcaseIcon,
  /*ChartBarIcon,
  GraduationCapIcon,*/
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
    /*{
      title: "Reportes",
      url: "reports",
      icon: <ChartBarIcon />,
    },
    */
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
