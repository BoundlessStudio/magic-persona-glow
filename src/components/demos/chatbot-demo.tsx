import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements/sources";

interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
  reasoning?: { content: string; duration: number };
  sources?: { href: string; title: string }[];
}

const initialMessages: ChatMessage[] = [];

const suggestions = [
  "Explain useEffect cleanup",
  "When to use useMemo?",
  "Custom hooks best practices",
  "React Server Components",
];

const mockResponses = [
  "That's a great question! The key thing to understand is that React re-renders components when state changes. Hooks give you fine-grained control over when and how that state updates, which is essential for building performant applications.",
  "Sure! Let me break this down. The concept revolves around composability — you can build complex behavior by combining simple hooks together. Custom hooks let you extract and share stateful logic between components without changing the component hierarchy.",
  "Great topic! The important distinction here is between referential equality and value equality. React uses Object.is() for comparisons, which means objects and arrays create new references on every render unless you memoize them.",
  "Absolutely. The mental model I'd suggest is to think of each hook as a slot in a linked list that React maintains for each component instance. That's why the order of hook calls must be consistent across renders.",
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ChatbotDemo = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const streamResponse = useCallback(async (messageId: string, content: string) => {
    setIsStreaming(true);
    const words = content.split(" ");
    let current = "";

    for (let i = 0; i < words.length; i++) {
      current += (i > 0 ? " " : "") + words[i];
      const snapshot = current;
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: snapshot } : m))
      );
      await delay(Math.random() * 80 + 30);
    }

    setIsStreaming(false);
  }, []);

  const handleSubmit = useCallback(
    (message: { text: string }) => {
      if (!message.text.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: nanoid(),
        from: "user",
        content: message.text,
      };

      const assistantId = nanoid();
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, from: "assistant", content: "" },
      ]);

      setText("");
      streamResponse(assistantId, response);
    },
    [isStreaming, streamResponse]
  );

  const handleSuggestion = useCallback(
    (s: string) => handleSubmit({ text: s }),
    [handleSubmit]
  );

  return (
    <Conversation className="h-full">
      <ConversationContent>
        {messages.map((msg) => (
          <Message key={msg.id} from={msg.from}>
            {msg.from === "assistant" ? (
              <MessageResponse>
                {msg.sources && msg.sources.length > 0 && (
                  <Sources>
                    <SourcesTrigger count={msg.sources.length}>
                      Sources
                    </SourcesTrigger>
                    <SourcesContent>
                      {msg.sources.map((s) => (
                        <Source key={s.href} href={s.href} title={s.title} />
                      ))}
                    </SourcesContent>
                  </Sources>
                )}
                {msg.reasoning && (
                  <Reasoning duration={msg.reasoning.duration}>
                    <ReasoningTrigger>Reasoning</ReasoningTrigger>
                    <ReasoningContent>
                      {msg.reasoning.content}
                    </ReasoningContent>
                  </Reasoning>
                )}
                <MessageContent>{msg.content}</MessageContent>
              </MessageResponse>
            ) : (
              <MessageContent>{msg.content}</MessageContent>
            )}
          </Message>
        ))}
      </ConversationContent>

      <Suggestions>
        {suggestions.map((s) => (
          <Suggestion key={s} onClick={() => handleSuggestion(s)}>
            {s}
          </Suggestion>
        ))}
      </Suggestions>

      <PromptInput
        value={text}
        onValueChange={setText}
        onSubmit={handleSubmit}
        disabled={isStreaming}
      >
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask anything…" />
          <PromptInputSubmit />
        </PromptInputBody>
        <PromptInputFooter>
          <span>Press Enter to send</span>
        </PromptInputFooter>
      </PromptInput>
    </Conversation>
  );
};
