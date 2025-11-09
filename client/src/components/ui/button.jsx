import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  asChild = false, 
  ...props 
}, ref) => {
  const Comp = asChild ? 'span' : 'button';
  
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    premium: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95",
  };
  
  const sizes = {
    default: "h-12 px-6 py-3",
    sm: "h-9 px-3",
    lg: "h-14 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };