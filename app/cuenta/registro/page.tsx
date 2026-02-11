"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, Mail, Lock, User, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const nombreTrim = nombre.trim();
    const emailTrim = email.trim();
    const telefonoTrim = telefono.trim();
    const passwordTrim = password.trim();
    const confirmTrim = confirmarPassword.trim();

    if (!nombreTrim) {
      setError("Ingresa tu nombre.");
      return;
    }
    if (!emailTrim) {
      setError("Ingresa tu correo electrónico.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setError("Correo electrónico no válido.");
      return;
    }
    if (!passwordTrim) {
      setError("Ingresa una contraseña.");
      return;
    }
    if (passwordTrim.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (passwordTrim !== confirmTrim) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!aceptarTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email: emailTrim,
        password: passwordTrim,
        options: {
          data: {
            nombre: nombreTrim,
            telefono: telefonoTrim || undefined,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Este correo ya está registrado. Inicia sesión.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // Si Supabase requiere confirmación de email, data.session puede ser null
      if (data?.session) {
        router.push("/?registro=ok");
        router.refresh();
      } else {
        setLoading(false);
        setPassword("");
        setConfirmarPassword("");
        setSuccess(
          "Cuenta creada. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión."
        );
      }
    } catch {
      setError("No pudimos crear tu cuenta. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-xl border border-border bg-background-alt p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Crear cuenta
        </h1>
        <p className="mt-2 text-foreground-muted">
          Regístrate para acceder a cotizaciones y hacer seguimiento de tus pedidos.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div
              className="flex items-center gap-2 rounded-lg border border-error/30 bg-error-bg px-4 py-3 text-sm text-error"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div
              className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-bg px-4 py-3 text-sm text-success"
              role="status"
            >
              {success}
            </div>
          )}

          <div>
            <label htmlFor="registro-nombre" className="mb-1.5 block text-sm font-medium text-foreground">
              Nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
              <Input
                id="registro-nombre"
                type="text"
                name="nombre"
                autoComplete="name"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="registro-email" className="mb-1.5 block text-sm font-medium text-foreground">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
              <Input
                id="registro-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="registro-telefono" className="mb-1.5 block text-sm font-medium text-foreground">
              Teléfono <span className="text-foreground-muted">(opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
              <Input
                id="registro-telefono"
                type="tel"
                name="telefono"
                autoComplete="tel"
                placeholder="55 1234 5678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="registro-password" className="mb-1.5 block text-sm font-medium text-foreground">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
              <Input
                id="registro-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="registro-confirmar" className="mb-1.5 block text-sm font-medium text-foreground">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
              <Input
                id="registro-confirmar"
                type="password"
                name="confirmarPassword"
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="registro-terminos"
              type="checkbox"
              checked={aceptarTerminos}
              onChange={(e) => setAceptarTerminos(e.target.checked)}
              disabled={loading}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="registro-terminos" className="text-sm text-foreground-muted">
              Acepto los{" "}
              <Link href="/terminos" className="text-primary hover:underline">
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link href="/aviso-privacidad" className="text-primary hover:underline">
                política de privacidad
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full bg-accent text-on-accent hover:bg-accent-hover"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" aria-hidden />
                Crear cuenta
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/cuenta/login" className="font-medium text-primary hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-foreground-muted">
        <Link href="/" className="hover:text-primary hover:underline">
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
