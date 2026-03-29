import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";

export const Card = ({ className, children }: { className?: string, children: ReactNode }) => (
  <div className={cn("bg-card rounded-2xl border border-border shadow-lg shadow-primary/5 overflow-hidden", className)}>
    {children}
  </div>
);

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]";
    
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "bg-transparent border-2 border-primary/20 text-primary hover:border-primary/50 hover:bg-primary/5"
    };

    return (
      <button ref={ref} className={cn(baseClasses, variants[variant], className)} {...props} />
    );
  }
);
Button.displayName = "Button";

export const Label = ({ htmlFor, children, required }: { htmlFor: string, children: ReactNode, required?: boolean }) => (
  <label htmlFor={htmlFor} className="block text-sm font-bold text-foreground mb-2">
    {children}
    {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
  </label>
);

export const ErrorMessage = ({ id, message }: { id: string, message?: string }) => {
  if (!message) return null;
  return (
    <div id={id} className="flex items-center gap-1.5 mt-2 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-background border-2 text-foreground placeholder:text-muted-foreground transition-all duration-200",
        "focus:outline-none focus:ring-4 hover:border-primary/50",
        error 
          ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
          : "border-border focus:border-primary focus:ring-primary/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean, options: string[] }>(
  ({ className, error, options, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-background border-2 text-foreground appearance-none transition-all duration-200",
          "focus:outline-none focus:ring-4 hover:border-primary/50 cursor-pointer",
          error 
            ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
            : "border-border focus:border-primary focus:ring-primary/20",
          className
        )}
        {...props}
      >
        <option value="" disabled>Select an option...</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 1.5L6 6.5L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
);
Select.displayName = "Select";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-4 py-3 rounded-xl bg-background border-2 text-foreground placeholder:text-muted-foreground transition-all duration-200 min-h-[120px] resize-y",
        "focus:outline-none focus:ring-4 hover:border-primary/50",
        error 
          ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
          : "border-border focus:border-primary focus:ring-primary/20",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
