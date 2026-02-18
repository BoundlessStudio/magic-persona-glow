import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

/* ─── Types ─── */

export interface PromptInputMessage {
  text: string;
  files?: File[];
}

/* ─── PromptInput ─── */

interface PromptInputContextValue {
  text: string;
  setText: (text: string) => void;
  onSubmit?: (message: PromptInputMessage) => void;
  disabled?: boolean;
}

const PromptInputContext = React.createContext<PromptInputContextValue>({
  text: "",
  setText: () => {},
});

interface PromptInputProps extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (message: PromptInputMessage) => void;
  disabled?: boolean;
}

const PromptInput = React.forwardRef<HTMLFormElement, PromptInputProps>(
  ({ className, children, value, onValueChange, onSubmit, disabled, ...props }, ref) => {
    const [internalText, setInternalText] = React.useState("");
    const text = value ?? internalText;
    const setText = onValueChange ?? setInternalText;

    const handleSubmit = React.useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || disabled) return;
        onSubmit?.({ text: text.trim() });
        setText("");
      },
      [text, disabled, onSubmit, setText]
    );

    return (
      <PromptInputContext.Provider value={{ text, setText, onSubmit, disabled }}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn(
            "flex flex-col gap-2 border-t border-border bg-background p-3",
            className
          )}
          {...props}
        >
          {children}
        </form>
      </PromptInputContext.Provider>
    );
  }
);
PromptInput.displayName = "PromptInput";

/* ─── PromptInputBody ─── */

const PromptInputBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-end gap-2", className)}
    {...props}
  >
    {children}
  </div>
));
PromptInputBody.displayName = "PromptInputBody";

/* ─── PromptInputTextarea ─── */

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">
>(({ className, ...props }, ref) => {
  const { text, setText, disabled } = React.useContext(PromptInputContext);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [text]);

  return (
    <textarea
      ref={(node) => {
        (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
        }
      }}
      disabled={disabled}
      rows={1}
      className={cn(
        "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
PromptInputTextarea.displayName = "PromptInputTextarea";

/* ─── PromptInputSubmit ─── */

const PromptInputSubmit = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { text, disabled } = React.useContext(PromptInputContext);

  return (
    <Button
      ref={ref}
      type="submit"
      size="icon"
      variant="default"
      disabled={!text.trim() || disabled}
      className={cn("h-8 w-8 shrink-0 rounded-full", className)}
      {...props}
    >
      {children ?? <SendHorizonal className="h-4 w-4" />}
    </Button>
  );
});
PromptInputSubmit.displayName = "PromptInputSubmit";

/* ─── PromptInputFooter ─── */

const PromptInputFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between text-xs text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
));
PromptInputFooter.displayName = "PromptInputFooter";

export {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
};
