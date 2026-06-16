import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { DEFAULT_DURATION, type ToastOptions, type ToastVariant } from "./types"
import { useTerminalDimensions } from "@opentui/react"
import type { SHA512_256 } from "bun"

export type ToastContextValue = {
  show: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = (): ToastContextValue => {
  const value = useContext(ToastContext)

  if (!value) throw new Error("useToast must be used within a ToastProvider")
  return value
}

type ToastProviderProps = {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null)
  const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null)

  const clearCurrentTimeout = useCallback(() => {
    if (timeoutHandleRef.current) {
      clearTimeout(timeoutHandleRef.current)
      timeoutHandleRef.current = null
    }
  }, [])

  const show = useCallback((options: ToastOptions) => {
    const duration = options.duration ?? DEFAULT_DURATION

    clearCurrentTimeout()

    setCurrentToast({
      variant: options.variant ?? "info",
      ...options,
      duration
    })

    timeoutHandleRef.current = setTimeout(() => {
     setCurrentToast(null)
    }, duration).unref()
  }, [clearCurrentTimeout])

  const value: ToastContextValue = { show }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast currentToast={currentToast} />
    </ToastContext.Provider>
  )
}

type ToastProps = {
  currentToast: ToastOptions | null
}

const Toast = ({ currentToast }: ToastProps) => {
  const { width } = useTerminalDimensions()

  if (!currentToast) return null

  const variantColors: Record<ToastVariant, string> = {
    success: "#82E0AA",
    info: "#56D6C2",
    error: '#E74C5E'
  }

  const borderColor = currentToast.variant
    ? variantColors[currentToast.variant]
    : variantColors.info

  return (
    <box
      position="absolute"
      justifyContent="center"
      alignItems="flex-start"
      top={2}
      right={2}
      width={Math.max(1, Math.min(60, width - 6))}
      paddingX={2}
      paddingY={1}
      backgroundColor={'#1A1A24'}
      borderColor={borderColor}
      border={["left", "right"]}
      // TODO: add split border
    >
      <box flexDirection="column" gap={1} width={"100%"}>
        <text fg="#E1E1E1" wrapMode="word" width={"100%"}>
          {currentToast.message}
        </text>
      </box>
    </box>
  )
}
