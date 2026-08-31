"use client";

import React, { useState, useRef } from "react";
import {
  Mail,
  MapPin,
  MessageCircle,
  HelpCircle,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const EMAIL = "proyectos@seguridad-avanzada.com";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525636741156";
const WHATSAPP_MESSAGE =
  "Hola, necesito información sobre productos y servicios de Seguridad Avanzada.";
const ADDRESS = "Av. Clavería 237, Claveria, Azcapotzalco, 02080 Ciudad de México, CDMX";

export default function ContactoPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Auto-ocultar toast después de 5 s
  React.useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(t);
  }, [notification]);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (formRef.current && serviceID && templateID && publicKey) {
      const emailjs = (await import("@emailjs/browser")).default;
      emailjs
        .sendForm(serviceID, templateID, formRef.current, publicKey)
        .then(
          () => {
            setNotification({
              message: "Mensaje enviado. Te responderemos pronto.",
              type: "success",
            });
            formRef.current?.reset();
          },
          () => {
            setNotification({
              message: "No pudimos enviar el mensaje. Intenta de nuevo o escríbenos por WhatsApp.",
              type: "error",
            });
          }
        )
        .finally(() => setLoading(false));
    } else {
      setNotification({
        message:
          "El formulario no está configurado. Escríbenos a " +
          EMAIL +
          " o por WhatsApp.",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Toast fijo (complementa el mensaje inline del formulario) */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-xl px-4 py-3 shadow-lg ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-amber-600 text-white"
          }`}
        >
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}
      {/* Banner: gradiente de marca, sin dependencia de imágenes externas */}
      <section
        className="relative flex min-h-[220px] flex-col justify-center px-4 py-14 text-white md:min-h-[260px] md:py-20"
        aria-label="Encabezado de contacto"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-syscom-nav-dark via-syscom-primary to-syscom-nav-dark" />
        <div className="absolute inset-0 z-0 bg-black/20" />
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Estamos aquí para ayudarte
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-white/90 md:text-xl">
            Cotizaciones, soporte técnico y entregas en CDMX y todo México.
          </p>
        </div>
      </section>

      {/* Contenido principal: grid de 2 columnas en desktop */}
      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="rounded-2xl border border-syscom-border bg-white p-6 shadow-lg md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Columna izquierda: información de contacto y FAQ */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
                  Información de contacto
                </h2>
                <p className="mt-1 text-slate-600">
                  Escríbenos o visítanos para cotizaciones y soporte.
                </p>
              </div>

              <ul className="space-y-5" role="list">
                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-syscom-primary/10 text-syscom-primary">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-800">Oficina</h3>
                    <p className="mt-0.5 text-slate-600">{ADDRESS}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-syscom-primary/10 text-syscom-primary">
                    <Mail className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-800">Correo</h3>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-0.5 text-slate-600 underline decoration-syscom-primary/50 underline-offset-2 hover:text-syscom-primary"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-syscom-primary/10 text-syscom-primary">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-800">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1.5 text-slate-600 underline decoration-syscom-primary/50 underline-offset-2 hover:text-syscom-primary"
                    >
                      +52 56 3674 1156
                      <span className="text-xs text-slate-500">(abre WhatsApp)</span>
                    </a>
                  </div>
                </li>
              </ul>

              <div className="rounded-xl bg-syscom-surface p-5">
                <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                  <HelpCircle className="h-5 w-5 text-syscom-primary" aria-hidden />
                  ¿Necesitas cotización a proyecto?
                </h3>
                <p className="mt-2 text-slate-600">
                  Envíanos los detalles por este formulario o por WhatsApp y te
                  respondemos con precios y disponibilidad. Entregas en CDMX y
                  envíos a todo México.
                </p>
              </div>
            </div>

            {/* Columna derecha: formulario */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
                Envíanos un mensaje
              </h2>
              <p className="mt-1 text-slate-600">
                Responde en menos de 24 horas.
              </p>

              <form
                ref={formRef}
                onSubmit={sendEmail}
                className="mt-6 space-y-5"
                noValidate
              >
                <div>
                  <label
                    htmlFor="user_name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    required
                    autoComplete="name"
                    className="mt-1.5 block w-full rounded-xl border border-syscom-border bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-syscom-primary focus:outline-none focus:ring-2 focus:ring-syscom-primary/20"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label
                    htmlFor="user_email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    required
                    autoComplete="email"
                    className="mt-1.5 block w-full rounded-xl border border-syscom-border bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-syscom-primary focus:outline-none focus:ring-2 focus:ring-syscom-primary/20"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="user_phone"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Teléfono <span className="text-slate-400">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    id="user_phone"
                    name="user_phone"
                    autoComplete="tel"
                    className="mt-1.5 block w-full rounded-xl border border-syscom-border bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-syscom-primary focus:outline-none focus:ring-2 focus:ring-syscom-primary/20"
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mensaje <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="mt-1.5 block w-full resize-y rounded-xl border border-syscom-border bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-syscom-primary focus:outline-none focus:ring-2 focus:ring-syscom-primary/20"
                    placeholder="Cuéntanos qué necesitas: cotización, soporte, entrega..."
                  />
                </div>

                {notification && (
                  <div
                    role="alert"
                    className={`flex items-start gap-3 rounded-xl p-4 ${
                      notification.type === "success"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {notification.type === "success" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium">{notification.message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-syscom-accent px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-syscom-accent-hover focus:outline-none focus:ring-2 focus:ring-syscom-accent focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" aria-hidden />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-slate-500">
                Prefieres WhatsApp?{" "}
                <Link
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-syscom-primary hover:underline"
                >
                  Escríbenos por WhatsApp
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
