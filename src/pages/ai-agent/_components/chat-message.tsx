import { Card } from "@/components/ui/card";
import type { PropertyType } from "@/interfaces/property/property.interface";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  properties?: PropertyType[];
}

export default function ChatMessage({ message }: { message: Message }) {
  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <Card className="max-w-md bg-primary text-primary-foreground p-4 rounded-lg">
          <p className="text-sm">{message.content}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <Card className="max-w-2xl bg-muted p-4 rounded-lg">
        <p className="text-sm text-foreground">{message.content}</p>
      </Card>
    </div>
  );
}
