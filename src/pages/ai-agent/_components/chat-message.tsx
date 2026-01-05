import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { PropertyType } from "@/interfaces/property/property.interface";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  properties?: PropertyType[];
}

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export default function ChatMessage({
  message,
  isLoading = false,
}: ChatMessageProps) {
  if (message.type === "user") {
    return (
      <div className="flex items-start justify-end gap-3">
        <Card className="max-w-xl bg-primary text-primary-foreground p-3 rounded-lg shadow-sm">
          <p className="text-sm">{message.content}</p>
        </Card>
        <Avatar className="w-8 h-8 border">
          <AvatarFallback>
            <User className="w-4 h-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-start gap-3">
      <Avatar className="w-8 h-8 border">
        <AvatarFallback>
          <Bot className="w-4 h-4 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <Card className="max-w-2xl bg-muted p-3 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner className="w-4 h-4" />
            <p className="text-sm">{message.content}</p>
          </div>
        ) : (
          <p className="text-sm text-foreground">{message.content}</p>
        )}
      </Card>
    </div>
  );
}
