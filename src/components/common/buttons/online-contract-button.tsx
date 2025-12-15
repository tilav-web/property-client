import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardPenLine, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function OnlineContractButton({ file }: { file: string }) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file;
    link.download = file || "contract.pdf";
    link.click();
  };

  return (
    <>
      {/* Asosiy button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0 hover:bg-gray-50 transition-colors"
      >
        <ClipboardPenLine className="w-4 h-4" />
        <span className="whitespace-nowrap">
          {t("common.buttons.online_contract")}
        </span>
      </button>

      {/* PDF Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>{file || "Shartnoma"}</DialogTitle>
            <div className="flex items-center gap-2">
              {/* Yuklab olish tugmasi */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t("common.buttons.download")}
              </Button>
            </div>
          </DialogHeader>

          {/* PDF Ko'rgazmasi */}
          <div className="flex-1 w-full h-full">
            <iframe
              src={file}
              className="w-full h-full border rounded-md"
              title={file || "Shartnoma"}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
