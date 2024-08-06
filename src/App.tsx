import "./App.css";
import TimelineComponent from "./components/Timeline";
import Editor from "./components/Editor/Editor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Tray from "./components/Tray";

function App() {

  return (
    <main className="w-dvw h-dvh justify-between">
      <div className="fixed w-full h-full bg-blue pointer-events-none -z-10" />
      <PanelGroup direction="horizontal">
        <Panel defaultSize={80} maxSize={80}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={66} maxSize={75}>
              <Editor />
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={33} maxSize={75}>
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
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={20} maxSize={80}>
          <Tray />
        </Panel>
      </PanelGroup>
    </main>
  );
}

export default App;