import type { ContentChangeEvent, KeyBinding, TextareaRenderable } from "@opentui/core"
import { StatusBar } from "./status-bar"
import { useCallback, useEffect, useRef } from "react"
import { useRenderer } from "@opentui/react"
import { useCommandMenu } from "./command-menu/use-command-menu"
import type { Command } from "./command-menu/types"
import { CommandMenu } from "./command-menu"

type InputBarProps = {
  onSubmit: (text: string) => void
  disabled?: boolean
}

export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" }
]

export const InputBar = ({ onSubmit, disabled = false }: InputBarProps) => {
  const textareaRef = useRef<TextareaRenderable>(null)
  const renderer = useRenderer()

  const {
    showCommandMenu,
    commandQuery,
    handleContentChange,
    resolveCommand,
    scrollRef,
    selectedIndex,
    setSelectedIndex
  } = useCommandMenu()

  const handleCommand = useCallback((command: Command | undefined) => {
    const textarea = textareaRef.current
    if (!textarea || !command) return

    if (command.action) {
      try {
        command.action({
          exit: () => renderer.destroy()
        })
        textarea.setText("")
      } catch (error) {
        // If command fails, preserve user input
        throw error
      }
    } else {
      textarea.setText("")
      textarea.insertText(command.value + "")
    }
  }, [renderer])

  const handleCommandExecute = useCallback((index: number) => {
    const command = resolveCommand(index)
    handleCommand(command)
  }, [resolveCommand, handleCommand])

  const handleTextareaContentChange = useCallback((_event: ContentChangeEvent) => {
    const textarea = textareaRef.current
    if (!textarea) return
    handleContentChange(textarea.plainText)
  }, [handleContentChange])

  const handleSubmitText = useCallback(() => {
    if (disabled) return

    const textarea = textareaRef.current
    if (!textarea) return

    const text = textarea.plainText.trim()
    if (text.length === 0) return

    onSubmit(text)
    textarea.setText("")
  }, [disabled, onSubmit])

  const submitHandler = useCallback(() => {
    if (disabled) return

    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex)
      handleCommand(command)
      return
    }

    handleSubmitText()
  }, [disabled, showCommandMenu, selectedIndex, resolveCommand, handleCommand, handleSubmitText])

  useEffect(() => {
      const textarea = textareaRef.current
      if (!textarea) return

      textarea.onSubmit = submitHandler

      return () => {
        textarea.onSubmit = undefined
      }
    }, [submitHandler])

  return (
      <box width="100%">
        <box
          border={["left"]}
          borderColor={"cyan"}
          width="100%"
          flexDirection="column"
          backgroundColor="#1A1A24"
        >
          {showCommandMenu && (
            <box width="100%" paddingX={2} paddingTop={1}>
              <CommandMenu
                query={commandQuery}
                scrollRef={scrollRef}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                onExecute={handleCommandExecute}
              />
            </box>
          )}

          <box width="100%" paddingX={2} paddingY={1} gap={1}>
            <textarea
              ref={textareaRef}
              focused={!disabled}
              keyBindings={TEXTAREA_KEY_BINDINGS}
              onContentChange={handleTextareaContentChange}
              placeholder={'Ask anything... "Fix a bug in the database"'}
            />
            <StatusBar />
          </box>
        </box>
      </box>
    )
}
