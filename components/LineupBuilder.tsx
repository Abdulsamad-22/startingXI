"use client";

import { ControlBar, type Tab } from "./ControlBar";
import { SidePanel } from "./SidePanel";
import { ExportCard } from "./ExportCard";
import { Pitch } from "./Pitch";
import { BenchList } from "./BenchList";
import { SquadBuilder } from "./SquadBuilder";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLineupStore } from "@/lib/store/lineupStore";
import { FEATURE_TO_TEMPLATE_ID } from "@/lib/payments/pricing";
import { verifyPayment } from "@/app/payments/action";
import {
  useSensors,
  useSensor,
  DndContext,
  DragEndEvent,
  PointerSensor,
} from "@dnd-kit/core";
import { PaymentCelebration } from "./PaymentsCelebration";

type Formation = { id: string; name: string; slots: any; format_size: number };

export function LineupBuilder({
  allFormations,
}: {
  allFormations: Formation[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Team Details");
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const pendingUnlockRef = useRef<{ feature: string } | null>(null);

  const { primaryColor, secondaryColor, formationId, teamName } =
    useLineupStore();
  const swapSlots = useLineupStore((s) => s.swapSlots);
  const placeBenchPlayerInSlot = useLineupStore(
    (s) => s.placeBenchPlayerInSlot,
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const currentFormation = allFormations.find((f) => f.id === formationId);
  const formatSize = currentFormation?.format_size ?? 11;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const toSlot = Number(String(over.id).replace("slot-", ""));

    if (activeId.startsWith("bench-")) {
      const playerId = activeId.replace("bench-", "");
      placeBenchPlayerInSlot(playerId, toSlot);
    } else if (activeId.startsWith("player-")) {
      const fromSlot = Number(activeId.replace("player-", ""));
      if (fromSlot !== toSlot) swapSlots(fromSlot, toSlot);
    }
  }

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const reference = searchParams.get("reference");
    const feature = searchParams.get("feature");

    if (paymentStatus === "cancelled") {
      router.replace(pathname);
      return;
    }

    if (paymentStatus !== "success" || !reference) return;

    pendingUnlockRef.current = feature ? { feature } : null;
    setCelebrationOpen(true); // pops up immediately, animation starts right away
    router.replace(pathname); // clean the URL now, state already captured above

    let attempts = 0;
    const maxAttempts = 15;

    const check = setInterval(async () => {
      attempts++;
      const result = await verifyPayment(reference);
      if (result.success) {
        clearInterval(check);
        setVerified(true); // lets the component play its finishing strike
      } else if (attempts >= maxAttempts) {
        clearInterval(check);
        setCelebrationOpen(false); // give up quietly if it never confirms
      }
    }, 1000);

    return () => clearInterval(check);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleCelebrationClose() {
    setCelebrationOpen(false);
    setVerified(false);
    const pending = pendingUnlockRef.current;
    if (pending) {
      const templateId =
        FEATURE_TO_TEMPLATE_ID[
          pending.feature as keyof typeof FEATURE_TO_TEMPLATE_ID
        ];
      if (templateId) useLineupStore.getState().setTemplate(templateId as any);
      useLineupStore.getState().setFeatureUnlocked(pending.feature, true);
      pendingUnlockRef.current = null;
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col lg:flex-row gap-6">
        {celebrationOpen && (
          <PaymentCelebration
            verified={verified}
            onClose={handleCelebrationClose}
          />
        )}
        <div className="flex-1 order-1">
          <ControlBar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex flex-col md:flex-row gap-4">
            <SidePanel activeTab={activeTab} allFormations={allFormations} />

            <div className="flex-1">
              <ExportCard>
                <Pitch
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              </ExportCard>

              <BenchList />
            </div>
          </div>
        </div>

        <div className="order-2">
          <SquadBuilder formatSize={formatSize} />
        </div>
      </div>
    </DndContext>
  );
}
