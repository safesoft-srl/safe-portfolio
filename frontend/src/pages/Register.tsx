import { Link } from "react-router-dom";
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

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#111321] flex items-center justify-center p-4 font-sans text-slate-100">
      <Card className="w-full max-w-sm bg-[#15172b] border-[#2a2d46] shadow-2xl rounded-2xl">
        <CardHeader className="text-center pt-8 pb-4">
          <CardTitle className="text-2xl font-medium tracking-wide text-white">
            Portfolio Pro
          </CardTitle>
          <CardDescription className="text-sm mt-3 text-slate-400">
            Registrar nueva cuenta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pt-2">

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-300 ml-1">
              Nombre completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre y apellido"
              className="h-11 bg-[#1c1f38] border-transparent focus-visible:ring-1 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500 rounded-lg px-4"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-300 ml-1">
              Email
            </Label>
            {/* Contenedor FLEX para alinear input y botón */}
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="h-11 flex-1 bg-[#1c1f38] border-transparent focus-visible:ring-1 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500 rounded-lg px-4"
              />
              <Button 
                type="button" 
                className="h-11 bg-slate-700 hover:bg-slate-600 text-white px-4 rounded-lg font-medium transition-colors"
              >
                Verificar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-300 ml-1">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="........"
              className="h-11 bg-[#1c1f38] border-transparent focus-visible:ring-1 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500 rounded-lg px-4 tracking-widest"
            />

          </div>

          <div className="space-y-2">
            <Label htmlFor="password-confirm" className="text-xs font-semibold text-slate-300 ml-1">
              Confirmar contraseña
            </Label>
            <Input
              id="password-confirm"
              type="password"
              placeholder="........"
              className="h-11 bg-[#1c1f38] border-transparent focus-visible:ring-1 focus-visible:ring-indigo-500 text-slate-200 placeholder:text-slate-500 rounded-lg px-4 tracking-widest"
            />
          </div>

          <Button className="w-full bg-[#6c72ff] hover:bg-[#5c61eb] text-white h-11 rounded-lg font-medium tracking-wide mt-2">
            Crear Cuenta
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pb-8 px-6 text-center">
          
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Volver al inicio
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
