import { TextAttributes } from "@opentui/core"
import pkg from "../../../../package.json"

export const StatusBar = () => {
  return(
    <box flexDirection="row" gap={1}>
      <text fg="cyan">Build</text>
      <text attributes={TextAttributes.DIM} fg='gray'>&#8250;</text>
      <text>{pkg.version}</text>
    </box>
  )
}
