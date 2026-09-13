import { TeamDetailsForm } from "./TeamDetails";
import { FormationPanel } from "./FormationPanel";
import type { Tab } from "./ControlBar";

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
  if (activeTab !== "Team Details" && activeTab !== "Formation") return null;

  return (
    <div className="w-full md:w-72 bg-[#343A38] rounded-xl p-4 shrink-0">
      {activeTab === "Team Details" && <TeamDetailsForm />}
      {activeTab === "Formation" && (
        <FormationPanel allFormations={allFormations} />
      )}
    </div>
  );
}
