import { Button as HeroButton } from "@heroui/react";
import { type ButtonProps as HeroButtonProps } from "@heroui/react";

import { cn } from "@/lib/utils";

interface Props extends Omit<HeroButtonProps, "variant"> {
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth,
  ...props
}: Props) {
  return (
    <HeroButton
      className={cn(
        variant === "primary" && "bg-blue-600 hover:bg-blue-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/20",
        variant === "ghost" && "text-slate-400 hover:text-white bg-transparent hover:bg-transparent",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </HeroButton>
  );
}