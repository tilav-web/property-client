"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";
import ChatMessage from "./_components/chat-message";
import PropertyCard from "./_components/property-card";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentPrompt = input;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentPrompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await aiPropertyService.findPropertWithPrompt(
        currentPrompt,
        1,
        5
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          response.properties.length > 0
            ? "Found some properties for you!"
            : "No properties found for your request.",
        properties: response.properties,
        currentPage: response.page,
        totalPages: response.totalPages,
        queryPrompt: currentPrompt,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const lastAIMessageIndex = messages.findLastIndex(
      (msg) => msg.type === "ai" && msg.properties && msg.properties.length > 0
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
          totalPages: response.totalPages,
        };
        newMessages[lastAIMessageIndex] = updatedAIMessage;
        return newMessages;
      });
    } catch (error) {
      console.error("Error fetching more properties:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const lastAIMessageWithProperties = messages.findLast(
    (msg) => msg.type === "ai" && msg.properties && msg.properties.length > 0
  );
  const shouldShowMoreButton =
    lastAIMessageWithProperties &&
    lastAIMessageWithProperties.currentPage &&
    lastAIMessageWithProperties.totalPages &&
    lastAIMessageWithProperties.currentPage <
      lastAIMessageWithProperties.totalPages;

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            AI Property Finder
          </h1>
          <p className="text-muted-foreground mt-1">
            Search for properties using natural language
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="h-screen overflow-x-auto px-4 pt-56 max-w-4xl mx-auto space-y-6"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Welcome to AI Property Finder
            </h2>
            <p className="text-muted-foreground max-w-md">
              Describe what you're looking for in natural language. For
              example: "Show me 3-bedroom apartments for rent in Tashkent under $500"
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={message.id}>
                <ChatMessage message={message} />
                {message.properties && message.properties.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    >
                      {isFetchingMore ? (
                        <>
                          <Spinner className="mr-2" /> Loading more...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Spinner className="w-5 h-5" />
                <span>AI is searching...</span>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the property you're looking for..."
              disabled={loading || isFetchingMore}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim() || isFetchingMore}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
