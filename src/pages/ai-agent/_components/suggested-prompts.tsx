"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export default function SuggestedPrompts({
  prompts,
  onPromptClick,
}: SuggestedPromptsProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Lightbulb className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
        {t("ai_agent_page.welcome_title_new")}
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base mb-6">
        {t("ai_agent_page.welcome_description_new")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
        {prompts.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            className="h-auto whitespace-normal text-left justify-start"
            onClick={() => onPromptClick(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
