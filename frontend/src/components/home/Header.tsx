import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RowsIcon, SignOutIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/lib/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "como-funciona", label: "Cómo funciona" },
    { id: "ayuda", label: "Ayuda" },
    { id: "footer", label: "Contactos" },
    { id: "public_portfolios", label: "Portafolios", href: "/feed" },
    { id: "portfolios", label: "Mis Portafolios", href: "/portfolios" },
  ];

  const visibleMenuItems = isAuthenticated
    ? menuItems
    : menuItems.filter((it) => it.id !== "portfolios");

  const handleMenuClick = (sectionId: string) => {
    if (sectionId === "portfolios") {
      navigate("/portfolios");
      return;
    }

    if (sectionId === "public_portfolios") {
      navigate("/feed");
      return;
    }

    if (onNavigate) {
      onNavigate(sectionId);
      return;
    }

    navigate("/", { state: { scrollTo: sectionId } });
  };

  return (
    <header className="border-b border-white/5 bg-[#050816]/70 backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground outline-none">
                  <RowsIcon />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-56 rounded-lg bg-slate-900 backdrop-blur-md border border-white/10"
              >
                {visibleMenuItems.map((item) => {
                  const isActive = item.href && pathname === item.href ? true : activeSection === item.id;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`cursor-pointer focus:bg-white/5 ${
                        isActive ? "text-[#6c72ff] font-medium" : "text-slate-300"
                      }`}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link to="/" className="flex items-center gap-2">
            <div className="hidden md:flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <RowsIcon />
            </div>
            <span className="truncate text-base md:text-lg font-semibold">Safe Portfolio</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {visibleMenuItems.map((item) => {
            const isActive = item.href && pathname === item.href ? true : activeSection === item.id;

            if (isActive) {
              return (
                <Link
                  key={item.id}
                  to={item.href || "#"}
                  className={`text-sm tracking-wide transition-colors ${
                    isActive ? "text-[#6c72ff]" : "text-slate-300 hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`text-sm tracking-wide transition-colors ${
                  isActive ? "text-[#6c72ff]" : "text-slate-300 hover:text-slate-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-9 w-9 rounded-full flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground outline-none"
                aria-label="Abrir usuario"
              >
                <Avatar>
                  <AvatarImage src={""} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="min-w-56 rounded-lg bg-slate-900 backdrop-blur-md border border-white/10"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar>
                        <AvatarImage src={""} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight text-slate-300">
                        <span className="truncate font-medium">{user?.name}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {(user?.role === "admin" || user?.role === "Super Admin") && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate("/admin")}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheckIcon size={16} />
                        Panel de Administración
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <SignOutIcon />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                className="h-9 sm:h-10 rounded-lg sm:rounded-xl border border-slate-600/60 bg-transparent px-3 sm:px-6 text-xs sm:text-sm tracking-wide text-slate-100 hover:bg-white/5 transition-all"
                onClick={() => navigate("/login")}
              >
                <span className="hidden sm:inline">Iniciar sesión</span>
                <span className="sm:hidden">Entrar</span>
              </Button>
              <Button
                className="h-9 sm:h-10 rounded-lg sm:rounded-xl bg-[#6c72ff] px-3 sm:px-6 text-xs sm:text-sm font-medium tracking-wide text-white hover:bg-[#5c61eb] shadow-lg shadow-[#6c72ff]/20 transition-all"
                onClick={() => navigate("/register")}
              >
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
