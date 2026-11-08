"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface FieldControlProps {
  id: string
  "aria-describedby"?: string
  "aria-invalid"?: true
}

export interface FieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  children:
    | React.ReactNode
    | ((props: FieldControlProps) => React.ReactNode)
}

export function Field({
  label,
  hint,
  error,
  children,
  className,
  ...props
}: FieldProps) {
  const uid = React.useId()
  const id = `${uid}-control`
  const hintId = hint ? `${uid}-hint` : undefined
  const errorId = error ? `${uid}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  const controlProps: FieldControlProps = {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
  }

  let control: React.ReactNode
  if (typeof children === "function") {
    control = children(controlProps)
  } else if (React.isValidElement(children)) {
    const child = children as React.ReactElement<Partial<FieldControlProps>>
    const childDescribedBy = child.props["aria-describedby"]
    control = React.cloneElement(child, {
      id: child.props.id ?? controlProps.id,
      "aria-describedby":
        [childDescribedBy, controlProps["aria-describedby"]]
          .filter(Boolean)
          .join(" ") || undefined,
      "aria-invalid": child.props["aria-invalid"] ?? controlProps["aria-invalid"],
    })
  } else {
    control = children
  }

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-widest text-white/50"
      >
        {label}
      </label>
      {control}
      {hint && (
        <p id={hintId} className="text-sm text-white/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const controlClasses =
  "w-full rounded-xl bg-canvas-raised px-4 py-3 text-white placeholder:text-white/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet aria-invalid:bg-danger-surface disabled:opacity-50 disabled:pointer-events-none"

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(controlClasses, className)}
    {...props}
  />
))
Input.displayName = "Input"

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(controlClasses, "resize-y", className)}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(controlClasses, "[&>option]:bg-canvas-raised", className)}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = "Select"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode
  labelClassName?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, labelClassName, label, id, ...props }, ref) => {
    const uid = React.useId()
    const inputId = id ?? uid
    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex cursor-pointer items-center gap-3 text-sm text-white/80",
          labelClassName
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            "size-5 shrink-0 cursor-pointer appearance-none rounded-md bg-canvas-raised transition-colors duration-200 checked:bg-cream-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet aria-invalid:bg-danger-surface disabled:opacity-50 disabled:pointer-events-none",
            className
          )}
          {...props}
        />
        {label}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export function FormRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}
      {...props}
    />
  )
}
