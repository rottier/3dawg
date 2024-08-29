import { FunctionComponent } from "react";
import { AudioGraphNodes } from "../../core/AudioGraph";
import TrayItem from "./TrayItem";
import { useComposer } from "../Composer";

interface TrayProps {
}

const Tray: FunctionComponent<TrayProps> = () => {
    const composer = useComposer();

    return (
    <ul className="menu w-full h-full bg-black bg-opacity-50">
        <li>
            <details open>
                <summary>Nodes</summary>
                <ul>
                    {Object.values(AudioGraphNodes).map((node, index) => (node !== AudioGraphNodes.Invalid && node !== AudioGraphNodes.Graph && <TrayItem key={index} node={node} />
                    ))}
                </ul>
            </details>
            <details open>
                <summary>Graphs</summary>
                <ul>
                {composer.graphs.map((node, index) => <TrayItem key={index} node={AudioGraphNodes.Graph} id={node.id} label={node.label} />)}
                </ul>
            </details>
            <details open>
                <summary>Composition</summary>
                <ul>
                    <li>
                        <a>Composition 1</a>
                    </li>
                </ul>
            </details>
        </li>
    </ul>
)};


export default Tray;