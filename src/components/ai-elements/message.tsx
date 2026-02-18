import * as React from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

/* ─── Message ─── */

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  from: "user" | "assistant";
}

const MessageContext = React.createContext<{ from: "user" | "assistant" }>({
  from: "user",
});

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ from, className, children, ...props }, ref) => (
    <MessageContext.Provider value={{ from }}>
      <div
        ref={ref}
        className={cn(
          "flex gap-3",
          from === "user" ? "flex-row-reverse" : "flex-row",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            from === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {from === "user" ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <div
          className={cn(
            "flex flex-col gap-2 max-w-[80%]",
            from === "user" ? "items-end" : "items-start"
          )}
        >
          {children}
        </div>
      </div>
    </MessageContext.Provider>
  )
);
Message.displayName = "Message";

/* ─── MessageContent ─── */

const MessageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { from } = React.useContext(MessageContext);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
        from === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
MessageContent.displayName = "MessageContent";

/* ─── MessageResponse ─── */

const MessageResponse = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 w-full", className)}
    {...props}
  >
    {children}
  </div>
));
MessageResponse.displayName = "MessageResponse";

export { Message, MessageContent, MessageResponse };
