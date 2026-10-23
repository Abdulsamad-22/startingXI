"use client";

import { TeamDetailsForm } from "./TeamDetails";
import { FormationPanel } from "./FormationPanel";
import { TemplatePanel } from "./TemplatesPanel";
import { CustomizePanel } from "./CustomizePanel";
import type { Tab } from "./ControlBar";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const COLLAPSED_HEIGHT = 240;

export function SidePanel({
  activeTab,
  allFormations,
}: {
  activeTab: Tab;
  allFormations: {
    id: string;
    name: string;
    slots: any;
    format_size: number;
  }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  if (
    activeTab !== "Team Details" &&
    activeTab !== "Formation" &&
    activeTab !== "Template" &&
    activeTab !== "Customise"
  )
    // fold again whenever the tab changes
    useEffect(() => {
      setExpanded(false);
    }, [activeTab]);

  // track the real content height, so growing tabs (new templates) are handled automatically
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setContentHeight(el.offsetHeight);
    const observer = new ResizeObserver(() =>
      setContentHeight(el.offsetHeight),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const overflowing = contentHeight > COLLAPSED_HEIGHT + 8; // small tolerance, so near-fits don't get a pointless toggle
  const collapsed = overflowing && !expanded;

  // return null;

  return (
    <div className="w-full md:w-72 bg-[#343A38] rounded-xl p-4 shrink-0">
      <div className="relative">
        <div
          style={
            {
              "--collapsed": `${COLLAPSED_HEIGHT}px`,
              "--full": `${contentHeight}px`,
            } as React.CSSProperties
          }
          className={`overflow-hidden transition-[max-height] duration-300 ease-out md:max-h-none md:overflow-visible ${
            collapsed
              ? "max-h-[var(--collapsed)]"
              : expanded
                ? "max-h-[var(--full)]"
                : "max-h-none"
          }`}
        >
          <div ref={contentRef}>
            {activeTab === "Team Details" && <TeamDetailsForm />}
            {activeTab === "Formation" && (
              <FormationPanel allFormations={allFormations} />
            )}
            {activeTab === "Template" && <TemplatePanel />}
            {activeTab === "Customise" && <CustomizePanel />}
          </div>
        </div>

        {collapsed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#343A38] to-transparent md:hidden" />
        )}
      </div>

      {overflowing && (
        <div className="mt-2 flex justify-end md:hidden">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="flex items-center gap-1 text-xs font-medium text-[#3CEFA1]"
          >
            {expanded ? "Show less" : "Show more"}
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
