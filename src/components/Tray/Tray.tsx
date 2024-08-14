import { FunctionComponent } from "react";
import { AudioGraphNodes } from "../../core/AudioGraph";
import TrayItem from "./TrayItem";

interface TrayProps {

}

const Tray: FunctionComponent<TrayProps> = () => {
    return (
    <ul className="menu w-full h-full bg-black bg-opacity-50">
        <li>
            <details open>
                <summary>Audio Nodes</summary>
                <ul>
                    {Object.values(AudioGraphNodes).map((node, index) => (<TrayItem key={index} node={node} />
                    ))}
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