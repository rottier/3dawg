import logo from "/3dawg.svg";
import "./App.css";
import TimelineComponent from "./components/Timeline";

function App() {
  
  return (
    <main className="w-dvw h-dvh justify-between">
      <div className="fixed w-full h-full bg-gradient-to-r from-[#39C7B7] from-[calc(50%-1px)] to-[#E6234E] to-[50%] pointer-events-none -z-10"></div>

        <div className={"absolute bottom-0 w-full h-1/4"}>
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
        </div>
    </main>
  );
}

export default App;