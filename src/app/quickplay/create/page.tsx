"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/page-shell";
import PageCard from "@/components/ui/page-card";
import PageTitle from "@/components/ui/page-title";
import {
  PrimaryButton,
  PrimaryLinkButton,
} from "@/components/ui/primary-button";
import {
  DAILY_DRAW_SECONDS,
  DAILY_DRAW_SUBMISSION_KEY,
  ROUTES,
  TINDERART_STORAGE_KEY,
} from "@/lib/constants";
import { isLoggedIn } from "@/lib/auth";

type DailySubmission = {
  date: string;
  image: string;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function DailyDrawPage() {
  const router = useRouter();
  const loggedIn = isLoggedIn();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(DAILY_DRAW_SECONDS);
  const [alreadySubmitted] = useState(() => {
    if (typeof window === "undefined") return false;
    const raw = window.localStorage.getItem(DAILY_DRAW_SUBMISSION_KEY);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw) as DailySubmission;
      return parsed?.date === todayKey();
    } catch {
      return false;
    }
  });
  const [submitted, setSubmitted] = useState(alreadySubmitted);

  useEffect(() => {
    if (!loggedIn) {
      router.replace(
        `${ROUTES.auth}?mode=login&next=${encodeURIComponent(ROUTES.quickplayCreate)}`,
      );
    }
  }, [loggedIn, router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#fffaf1";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#7c2d12";
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (alreadySubmitted || submitted) return;
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [alreadySubmitted, secondsLeft, submitted]);

  if (!loggedIn) return null;

  const locked = alreadySubmitted || submitted || secondsLeft === 0;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const toPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (locked) return;
    drawingRef.current = true;
    lastRef.current = toPoint(event);
  };

  const onMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const next = toPoint(event);
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    lastRef.current = next;
  };

  const onUp = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  const clearCanvas = () => {
    if (locked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#fffaf1";
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const submit = () => {
    if (locked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const submission: DailySubmission = { date: todayKey(), image };
    window.localStorage.setItem(
      DAILY_DRAW_SUBMISSION_KEY,
      JSON.stringify(submission),
    );
    const raw = window.localStorage.getItem(TINDERART_STORAGE_KEY);
    let pool: string[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) pool = parsed.filter(Boolean);
      } catch {}
    }
    const next = [image, ...pool.filter((item) => item !== image)].slice(0, 25);
    window.localStorage.setItem(TINDERART_STORAGE_KEY, JSON.stringify(next));
    setSubmitted(true);
  };

  return (
    <PageShell maxWidth="4xl">
      <PageCard className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
        <PrimaryLinkButton
          href={ROUTES.quickplay}
          className="mb-5 w-fit border-stone-400 bg-stone-100 px-4 py-2 text-xs text-stone-800 hover:bg-stone-200"
        >
          Back
        </PrimaryLinkButton>
        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-stone-500">
          daily draw
        </p>
        <PageTitle className="mt-4 text-4xl sm:text-5xl">
          Draw and submit today&apos;s entry
        </PageTitle>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
          You have one official 3-minute submission each day. Your drawing enters
          TinderArt voting and can climb the daily leaderboard.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-stone-300 bg-white/70 px-4 py-2 text-sm font-semibold text-stone-700">
            Time left: {minutes}:{seconds}
          </div>
          {alreadySubmitted || submitted ? (
            <div className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Today&apos;s submission is locked
            </div>
          ) : null}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-stone-300 bg-[#fffaf1]">
          <canvas
            ref={canvasRef}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            className="block aspect-square w-full touch-none"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton
            type="button"
            onClick={submit}
            disabled={locked}
            className="w-full disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
          >
            Submit daily entry
          </PrimaryButton>
          <PrimaryButton
            type="button"
            onClick={clearCanvas}
            disabled={locked}
            className="w-full border-stone-500 bg-stone-500 hover:bg-stone-600 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
          >
            Clear canvas
          </PrimaryButton>
          <PrimaryLinkButton
            href={ROUTES.tinderArt}
            className="w-full border-stone-400 bg-stone-100 text-stone-800 hover:bg-stone-200 sm:flex-1"
          >
            Go to TinderArt
          </PrimaryLinkButton>
        </div>
      </PageCard>
    </PageShell>
  );
}
