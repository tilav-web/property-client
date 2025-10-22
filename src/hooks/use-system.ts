import { messageService } from "@/services/message.service";
import { useQuery } from "@tanstack/react-query";

export default function useSystem() {
  useQuery({
    queryKey: ["messages/status", "unread"],
    queryFn: () => messageService.findMessageUnread(),
  });

  return null;
}
