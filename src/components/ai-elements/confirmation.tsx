import {
  createContext,
  useContext,
  type FC,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, type ButtonProps } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type ConfirmationState =
  | "approval-requested"
  | "approval-responded"
  | "output-denied"
  | "output-available";

interface ConfirmationApproval {
  id: string;
  approved?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

interface ConfirmationCtx {
  state: ConfirmationState;
  approval?: ConfirmationApproval;
}

const Ctx = createContext<ConfirmationCtx | null>(null);

function useConfirmation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Must be used inside <Confirmation>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Root                                                              */
/* ------------------------------------------------------------------ */

interface ConfirmationProps extends React.ComponentProps<typeof Alert> {
  state?: ConfirmationState;
  approval?: ConfirmationApproval;
}

export const Confirmation: FC<ConfirmationProps> = ({
  state = "approval-requested",
  approval,
  className,
  children,
  ...props
}) => (
  <Ctx.Provider value={{ state, approval }}>
    <Alert
      className={cn(
        "flex flex-col gap-3 bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Alert>
  </Ctx.Provider>
);

/* ------------------------------------------------------------------ */
/*  Conditional slots                                                 */
/* ------------------------------------------------------------------ */

export const ConfirmationRequest: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const { state } = useConfirmation();
  if (state !== "approval-requested") return null;
  return (
    <AlertDescription className="text-sm text-foreground">
      {children}
    </AlertDescription>
  );
};

export const ConfirmationAccepted: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const { state, approval } = useConfirmation();
  if (
    !(
      (state === "approval-responded" || state === "output-available") &&
      approval?.approved
    )
  )
    return null;
  return (
    <AlertDescription className="flex items-center gap-2 text-sm text-primary">
      {children}
    </AlertDescription>
  );
};

export const ConfirmationRejected: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const { state, approval } = useConfirmation();
  if (
    !(
      state === "output-denied" ||
      (state === "approval-responded" && !approval?.approved)
    )
  )
    return null;
  return (
    <AlertDescription className="flex items-center gap-2 text-sm text-destructive">
      {children}
    </AlertDescription>
  );
};

/* ------------------------------------------------------------------ */
/*  Actions                                                           */
/* ------------------------------------------------------------------ */

export const ConfirmationActions: FC<React.ComponentProps<"div">> = ({
  className,
  children,
  ...props
}) => {
  const { state } = useConfirmation();
  if (state !== "approval-requested") return null;
  return (
    <div
      className={cn("flex items-center justify-end gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const ConfirmationAction: FC<ButtonProps> = ({
  className,
  size = "sm",
  ...props
}) => (
  <Button className={cn(className)} size={size} {...props} />
);
