"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";
import ChatMessage from "./_components/chat-message";
import PropertyCard from "./_components/property-card";
import SuggestedPrompts from "./_components/suggested-prompts";
import { aiPropertyService } from "@/services/ai-property.service";
import type { PropertyType } from "@/interfaces/property/property.interface";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  properties?: PropertyType[];
  currentPage?: number;
  totalPages?: number;
  queryPrompt?: string;
}

export default function AiAgent() {
  const { t } = useTranslation();

  const suggestedPrompts = [
    t("ai_agent_page.prompt1"),
    t("ai_agent_page.prompt2"),
    t("ai_agent_page.prompt3"),
    t("ai_agent_page.prompt4"),
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendPrompt = useCallback(
    async (prompt: string) => {
      if (loading || isFetchingMore) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: prompt,
      };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const response = await aiPropertyService.findPropertWithPrompt(
          prompt,
          1,
          5
        );
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            response.properties.length > 0
              ? t("ai_agent_page.found_properties")
              : t("ai_agent_page.no_properties_found"),
          properties: response.properties,
          currentPage: response.page,
          totalPages: response.totalPages,
          queryPrompt: prompt,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: t("ai_agent_page.error_message"),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [loading, isFetchingMore, t]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSendPrompt(input);
    setInput("");
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    handleSendPrompt(prompt);
  };

  const handleLoadMore = async () => {
    const lastAIMessageIndex = messages.findLastIndex(
      (msg: Message) =>
        msg.type === "ai" && msg.properties && msg.properties.length > 0
    );

    if (lastAIMessageIndex === -1) return;
    const lastAIMessage = messages[lastAIMessageIndex];

    if (
      !lastAIMessage.queryPrompt ||
      !lastAIMessage.currentPage ||
      !lastAIMessage.totalPages ||
      lastAIMessage.currentPage >= lastAIMessage.totalPages
    ) {
      return;
    }

    setIsFetchingMore(true);
    try {
      const nextPage = lastAIMessage.currentPage + 1;
      const response = await aiPropertyService.findPropertWithPrompt(
        lastAIMessage.queryPrompt,
        nextPage,
        5
      );
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const updatedAIMessage: Message = {
          ...lastAIMessage,
          properties: [
            ...(lastAIMessage.properties || []),
            ...response.properties,
          ],
          currentPage: response.page,
        };
        newMessages[lastAIMessageIndex] = updatedAIMessage;
        return newMessages;
      });
    } catch (error) {
      console.error(t("ai_agent_page.error_fetching_more"), error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const lastAIMessageWithProperties = messages.findLast(
    (msg: Message) =>
      msg.type === "ai" && msg.properties && msg.properties.length > 0
  );
  const shouldShowMoreButton =
    lastAIMessageWithProperties &&
    lastAIMessageWithProperties.currentPage &&
    lastAIMessageWithProperties.totalPages &&
    lastAIMessageWithProperties.currentPage <
      lastAIMessageWithProperties.totalPages;

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-lg sm:text-xl font-bold text-foreground">
            {t("ai_agent_page.title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("ai_agent_page.subtitle")}
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 space-y-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pt-16">
              <SuggestedPrompts
                prompts={suggestedPrompts}
                onPromptClick={handlePromptClick}
              />
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id}>
                <ChatMessage message={message} />
                {message.properties && message.properties.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {message.properties.map((property) => (
                      <PropertyCard key={property._id} property={property} />
                    ))}
                  </div>
                )}
                {index === messages.length - 1 && shouldShowMoreButton && (
                  <div className="w-full flex justify-center my-6">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isFetchingMore || loading}
                      variant="secondary"
                    >
                      {isFetchingMore ? (
                        <>
                          <Spinner className="mr-2" />{" "}
                          {t("ai_agent_page.loading_more")}
                        </>
                      ) : (
                        t("ai_agent_page.load_more_button")
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <ChatMessage
                message={{
                  id: "loading",
                  type: "ai",
                  content: t("ai_agent_page.searching"),
                }}
                isLoading
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-border bg-card/80 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("ai_agent_page.input_placeholder")}
              disabled={loading || isFetchingMore}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim() || isFetchingMore}
              size="icon"
              className="shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
