import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";

function App() {
  // TODO: Implement submission handler that processes user input
  // This should handle the text submitted by the user and execute appropriate actions
  const handleSubmit = (text: string) => {
    console.log("User submitted:", text)
  }

  return (
    <box alignItems="center" justifyContent="center" width={"100%"} height={"100%"} backgroundColor={"#0D0D12"} gap={2}>
      <Header />
      <box width="100%" maxWidth={78} paddingX={2}>
        <InputBar onSubmit={(text) => {
          // TODO: implement submission handler
          console.log('Submitted:', text)
        }} />
      </box>
    </box>
  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: true
});
createRoot(renderer).render(<App />);
