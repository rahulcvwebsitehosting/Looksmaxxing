import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/index";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-display font-bold text-base transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ballpoint/40 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "btn-postit rounded-[14px_18px_14px_20px] h-12 px-7 py-2.5",
        marker:
          "btn-marker rounded-[14px_18px_14px_20px] h-12 px-7 py-2.5",
        secondary:
          "bg-surface text-pencil pencil-border rounded-[14px_18px_14px_20px] hard-shadow-sm hover:-translate-x-px hover:-translate-y-px active:translate-x-[3px] active:translate-y-[3px] active:shadow-none h-12 px-7 py-2.5",
        ghost:
          "text-pencil hover:text-marker active:scale-[0.98] h-12 px-7 py-2.5",
        destructive:
          "bg-marker text-white pencil-border rounded-[14px_18px_14px_20px] hard-shadow-sm active:translate-x-[3px] active:translate-y-[3px] active:shadow-none h-12 px-7 py-2.5",
        outline:
          "dashed-border bg-surface text-pencil rounded-[14px_18px_14px_20px] hover:bg-postit active:translate-x-[3px] active:translate-y-[3px] active:shadow-none h-12 px-7 py-2.5",
      },
      size: {
        default: "h-12 px-7 py-2.5 text-base",
        sm: "h-10 px-5 text-sm",
        lg: "h-14 px-9 text-lg rounded-[16px_24px_18px_26px]",
        icon: "h-11 w-11 rounded-[12px_16px_14px_18px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
