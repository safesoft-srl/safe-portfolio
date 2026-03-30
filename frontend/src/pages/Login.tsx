import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/lib/auth-store";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const loginFn = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/auth/login", { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Save the token and expiration using our Zustand store
        loginFn(data.data.access_token, data.data.expires_in);
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    },
    onError: (error: unknown) => {
      if (error instanceof axios.AxiosError) {
        setErrorMsg(
          error.response?.data?.message || "Un error ha ocurrido durante el inicio de sesión"
        );
      } else {
        setErrorMsg("Error desconocido");
      }
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#111321] flex items-center justify-center p-4 font-sans text-slate-100">
      <Card className="w-full max-w-sm bg-[#15172b] border-[#2a2d46] shadow-2xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center pt-8 pb-4">
            <CardTitle className="text-2xl font-medium tracking-wide text-white">
              Portfolio Pro
            </CardTitle>
            <CardDescription className="text-sm mt-3 text-slate-400">
              Inicia sesión en tu cuenta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 px-6 pt-2">
            {errorMsg && (
              <div className="text-red-400 text-sm font-medium text-center bg-red-950/30 p-2 rounded">
                {errorMsg}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-300 ml-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="h-11 bg-[#1c1f38] border-transparent focus-visible:ring-1 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500 rounded-lg px-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-300 ml-1">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="........"
                className="h-11 bg-[#1c1f38] border-transparent focus-visible:ring-1 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500 rounded-lg px-4 tracking-widest"
              />
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#6c72ff] hover:bg-[#5c61eb] text-white h-11 rounded-lg font-medium tracking-wide mt-2 disabled:opacity-50"
            >
              {loginMutation.isPending ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pb-8 px-6 text-center">
            <div className="text-sm text-slate-400">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-[#6c72ff] hover:text-[#8b8fff] transition-colors font-medium"
              >
                Regístrate
              </Link>
            </div>
            <Link to="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Volver al inicio
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
