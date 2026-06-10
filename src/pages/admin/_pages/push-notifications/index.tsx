import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
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
  Link2,
  Link2Off,
  X,
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
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded text-sm transition-colors disabled:opacity-40 ${
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
  onImageUpload,
  uploadingImage,
}: {
  onChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  uploadingImage: boolean;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
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

  const handleImageFile = async (file: File) => {
    const url = await onImageUpload(file);
    editor?.chain().focus().setImage({ src: url }).run();
  };

  const handleLinkToggle = () => {
    if (!editor) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("URL kiriting:");
      if (!url) return;
      editor
        .chain()
        .focus()
        .setLink({ href: url.startsWith("http") ? url : `https://${url}` })
        .run();
    }
  };

  if (!editor) return null;

  return (
    <div className="border border-border rounded-md overflow-hidden">
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
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <ToolbarBtn
          title={editor.isActive("link") ? "Linkni olib tashlash" : "Link qo'shish"}
          active={editor.isActive("link")}
          onClick={handleLinkToggle}
        >
          {editor.isActive("link") ? (
            <Link2Off className="h-4 w-4" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
        </ToolbarBtn>
        <ToolbarBtn
          title="Rasm qo'shish"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploadingImage}
        >
          {uploadingImage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </ToolbarBtn>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImageFile(file);
            e.target.value = "";
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── Cover image picker ─────────────────────────────────────────────────────
function CoverImagePicker({
  value,
  onChange,
  onUpload,
  uploading,
}: {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const url = await onUpload(file);
    onChange(url);
  };

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5">
        <ImageIcon className="h-4 w-4" />
        Cover rasm (ixtiyoriy)
      </Label>

      {value ? (
        <div className="relative w-full rounded-md overflow-hidden border border-border">
          <img
            src={value}
            alt="cover"
            className="w-full max-h-48 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-6 w-6" />
              <span className="text-sm">Rasm tanlash</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
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
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="rounded-md max-h-28 object-cover w-full"
                  />
                )}
                <div
                  className="text-xs text-muted-foreground prose prose-xs max-w-none line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingEditorImage, setUploadingEditorImage] = useState(false);

  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      return await adminPushService.uploadImage(file);
    } catch {
      toast.error("Rasm yuklanmadi");
      return "";
    }
  };

  const handleUploadCover = async (file: File): Promise<string> => {
    setUploadingCover(true);
    try {
      return await handleUploadImage(file);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUploadEditorImage = async (file: File): Promise<string> => {
    setUploadingEditorImage(true);
    try {
      return await handleUploadImage(file);
    } finally {
      setUploadingEditorImage(false);
    }
  };

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
          <RichEditor
            onChange={setBody}
            onImageUpload={handleUploadEditorImage}
            uploadingImage={uploadingEditorImage}
          />
          <p className="text-xs text-muted-foreground">
            Qurilma bildirishnomasi plain text ko'rinadi. Ilova ichida to'liq
            formatlanadi.
          </p>
        </div>

        {/* Cover image */}
        <CoverImagePicker
          value={imageUrl}
          onChange={setImageUrl}
          onUpload={handleUploadCover}
          uploading={uploadingCover}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={mutation.isPending || uploadingCover || uploadingEditorImage}
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
