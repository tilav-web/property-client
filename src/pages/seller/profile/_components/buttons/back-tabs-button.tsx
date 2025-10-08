import { Button } from "@/components/ui/button";
import { ArrowLeftToLine } from "lucide-react";

export default function BackTabsButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} variant={"outline"}>
      <ArrowLeftToLine />
      <p>Ortga</p>
    </Button>
  );
}
