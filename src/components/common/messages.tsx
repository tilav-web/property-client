import { messageService } from "@/services/message.service";
import { useEffect } from "react";

export default function Messages({ property }: { property?: string }) {
  useEffect(() => {
    (async () => {
      try {
        if (!property) return;
        const data = await messageService.findMessageByProperty(property);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [property]);

  return <div>Messages</div>;
}
