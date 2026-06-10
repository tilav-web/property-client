import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Send,
  Users,
  Crown,
  ImageIcon,
  History,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  adminPushService,
  type BroadcastItem,
} from "../../_services/admin-push.service";

// ─── Toolbar button ────────────────────────────────────────────────────────
function ToolbarBtn({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded text-sm transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Rich text editor ───────────────────────────────────────────────────────
function RichEditor({
  onChange,
}: {
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Notification matnini yozing…" }),
    ],
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] max-h-[340px] overflow-y-auto px-3 py-2 text-sm outline-none prose prose-sm max-w-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/30">
        <ToolbarBtn
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarBtn>
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <ToolbarBtn
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarBtn>
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <ToolbarBtn
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          title="Ordered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>
      </div>
      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── History dialog ─────────────────────────────────────────────────────────
function HistoryDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-push-history"],
    queryFn: () => adminPushService.list(),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yuborilgan notification'lar tarixi</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !data?.items.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Hali hech narsa yuborilmagan
          </p>
        ) : (
          <div className="space-y-3">
            {data.items.map((item: BroadcastItem) => (
              <div
                key={item._id}
                className="border border-border rounded-lg p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">{item.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {item.targetGroup === "premium" ? (
                        <><Crown className="h-3 w-3 mr-1" />Premium</>
                      ) : (
                        <><Users className="h-3 w-3 mr-1" />Hammaga</>
                      )}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.sentCount} qurilma
                    </span>
                  </div>
                </div>
                <div
                  className="text-xs text-muted-foreground prose prose-xs max-w-none line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
                {item.imageUrl && (
                  <p className="text-xs text-blue-500 truncate">{item.imageUrl}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {format(new Date(item.createdAt), "dd.MM.yyyy HH:mm")}
                </p>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Yopish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function AdminPushNotificationsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [targetGroup, setTargetGroup] = useState<"all" | "premium">("all");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      adminPushService.send({
        title,
        body,
        imageUrl: imageUrl || undefined,
        targetGroup,
      }),
    onSuccess: (res) => {
      toast.success(`Yuborildi: ${res.sentCount} ta qurilma`);
      setTitle("");
      setBody("");
      setImageUrl("");
      setTargetGroup("all");
      setConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-push-history"] });
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
      setConfirmOpen(false);
    },
  });

  const handleSend = () => {
    if (!title.trim() || !body.trim() || body === "<p></p>") {
      toast.error("Sarlavha va matnni to'ldiring");
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Push Notification</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Foydalanuvchilarga push xabar yuborish
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHistoryOpen(true)}
        >
          <History className="h-4 w-4 mr-2" />
          Tarix
        </Button>
      </div>

      <Separator />

      {/* Form */}
      <div className="space-y-5">
        {/* Target group */}
        <div className="space-y-1.5">
          <Label>Kimga yuborish</Label>
          <Select
            value={targetGroup}
            onValueChange={(v) => setTargetGroup(v as "all" | "premium")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Barcha foydalanuvchilar
                </div>
              </SelectItem>
              <SelectItem value="premium">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Faqat premium foydalanuvchilar
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Label>Sarlavha</Label>
          <Input
            placeholder="Notification sarlavhasi…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground text-right">
            {title.length}/100
          </p>
        </div>

        {/* Body - rich text */}
        <div className="space-y-1.5">
          <Label>Matn</Label>
          <RichEditor onChange={setBody} />
          <p className="text-xs text-muted-foreground">
            Qurilma bildirishnomasi plain text ko'rinadi. Ilova ichida to'liq
            formatlanadi.
          </p>
        </div>

        {/* Image URL */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4" />
            Rasm URL (ixtiyoriy)
          </Label>
          <Input
            placeholder="https://…"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="mt-2 rounded-md max-h-40 object-contain border border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={mutation.isPending}
          className="w-full"
          size="lg"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Yuborish
        </Button>
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tasdiqlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">{title}</span> sarlavhali
              notification{" "}
              <span className="font-medium">
                {targetGroup === "premium" ? "premium" : "barcha"}{" "}
                foydalanuvchilarga
              </span>{" "}
              yuboriladi.
            </p>
            <p className="text-muted-foreground">Bu amalni ortga qaytarib bo'lmaydi.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={mutation.isPending}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Ha, yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <HistoryDialog open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}
