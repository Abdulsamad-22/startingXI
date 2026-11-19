"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function PaymentCelebration({
  verified,
  onClose,
}: {
  verified: boolean;
  onClose: () => void;
}) {
  const ballRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const netRef = useRef<SVGGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const bounceRef = useRef<gsap.core.Timeline | null>(null);
  const onCloseRef = useRef(onClose);
  const goalStartedRef = useRef(false);
  const [bounceReady, setBounceReady] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Loading state: ball bounces gently in front of the goal.
  useEffect(() => {
    const ball = ballRef.current;
    const shadow = shadowRef.current;

    if (!ball || !shadow) return;

    gsap.set(ball, {
      attr: { transform: "translate(52 130)" },
      opacity: 1,
    });

    gsap.set(shadow, {
      attr: { rx: 10, ry: 3 },
      opacity: 0.28,
    });

    const bounce = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.1,
    });

    bounce
      .to(ball, {
        attr: { transform: "translate(55 102)" },
        duration: 0.34,
        ease: "power2.out",
      })
      .to(
        shadow,
        {
          attr: { rx: 6, ry: 1.8 },
          opacity: 0.14,
          duration: 0.34,
          ease: "power2.out",
        },
        "<",
      )
      .to(ball, {
        attr: { transform: "translate(58 130)" },
        duration: 0.28,
        ease: "power2.in",
      })
      .to(
        shadow,
        {
          attr: { rx: 11, ry: 3.2 },
          opacity: 0.28,
          duration: 0.28,
          ease: "power2.in",
        },
        "<",
      )
      .to(ball, {
        attr: { transform: "translate(55 112)" },
        duration: 0.25,
        ease: "power2.out",
      })
      .to(
        shadow,
        {
          attr: { rx: 7, ry: 2 },
          opacity: 0.17,
          duration: 0.25,
        },
        "<",
      )
      .to(ball, {
        attr: { transform: "translate(52 130)" },
        duration: 0.22,
        ease: "power2.in",
      })
      .to(
        shadow,
        {
          attr: { rx: 10, ry: 3 },
          opacity: 0.28,
          duration: 0.22,
        },
        "<",
      )
      .call(() => setBounceReady(true));

    bounceRef.current = bounce;

    return () => {
      bounce.kill();
      bounceRef.current = null;
    };
  }, []);

  // Confirmed state: stop bouncing, then send the ball into the exact goal centre.
  useEffect(() => {
    if (!verified || !bounceReady || goalStartedRef.current) return;

    const ball = ballRef.current;
    const shadow = shadowRef.current;
    const net = netRef.current;
    const flash = flashRef.current;
    const text = textRef.current;

    if (!ball || !shadow || !net || !flash || !text) return;

    goalStartedRef.current = true;
    bounceRef.current?.kill();

    const goal = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(1.1, () => onCloseRef.current());
      },
    });

    goal
      // Land naturally first, regardless of where the bounce stopped.
      .to(ball, {
        attr: { transform: "translate(52 130)" },
        duration: 0.16,
        ease: "power2.out",
      })
      // Kick into the centre of the goal: x=80, y=58.
      .to(ball, {
        attr: { transform: "translate(80 58)" },
        duration: 0.5,
        ease: "power3.in",
      })
      .to(
        shadow,
        {
          opacity: 0,
          attr: { rx: 4, ry: 1 },
          duration: 0.22,
        },
        "<",
      )
      // Net reacts only after the ball arrives.
      .to(net, {
        skewX: -6,
        scaleX: 1.08,
        scaleY: 1.1,
        duration: 0.1,
        ease: "power1.out",
      })
      .to(net, {
        skewX: 4,
        scaleX: 0.98,
        scaleY: 0.96,
        duration: 0.12,
        ease: "power1.inOut",
      })
      .to(net, {
        skewX: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.28,
        ease: "elastic.out(1, 0.45)",
      })
      .to(flash, { opacity: 0.5, duration: 0.08 }, "-=0.34")
      .to(flash, { opacity: 0, duration: 0.42 })
      .fromTo(
        text,
        { opacity: 0, scale: 0.72, y: 8 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: "back.out(1.7)",
        },
        "-=0.2",
      );

    return () => {
      goal.kill();
    };
  }, [verified, bounceReady]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div
        className="relative w-full max-w-xs overflow-hidden rounded-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, #163d2a 0%, #0A1F15 80%)",
        }}
      >
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-[2px] opacity-50">
          {Array.from({ length: 36 }).map((_, index) => (
            <div
              key={index}
              className="rounded-t-full bg-black/50"
              style={{ width: 4, height: 6 + ((index * 5) % 9) }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center py-8">
          <div
            ref={flashRef}
            className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 blur-xl"
          />

          <svg viewBox="0 0 160 150" className="h-36 w-40">
            {/* Goal posts */}
            <rect x="20" y="12" width="120" height="5" fill="white" />
            <rect x="20" y="12" width="5" height="85" fill="white" />
            <rect x="135" y="12" width="5" height="85" fill="white" />

            {/* Ball is rendered before the net, so it looks inside the goal. */}
            <g ref={ballRef} transform="translate(52 130)">
              <circle r="9" fill="white" />
              <polygon
                points="0,-4 3.5,-1.3 2,2.8 -2,2.8 -3.5,-1.3"
                fill="#0A1A14"
                opacity="0.75"
              />
            </g>

            {/* Net overlays the scored ball. */}
            <g ref={netRef} style={{ transformOrigin: "top center" }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <line
                  key={`vertical-${index}`}
                  x1={30 + index * 16}
                  y1="18"
                  x2={30 + index * 16}
                  y2="95"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}

              {Array.from({ length: 7 }).map((_, index) => (
                <line
                  key={`horizontal-${index}`}
                  x1="25"
                  y1={18 + index * 13}
                  x2="135"
                  y2={18 + index * 13}
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}
            </g>

            <ellipse
              ref={shadowRef}
              cx="52"
              cy="134"
              rx="10"
              ry="3"
              fill="black"
              opacity="0.28"
            />
          </svg>

          <div
            ref={textRef}
            className="mt-2 text-center"
            style={{
              fontFamily: "var(--font-heading)",
              opacity: 0,
            }}
          >
            <p className="mb-1 text-xs uppercase tracking-[0.3em] text-[#3CEFA1]">
              Goal
            </p>
            <p className="text-xl font-black uppercase text-white">
              Payment Confirmed
            </p>
          </div>

          {!verified && (
            <p className="mt-3 text-xs text-white/40">
              Confirming your payment...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
