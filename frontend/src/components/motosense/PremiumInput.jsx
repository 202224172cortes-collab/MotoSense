import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PremiumInput({
  label,
  type = "text",
  error,
  icon: Icon,
  className,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          {label}
        </label>
      )}
      <div
        className={cn(
          "glass rounded-xl flex items-center gap-3 px-4 transition-all duration-300",
          focused && "border-primary/40 glow-blue",
          error && "border-red-500/40",
          className
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "w-4 h-4 transition-colors duration-300",
              focused ? "text-primary" : "text-muted-foreground"
            )}
          />
        )}
        <input
          type={isPassword && showPassword ? "text" : type}
          className="w-full bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 pl-1">{error}</p>
      )}
    </div>
  );
}