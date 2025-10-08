import { Button } from "@/components/ui/button";
import BackTabsButton from "../buttons/back-tabs-button";

export default function CommissionerTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const handleSelectCommissioner = () => {
    // tugatish
    handleSelectTab("business_type");
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <BackTabsButton
          onClick={() => handleSelectTab("bank_account_number")}
        />
        <Button onClick={handleSelectCommissioner}>Tugatish</Button>
      </div>
    </div>
  );
}
