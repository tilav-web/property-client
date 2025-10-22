"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";
import ChatMessage from "./_components/chat-message";
import PropertyCard from "./_components/property-card";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  properties?: Property[];
}

interface Property {
  _id: string;
  title: { uz: string; ru: string; en: string };
  description: { uz: string; ru: string; en: string };
  category: string;
  purpose: string;
  price: number;
  currency: string;
  price_type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: { type: string; coordinates: [number, number] };
  address: { uz: string; ru: string; en: string };
  region: string;
  district: string;
  is_premium: boolean;
  is_verified: boolean;
  rating: number;
  amenities: string[];
  banner?: { url: string };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.message || "Found some properties for you!",
        properties: data.properties || [],
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
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

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
                example: "Show me 3-bedroom apartments for rent in Tashkent
                under $500"
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id}>
                  <ChatMessage message={message} />
                  {message.properties && message.properties.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {message.properties.map((property) => (
                        <PropertyCard key={property._id} property={property} />
                      ))}
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
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the property you're looking for..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
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
