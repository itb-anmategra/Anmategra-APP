<<<<<<< HEAD
import * as React from "react";

import { cn } from "~/lib/utils";
=======
import * as React from "react"

import { cn } from "~/lib/utils"
>>>>>>> 1e3a57ed6fc572cee3dd78807d14d1bff3b8d047

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
<<<<<<< HEAD
    className={cn("rounded-3xl border bg-card text-card-foreground", className)}
    {...props}
  />
));
Card.displayName = "Card";
=======
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"
>>>>>>> 1e3a57ed6fc572cee3dd78807d14d1bff3b8d047

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
<<<<<<< HEAD
));
CardHeader.displayName = "CardHeader";
=======
))
CardHeader.displayName = "CardHeader"
>>>>>>> 1e3a57ed6fc572cee3dd78807d14d1bff3b8d047

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
<<<<<<< HEAD
));
CardTitle.displayName = "CardTitle";
=======
))
CardTitle.displayName = "CardTitle"
>>>>>>> 1e3a57ed6fc572cee3dd78807d14d1bff3b8d047

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
<<<<<<< HEAD
));
CardDescription.displayName = "CardDescription";
=======
))
CardDescription.displayName = "CardDescription"
>>>>>>> 1e3a57ed6fc572cee3dd78807d14d1bff3b8d047

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
<<<<<<< HEAD
));
CardContent.displayName = "CardContent";
=======
))
CardContent.displayName = "CardContent"
>>>>>>> 1e3a57ed6fc572cee3dd78807d14d1bff3b8d047

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
<<<<<<< HEAD
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
=======
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
>>>>>>> 1e3a57ed6fc572cee3dd78807d14d1bff3b8d047
