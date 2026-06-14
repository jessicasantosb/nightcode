import type { Command } from "./types"

const COMMAND_REGISTRY: Record<string, Command> = {
  "/new": {
    name: "new",
    description: "Start a new conversation",
    value: "/new"
  },
  "/exit": {
    name: "exit",
    description: "Quit the application",
    value: "/exit",
    action: (ctx) => ctx.exit()
  }
}

export const COMMANDS: Command[] = Object.values(COMMAND_REGISTRY)
