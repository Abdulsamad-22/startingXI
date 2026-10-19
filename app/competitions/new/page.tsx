import CreateCompetitionForm from "@/components/CreateCompetitionForm";
import { CreateCompetitionPaymentListener } from "./CreateCompetitionPaymentListener";

export default function NewCompetitionPage() {
  return (
    <div className="min-h-screen bg-[#555958] text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-[#343a38] rounded-xl p-6 sm:p-8">
        <CreateCompetitionPaymentListener />
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Competition
        </h1>

        <CreateCompetitionForm />
      </div>
    </div>
  );
}
