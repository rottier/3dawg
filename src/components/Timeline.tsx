import { useEffect, useRef, useState } from "react";
import { Timeline, TimelineModel } from "animation-timeline-js";
type Props = {
  time?: number;
  model: TimelineModel;
};

function TimelineComponent(props: Props) {
  const { model, time } = props;
  const timelineElRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<Timeline>();

  useEffect(() => {
    let newTimeline: Timeline | null = null;
    // On component init
    if (timelineElRef.current) {
      newTimeline = new Timeline({
        id: timelineElRef.current,
        fillColor: "#0D375D",
        headerFillColor: "#00000090",
        timelineStyle: {
          strokeColor: "#FFFFFF4F",
          fillColor: "#E6234E",
          capStyle: {
            fillColor: "#E6234E",
          },
        },
        rowsStyle: {
          fillColor: "#0000004D",
          keyframesStyle: { fillColor: "#E6234E" },
          groupsStyle: {
            fillColor: "#39C7B7",
            strokeColor: "#000000",
          },
        },
      });

      // Here you can subscribe on timeline component events
      setTimeline(newTimeline);
    }

    // cleanup on component unmounted.
    return () => newTimeline?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineElRef.current]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    timeline?.setModel(model);
  }, [model, timeline]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    if (time || time === 0) {
      timeline?.setTime(time);
    }
  }, [time, timeline]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
      ref={timelineElRef}
    />
  );
}
export default TimelineComponent;
