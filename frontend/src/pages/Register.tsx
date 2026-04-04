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
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
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

    if (!email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "El formato del email no es válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
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
          body: JSON.stringify({ name, email, password }),
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
        //       setTimeout(() => { navigate("/login");  }, 1500);
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
      const response = await fetch(`${URL_API}/api/resend-token`, {
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
    <div className="min-h-screen bg-[#111321] flex items-center justify-center p-4 font-sans text-slate-100">
      <Card className="w-full max-w-sm bg-[#15172b] border-[#2a2d46] shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center pt-8 pb-4">
          <CardTitle className="text-2xl font-medium tracking-wide text-white">
            Portfolio Pro
          </CardTitle>
          <CardDescription className="text-sm mt-3 text-slate-400">
            {step === 1 ? "Registrar nueva cuenta" : "Verifica tu cuenta"}
          </CardDescription>
        </CardHeader>

        <div className="relative overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            {/* -------------------- STEP 1: Registration Form -------------------- */}
            <div className="w-full shrink-0">
              <CardContent className="space-y-4 px-6 pt-2">
                {step === 1 && apiError && (
                  <div className="text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-900/50 text-center">
                    {apiError}
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-300 ml-1">
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className={`h-11 bg-[#1c1f38] ${errors.name ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4`}
                  />
                  {errors.name && <p className="text-red-400 text-xs ml-1 mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-300 ml-1">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className={`h-11 w-full bg-[#1c1f38] ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4`}
                  />
                  {errors.email && <p className="text-red-400 text-xs ml-1 mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-300 ml-1">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="........"
                    className={`h-11 bg-[#1c1f38] ${errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4 tracking-widest`}
                  />
                  {errors.password && (
                    <p className="text-red-400 text-xs ml-1 mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="password-confirm"
                    className="text-xs font-semibold text-slate-300 ml-1"
                  >
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="password-confirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="........"
                    className={`h-11 bg-[#1c1f38] ${errors.passwordConfirm ? "border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:ring-indigo-500"} text-slate-200 placeholder:text-slate-500 rounded-lg px-4 tracking-widest`}
                  />
                  {errors.passwordConfirm && (
                    <p className="text-red-400 text-xs ml-1 mt-1">{errors.passwordConfirm}</p>
                  )}
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={isLoading}
                  className="w-full bg-[#6c72ff] hover:bg-[#5c61eb] text-white h-11 rounded-lg font-medium tracking-wide mt-2"
                >
                  {isLoading ? "Cargando..." : "Continuar"}
                </Button>
              </CardContent>
            </div>

            {/* -------------------- STEP 2: Token Verification -------------------- */}
            <div className="w-full shrink-0">
              <CardContent className="space-y-5 px-6 pt-2">
                {step === 2 && apiError && (
                  <div className="text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-900/50 text-center">
                    {apiError}
                  </div>
                )}

                {step === 2 && apiSuccess && (
                  <div className="text-green-400 text-sm bg-green-950/30 p-2 rounded border border-green-900/50 text-center">
                    {apiSuccess}
                  </div>
                )}
                <p className="text-sm text-slate-300 text-center mb-4">
                  Hemos enviado un código de confirmación a <br />
                  <span className="font-semibold text-white">{email || "tu correo"}</span>
                </p>

                <div className="space-y-2">
                  <Label htmlFor="token" className="text-xs font-semibold text-slate-300 ml-1">
                    Código de confirmación
                  </Label>
                  <Input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Ej. 123456"
                    className="h-11 bg-[#1c1f38] border-transparent focus-visible:ring-1 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500 rounded-lg px-4 text-center tracking-widest text-lg"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleVerifyToken}
                    disabled={isLoading || token.trim() === ""}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-white h-11 rounded-lg font-medium tracking-wide"
                  >
                    {isLoading ? "Verificando..." : "Crear cuenta"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleResendToken}
                    disabled={isLoading}
                    className="w-full bg-transparent border-[#2a2d46] text-slate-300 hover:text-white hover:bg-[#1c1f38] h-11 rounded-lg font-medium"
                  >
                    {isLoading ? "Enviando..." : "Reenviar código"}
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </div>

        <CardFooter className="flex flex-col space-y-3 pb-8 px-6 text-center">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            {step === 1 ? "Volver al inicio" : "Cancelar registro"}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
