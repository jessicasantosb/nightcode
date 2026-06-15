import type { Command } from "./types"

type CommandListItemProps = {
  command: Command
  isSelected: boolean
  index: number
  columnWidth: number
  onSelect: (index: number) => void
  onExecute: (index: number) => void
}

export const CommandListItem = ({ command, isSelected, index, columnWidth, onSelect, onExecute }: CommandListItemProps) => {
  return (
    <box
      flexDirection="row"
      paddingX={1}
      height={1}
      overflow="hidden"
      backgroundColor={isSelected ? "#89B4FA" : undefined}
      onMouseMove={() => onSelect(index)}
      onMouseDown={() => onExecute(index)}
    >
      <box width={columnWidth} flexShrink={0}>
        <text selectable={false} fg={isSelected ? "black" : "white"}>
          /{command.name}
        </text>
      </box>

      <box flexGrow={1} overflow="hidden">
        <text selectable={false} fg={isSelected ? "black" : "gray"}>
          {command.description}
        </text>
      </box>
    </box>
  )
}
