"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    if (!emailTrim) {
      setError("Ingresa tu correo electrónico.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setError("Correo electrónico no válido.");
      return;
    }
    if (!passwordTrim) {
      setError("Ingresa tu contraseña.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailTrim,
        password: passwordTrim,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Correo o contraseña incorrectos.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Confirma tu correo antes de iniciar sesión.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.push("/?login=ok");
        router.refresh();
      }
    } catch {
      setError("No pudimos iniciar sesión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-xl border border-border bg-background-alt p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-foreground-muted">
          Accede a tu cuenta para ver cotizaciones y pedidos.
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

          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
              <Input
                id="login-email"
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
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
              <Input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Link
              href="/cuenta/recuperar"
              className="mt-1.5 inline-block text-sm text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
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
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" aria-hidden />
                Iniciar sesión
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          ¿No tienes cuenta?{" "}
          <Link href="/cuenta/registro" className="font-medium text-primary hover:underline">
            Crear cuenta
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
