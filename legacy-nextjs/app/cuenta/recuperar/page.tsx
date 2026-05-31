"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrim = email.trim();
    if (!emailTrim) {
      setError("Ingresa tu correo electrónico.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setError("Correo electrónico no válido.");
      return;
    }

    setLoading(true);
    try {
      // Sin backend: simular envío.
      // Integrar con API de recuperación cuando exista.
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
    } catch {
      setError("No pudimos enviar el enlace. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-xl border border-border bg-background-alt p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-foreground-muted">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {sent ? (
          <div className="mt-8 rounded-lg border border-success/30 bg-success-bg p-4 text-sm text-success">
            <p className="font-medium">Revisa tu correo</p>
            <p className="mt-1">
              Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="mt-3 text-foreground-muted">
              ¿No lo recibes? Revisa la carpeta de spam o{" "}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-primary hover:underline"
              >
                intenta de nuevo
              </button>
              .
            </p>
          </div>
        ) : (
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
              <label htmlFor="recuperar-email" className="mb-1.5 block text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
                <Input
                  id="recuperar-email"
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

            <Button
              type="submit"
              variant="default"
              className="w-full bg-accent text-on-accent hover:bg-accent-hover"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Enviando...
                </>
              ) : (
                "Enviar enlace"
              )}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-foreground-muted">
          <Link href="/cuenta/login" className="font-medium text-primary hover:underline">
            ← Volver a iniciar sesión
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
