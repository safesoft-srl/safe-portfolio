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

const URL_API = import.meta.env.VITE_API_URL;
interface RegisterErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: RegisterErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }

<<<<<<< HEAD
=======
  
>>>>>>> 9c9a0bb (feat: added username in the register form)
    if (!username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio.";
    } else if (username.length < 3) {
      newErrors.username = "Debe tener al menos 3 caracteres.";
    } else if (/\s/.test(username)) {
      newErrors.username = "No debe contener espacios.";
    }

    if (!email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "El formato del email no es válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    setApiError("");
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL_API}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
<<<<<<< HEAD

=======
         
>>>>>>> 9c9a0bb (feat: added username in the register form)
          body: JSON.stringify({ name, username, email, password }),
        });

        if (response.ok) {
          setStep(2);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Hubo un error al registrar el usuario.");
        }
      } catch {
        setApiError("Error de conexión con el servidor.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyToken = async () => {
    setApiError("");
    setApiSuccess("");

    if (!token.trim()) {
      setApiError("Debes ingresar el código de confirmación.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${URL_API}/api/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (response.ok) {
        setApiSuccess(data.message || "Correo verificado exitosamente");
        navigate("/dashboard");
        // setTimeout(() => { navigate("/login");  }, 1500);
      } else {
        setApiError(data.message || "Error al verificar token.");
      }
    } catch {
      setApiError("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendToken = async () => {
    setApiError("");
    setApiSuccess("");
    setIsLoading(true);

    try {
<<<<<<< HEAD
      const response = await fetch(`${URL_API}/api/resend-token`, {
=======
      const response = await fetch("http://localhost:8000/api/resend-token", {
>>>>>>> 9c9a0bb (feat: added username in the register form)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setApiSuccess(data.message || "Token reenviado correctamente");
      } else {
        setApiError(data.message || "Error al reenviar token.");
      }
    } catch {
      setApiError("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14162f] flex items-center justify-center px-4 py-0 text-slate-100 font-heading">
      <Card className="w-full max-w-md bg-[#13152e] border border-[#232555] shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4 pt-2">
          <CardTitle className="text-2xl font-bold tracking-wide text-white">
            Safe Portfolio
          </CardTitle>
          <CardDescription className="text-sm mt-4 text-slate-400">
            {step === 1 ? "Registrar nueva cuenta" : "Verifica tu cuenta"}
          </CardDescription>
        </CardHeader>

        <div className="relative overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            
            <div className="w-full shrink-0">
              <CardContent className="space-y-4 px-6 pt-2">
                {step === 1 && apiError && (
                  <div className="text-red-400 text-sm font-medium text-center bg-red-950/30 p-2 rounded">
                    {apiError}
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-300">
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const soloLetras = e.target.value.replace(/\d/g, "");
                      setName(soloLetras);
                    }}
                    placeholder="Tu nombre y apellido"
                    className={`h-9 bg-[#1c1f38] font-sans ${errors.name ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4`}
                  />
                  {errors.name && <p className="text-red-400 text-xs ml-1 mt-1">{errors.name}</p>}
                </div>
<<<<<<< HEAD
=======

                
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-xs font-semibold text-slate-300 ml-1">
                    Nombre de usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tu nombre de usuario"
                    className={`h-11 bg-[#1c1f38] ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : 'border-transparent focus-visible:ring-indigo-500'} text-slate-200 placeholder:text-slate-500 rounded-lg px-4`}
                  />
                  {errors.username && <p className="text-red-400 text-xs ml-1 mt-1">{errors.username}</p>}
                </div>

>>>>>>> 9c9a0bb (feat: added username in the register form)
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-xs font-semibold text-slate-300">
                    Nombre de usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tu nombre de usuario"
                    className={`h-9 bg-[#1c1f38] font-sans ${errors.username ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4`}
                  />
                  {errors.username && (
                    <p className="text-red-400 text-xs ml-1 mt-1">{errors.username}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className={`h-9 w-full bg-[#1c1f38] font-sans ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4`}
                  />
                  {errors.email && <p className="text-red-400 text-xs ml-1 mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-300">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="........"
                    className={`h-9 pr-10 bg-[#1c1f38] font-sans ${errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4 tracking-widest`}
                  />
                  {errors.password && (
                    <p className="text-red-400 text-xs ml-1 mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="password-confirm"
                    className="text-xs font-semibold text-slate-300"
                  >
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="password-confirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="........"
                    className={`h-9 pr-10 bg-[#1c1f38] font-sans ${errors.passwordConfirm ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4 tracking-widest`}
                  />
                  {errors.passwordConfirm && (
                    <p className="text-red-400 text-xs ml-1 mt-1">{errors.passwordConfirm}</p>
                  )}
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={isLoading}
                  className="w-full bg-[#6c72ff] hover:bg-[#5c61eb] text-white h-9 rounded-lg font-medium tracking-wide mt-2 font-heading"
                >
                  {isLoading ? "Cargando..." : "Continuar"}
                </Button>
              </CardContent>
            </div>

            
            <div className="w-full shrink-0">
              <CardContent className="space-y-5 px-6 pt-2">
                {step === 2 && apiError && (
                  <div className="text-red-400 text-sm font-medium text-center bg-red-950/30 p-2 rounded">
                    {apiError}
                  </div>
                )}

                {step === 2 && apiSuccess && (
                  <div className="text-green-400 text-sm font-medium text-center bg-green-950/30 p-2 rounded">
                    {apiSuccess}
                  </div>
                )}
                <p className="text-sm text-slate-300 text-center mb-0 mt-4">
                  Hemos enviado un código de confirmación a <br />
                  <span className="font-semibold text-white">{email || "tu correo"}</span>
                </p>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="token" className="text-xs font-semibold text-slate-300">
                    Código de confirmación
                  </Label>
                  <Input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Ej. 123456"
                    className="h-9 bg-[#1c1f38] font-sans border-transparent focus-visible:ring-1 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500 rounded-lg px-4 text-center tracking-widest text-lg"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-6">
                  <Button
                    onClick={handleVerifyToken}
                    disabled={isLoading || token.trim() === ""}
                    className="w-full bg-[#6c72ff] hover:bg-[#5c61eb] text-white h-9 rounded-lg font-medium tracking-wide font-heading"
                  >
                    {isLoading ? "Verificando..." : "Crear cuenta"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleResendToken}
                    disabled={isLoading}
                    className="w-full bg-transparent border-[#2a2d46] text-slate-300 hover:text-white hover:bg-[#1c1f38] h-9 rounded-lg font-medium font-heading"
                  >
                    {isLoading ? "Enviando..." : "Reenviar código"}
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </div>

        <CardFooter className="flex flex-col space-y-3 pt-6 pb-2 px-6 text-center font-sans">
          <div className="text-xs text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-[#6c72ff] hover:text-[#8b8fff] transition-colors font-medium"
            >
              Iniciar Sesión
            </Link>
          </div>
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline"
          >
            {step === 1 ? "Volver a la página principal" : "Cancelar registro"}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
