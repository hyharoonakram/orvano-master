import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium uppercase tracking-widest transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] hover:scale-[1.01]";
    
    const variants = {
      primary: "bg-[#D4AF37] text-black hover:bg-[#F5D67B] shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]",
      secondary: "bg-white text-black hover:bg-foreground/90",
      outline: "relative overflow-hidden z-10 border border-[#D4AF37] text-[#D4AF37] transition-colors duration-500 hover:text-black before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:w-[200%] before:aspect-square before:bg-[#D4AF37] before:rounded-[45%] before:-z-10 before:transition-all before:duration-700 hover:before:-top-[50%] before:ease-in-out",
      ghost: "text-foreground hover:text-[#D4AF37]",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-12 px-8 text-sm",
      lg: "h-14 px-10 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
