import { FunctionComponent, useEffect, useState } from "react";
import TrayItem from "./TrayItem";
import { AudioGraphNodes } from "../../../core/AudioGraph/types";
import { useComposer } from "../../Composer";
import { PlusIcon } from "@heroicons/react/24/solid";
import { AudioGraph } from "../../../core/AudioGraph/Nodes";
import { TrayItemGraph } from "./TrayItemGraph";

interface TrayProps {}

const Tray: FunctionComponent<TrayProps> = () => {
  const { composer, setActiveGraph } = useComposer();
  const [graphs, setGraphs] = useState<AudioGraph[]>(composer.graphs);

  useEffect(() => {
    const subscription = (graphs: AudioGraph[]) => {
      setGraphs([...graphs]);
    };
    composer.onGraphsChange.subscribe(subscription);

    return () => {
      composer.onGraphsChange.unsubscribe(subscription);
    };
  }, []);

  return (
    <ul className="menu w-full h-full bg-black bg-opacity-50">
      <li>
        <details open>
          <summary>Nodes</summary>
          <ul>
            {Object.values(AudioGraphNodes).map(
              (node, index) =>
                node !== AudioGraphNodes.Invalid &&
                node !== AudioGraphNodes.Graph && (
                  <TrayItem key={index} node={node} />
                )
            )}
          </ul>
        </details>
        <details open>
          <summary>Graphs</summary>
          <ul>
            {graphs.map((graph, index) => (
              <TrayItemGraph
                key={index}
                graph={graph}
                index={index}
              />
            ))}
            <li>
              <a
                className={`opacity-50 hover:opacity-100`}
                onClick={() => {
                  const graph = composer.createNewGraph();
                  let index = 1;
                  let name = "Graph 1";
                  while (composer.graphs.find((g) => g.label === name)) {
                    index++;
                    name = `Graph ${index}`;
                  }

                  graph.label = name;
                  setActiveGraph(graph.id);
                }}
              >
                <PlusIcon className="size-4 text-accent" />
                New
              </a>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  );
};

export default Tray;
