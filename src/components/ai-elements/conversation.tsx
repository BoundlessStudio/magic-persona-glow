import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

/* ─── Conversation ─── */

const Conversation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col h-full overflow-hidden", className)}
    {...props}
  >
    {children}
  </div>
));
Conversation.displayName = "Conversation";

/* ─── ConversationContent ─── */

interface ConversationContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  autoScroll?: boolean;
}

const ConversationContent = React.forwardRef<
  HTMLDivElement,
  ConversationContentProps
>(({ className, children, autoScroll = true, ...props }, ref) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const combinedRef = useCombinedRefs(ref, innerRef);
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  const scrollToBottom = React.useCallback(() => {
    const el = innerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (autoScroll) {
        const isNearBottom =
          el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        if (isNearBottom) scrollToBottom();
      }
    });

    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [autoScroll, scrollToBottom]);

  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={combinedRef}
        className={cn("h-full overflow-y-auto p-4", className)}
        {...props}
      >
        <div className="space-y-4">{children}</div>
      </div>
      {showScrollButton && (
        <ConversationScrollButton onClick={scrollToBottom} />
      )}
    </div>
  );
});
ConversationContent.displayName = "ConversationContent";

/* ─── ConversationScrollButton ─── */

interface ConversationScrollButtonProps {
  onClick?: () => void;
}

const ConversationScrollButton: React.FC<ConversationScrollButtonProps> = ({
  onClick,
}) => (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
    <Button
      variant="secondary"
      size="icon"
      className="h-8 w-8 rounded-full shadow-lg"
      onClick={onClick}
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  </div>
);
ConversationScrollButton.displayName = "ConversationScrollButton";

/* ─── Helpers ─── */

function useCombinedRefs<T>(
  ...refs: (React.Ref<T> | React.MutableRefObject<T | null>)[]
) {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    }
  }, [refs]);

  return targetRef;
}

export {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
};
