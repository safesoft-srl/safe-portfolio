import * as React from "react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ReactNode;
    plan: string;
  }[];
}) {
  const activeTeam = teams[0];
  if (!activeTeam) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {activeTeam.logo}
          </div>
          <span className="truncate text-base md:text-lg font-semibold" >{activeTeam.name}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
