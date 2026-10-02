"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function PaymentCelebration({
  verified,
  onClose,
}: {
  verified: boolean; // flips true once verifyPayment confirms — animation waits for this before finishing
  onClose: () => void;
}) {
  const ballRef = useRef<SVGGElement>(null);
  const netRef = useRef<SVGGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [bouncePhaseDone, setBouncePhaseDone] = useState(false);

  // bounce loop — plays immediately, repeats gently while waiting on verification
  useEffect(() => {
    gsap.set(ballRef.current, { x: -34, y: 0, scale: 1, opacity: 1 });

    const bounce = gsap.timeline({ repeat: -1 });
    bounce
      .to(ballRef.current, {
        y: -34,
        x: -18,
        duration: 0.32,
        ease: "power2.out",
      })
      .to(ballRef.current, { y: 0, duration: 0.28, ease: "power2.in" })
      .to(ballRef.current, { y: -22, x: 0, duration: 0.26, ease: "power2.out" })
      .to(ballRef.current, { y: 0, duration: 0.22, ease: "power2.in" })
      .to(ballRef.current, { y: -14, x: 18, duration: 0.2, ease: "power2.out" })
      .to(ballRef.current, { y: 0, duration: 0.16, ease: "power2.in" })
      .call(() => setBouncePhaseDone(true));

    return () => {
      bounce.kill();
    };
  }, []);

  // final strike + confirmation — only once verified is true AND at least one bounce cycle has shown
  useEffect(() => {
    if (!verified || !bouncePhaseDone) return;

    const tl = gsap.timeline({
      onComplete: () => setTimeout(onClose, 700),
    });

    tl.to(ballRef.current, {
      x: 30,
      y: -45,
      scale: 0.5,
      duration: 0.3,
      ease: "power1.in",
    })
      .to(ballRef.current, { opacity: 0, duration: 0.1 })
      .to(netRef.current, {
        skewX: -6,
        scaleY: 1.04,
        duration: 0.1,
        ease: "power1.out",
      })
      .to(netRef.current, {
        skewX: 4,
        scaleY: 0.98,
        duration: 0.12,
        ease: "power1.inOut",
      })
      .to(netRef.current, {
        skewX: 0,
        scaleY: 1,
        duration: 0.2,
        ease: "elastic.out(1, 0.4)",
      })
      .to(flashRef.current, { opacity: 0.5, duration: 0.08 }, "-=0.3")
      .to(flashRef.current, { opacity: 0, duration: 0.4 })
      .fromTo(
        textRef.current,
        { opacity: 0, scale: 0.7, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" },
        "-=0.2",
      );

    return () => {
      tl.kill();
    };
  }, [verified, bouncePhaseDone, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div
        className="relative w-full max-w-xs rounded-2xl overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, #163d2a 0%, #0A1F15 80%)",
        }}
      >
        {/* crowd strip */}
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-[2px] opacity-50">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="rounded-t-full bg-black/50"
              style={{ width: 4, height: 6 + ((i * 5) % 9) }}
            />
          ))}
        </div>

        <div className="relative py-8 flex flex-col items-center">
          <div
            ref={flashRef}
            className="absolute inset-0 bg-white rounded-full blur-xl opacity-0 pointer-events-none"
          />

          <svg viewBox="0 0 160 150" className="w-40 h-36">
            <g>
              <rect x="20" y="12" width="120" height="5" fill="white" />
              <rect x="20" y="12" width="5" height="85" fill="white" />
              <rect x="135" y="12" width="5" height="85" fill="white" />
              <g ref={netRef} style={{ transformOrigin: "top center" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={30 + i * 16}
                    y1="18"
                    x2={30 + i * 16}
                    y2="95"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="25"
                    y1={18 + i * 13}
                    x2="135"
                    y2={18 + i * 13}
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                ))}
              </g>
            </g>

            {/* ground shadow, anchored independently of the ball's bounce so it reads as a fixed ground plane */}
            <ellipse
              cx="80"
              cy="134"
              rx="10"
              ry="3"
              fill="black"
              opacity="0.3"
            />

            <g ref={ballRef} transform="translate(80, 130)">
              <circle r="9" fill="white" />
              <polygon
                points="0,-4 3.5,-1.3 2,2.8 -2,2.8 -3.5,-1.3"
                fill="black"
                opacity="0.7"
              />
            </g>
          </svg>

          <div
            ref={textRef}
            className="text-center mt-2"
            style={{ fontFamily: "var(--font-heading)", opacity: 0 }}
          >
            <p className="text-[#3CEFA1] text-xs tracking-[0.3em] uppercase mb-1">
              Goal
            </p>
            <p className="text-white text-xl font-black uppercase">
              Payment Confirmed
            </p>
          </div>

          {!bouncePhaseDone || !verified ? (
            <p className="text-white/40 text-xs mt-3">
              Confirming your payment...
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
