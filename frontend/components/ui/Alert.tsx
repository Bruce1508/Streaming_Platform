// components/ui/alert.tsx

import * as React from "react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'destructive'
}>(({ className, variant = 'default', ...props }, ref) => {
    const variants = {
        default: "bg-blue-50 border-blue-200 text-blue-800",
        destructive: "bg-red-50 border-red-200 text-red-800",
    }

    return (
        <div
            ref={ref}
            role="alert"
            className={cn(
                "relative w-full rounded-lg border p-4",
                variants[variant],
                className
            )}
            {...props}
        />
    )
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("text-sm [&_p]:leading-relaxed", className)}
            {...props}
        />
    ))
AlertDescription.displayName = "AlertDescription"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h5
            ref={ref}
            className={cn("mb-1 font-medium leading-none tracking-tight", className)}
            {...props}
        />
    ))
AlertTitle.displayName = "AlertTitle"

export { Alert, AlertDescription, AlertTitle }