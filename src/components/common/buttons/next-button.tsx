import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRightToLine } from "lucide-react";

export default function NextButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-500 active:bg-blue-800"
      type="button"
    >
      <p>Davom etish</p>
      {loading ? <Spinner /> : <ArrowRightToLine />}
    </Button>
  );
}
