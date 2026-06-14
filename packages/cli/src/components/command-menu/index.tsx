import type { RefObject } from "react"
import { COMMANDS } from "./commands"
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core"
import { getFilteredCommands } from "./filter-commands"
import { CommandListItem } from "./command-list-item"

const MAX_VISIBLE_ITEMS = 8
const COMMAND_COL_WIDTH = Math.max(...COMMANDS.map((cmd) => cmd.name.length)) + 4

type CommandMenuProps = {
  query: string
  selectedIndex: number
  scrollRef: RefObject<ScrollBoxRenderable | null>
  onSelect: (index: number) => void
  onExecute: (index: number) => void
}

export const CommandMenu = (
{onExecute,onSelect,query,scrollRef,selectedIndex}: CommandMenuProps
) => {
  const filtered = getFilteredCommands(query)
  const visibleHeight = Math.min(filtered.length, MAX_VISIBLE_ITEMS)
  const maxCommandLength = Math.max(...filtered.map(cmd => cmd.name.length))
  const calculatedColumnWidth = maxCommandLength + 3

  if (filtered.length === 0) {
    return (
      <box paddingX={1}>
        <text attributes={TextAttributes.DIM}>No matching commands</text>
      </box>
    )
  }

  return (
      <scrollbox ref={scrollRef} height={visibleHeight}>
        {filtered.map((cmd, i) => (
          <CommandListItem
            key={cmd.value}
            command={cmd}
            isSelected={i === selectedIndex}
            index={i}
            columnWidth={calculatedColumnWidth}
            onSelect={onSelect}
            onExecute={onExecute}
          />
        ))}
      </scrollbox>
    )
}
