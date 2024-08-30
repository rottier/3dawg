import "./App.css";
import TimelineComponent from "./components/Timeline";
import { Editor } from "./components/Editor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ComposerProvider } from "./components/Composer";

function App() {

  return (
    <main className="w-dvw h-dvh justify-between">
      <div className="fixed w-full h-full bg-secondary pointer-events-none -z-10" />
      <ComposerProvider>
            <PanelGroup direction="vertical">
              <Panel defaultSize={66} maxSize={75}>
                <Editor />
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={33} maxSize={75} hidden={true}>
                <TimelineComponent
                  time={0}
                  model={{
                    rows: [
                      {
                        keyframes: [
                          {
                            val: 40,
                            group: "A"
                          },
                          {
                            val: 2800,
                            group: "A"
                          },
                          {
                            val: 3000,
                            group: "A"
                          },
                          {
                            val: 3200,
                            group: "B"
                          },
                          {
                            val: 4100,
                            group: "B"
                          },
                        ],
                      },
                      {
                        keyframes: [
                          {
                            val: 140,
                          },
                          {
                            val: 4000,
                          },
                          {
                            val: 4200,
                          },
                        ],
                      },
                    ],
                  }}
                />
              </Panel>
            </PanelGroup>
      </ComposerProvider>
    </main>
  );
}

export default App;