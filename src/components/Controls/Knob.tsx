import React, { useRef, useState, useEffect } from "react";
import usePointerMove from "../../hooks/usePointerMove";

interface KnobProps {
  valueMin: number;
  valueMax: number;
  angleMin: number;
  angleMax: number;
  value: number;
  onValueChange: (newValue: number) => void;
  logarithmic: boolean;
  valueStep: number;
  formatLabel?: (value: number, percentage: number) => string;
  onDoubleClick?: () => void;
}

const Knob: React.FC<KnobProps> = ({
  valueMin,
  valueMax,
  angleMin,
  angleMax,
  value = 0,
  onValueChange,
  logarithmic,
  valueStep,
  formatLabel = (_, percentage) => `${percentage}%`,
  onDoubleClick
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startRotation, setStartRotation] = useState<number>(0);
  const [cumulativeRotation, setCumulativeRotation] = useState<number>(0);
  const [startValue, setStartValue] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [label, setLabel] = useState<string>(formatLabel(value, percentage));

  useEffect(() => {
    setLabel(formatLabel(value, percentage));
  }, [value, percentage, formatLabel]);

  const handleStart = (e: PointerEvent) => {
    if (knobRef.current) {
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const initialRotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setIsDragging(true);
      setStartRotation(initialRotation);
      setStartValue(value);
      setCumulativeRotation(0);
    }
  };

  const handleMove = (e: PointerEvent) => {
    if (isDragging && knobRef.current) {
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const currentRotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      let deltaRotation = currentRotation - startRotation;

      if (deltaRotation > 180) {
        deltaRotation -= 360;
      } else if (deltaRotation < -180) {
        deltaRotation += 360;
      }

      let newCumulativeRotation = cumulativeRotation + deltaRotation;

      const angleRange = angleMax - angleMin;
      let newValue: number;
      const range = valueMax - valueMin;

      if (logarithmic) {
        const logMin = Math.log(valueMin);
        const logMax = Math.log(valueMax);
        const scale = (logMax - logMin) / angleRange;
        const deltaLogValue = newCumulativeRotation * scale;
        const logNewValue = Math.log(startValue) + deltaLogValue;

        newValue = Math.exp(logNewValue);

        newValue = Math.exp(
          Math.round(Math.log(newValue) / Math.log(1 + valueStep / 100)) *
          Math.log(1 + valueStep / 100)
        );
      } else {
        newValue = startValue + (newCumulativeRotation / angleRange) * range;

        newValue = Math.round(newValue / valueStep) * valueStep;
      }

      if (newValue <= valueMin) {
        newValue = valueMin;
        if (deltaRotation < 0) {
          newCumulativeRotation = cumulativeRotation;
        }
      } else if (newValue >= valueMax) {
        newValue = valueMax;
        if (deltaRotation > 0) {
          newCumulativeRotation = cumulativeRotation;
        }
      } else {
        setCumulativeRotation(newCumulativeRotation);
      }

      setStartRotation(currentRotation);

      onValueChange(newValue);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handlePointerDown = usePointerMove({
    onStart: handleStart,
    onMove: handleMove,
    onEnd: handleEnd,
  });

  const getRotation = (): number => {
    const range = valueMax - valueMin;
    const angleRange = angleMax - angleMin;
    let normalizedValue: number;

    if (logarithmic) {
      const logMin = Math.log(valueMin);
      const logMax = Math.log(valueMax);
      normalizedValue = (Math.log(value) - logMin) / (logMax - logMin);
    } else {
      normalizedValue = (value - valueMin) / range;
    }

    return angleMin + normalizedValue * angleRange;
  };

  useEffect(() => {
    const range = valueMax - valueMin;
    let percentage: number;

    if (logarithmic) {
      const logMin = Math.log(valueMin);
      const logMax = Math.log(valueMax);
      const logValue = Math.log(value);
      percentage = Math.round(((logValue - logMin) / (logMax - logMin)) * 100);
    } else {
      percentage = Math.round(((value - valueMin) / range) * 100);
    }

    setPercentage(percentage || 0);
  }, [value, valueMin, valueMax, logarithmic]);

  return (
    <div onDoubleClick={onDoubleClick}>
      <div
        className="absolute rounded-full w-24 h-24 pointer-events-none opacity-10"
        style={{
          background: `linear-gradient(to top, white 0%, white ${percentage}%, transparent ${percentage}%, transparent 100%)`,
        }}
      />
      <div className="absolute w-24 h-24 flex items-center justify-center pointer-events-none overflow-hidden">
        <label className="absolute text-white/80 font-mono z-[1]">
          {label}
        </label>
      </div>
      <div
        className="absolute w-24 h-24 pointer-events-none z-[2]"
        style={{
          transform: `rotate(${angleMin}deg)`,
        }}
      >
        <div className="w-1 h-1 rounded-full bg-white/40 mx-auto -my-2" />
      </div>
      <div
        className="absolute w-24 h-24 pointer-events-none z-[2]"
        style={{
          transform: `rotate(${angleMax}deg)`,
        }}
      >
        <div className="w-1 h-1 rounded-full bg-white/40 mx-auto -my-2" />
      </div>
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        className="w-24 h-24 rounded-full transparent cursor-pointer border-4 border-white/80"
        style={{
          transform: `rotate(${getRotation()}deg)`,
        }}
      >
        <div className="w-2 h-2 rounded-full bg-white/80 mx-auto my-1" />
      </div>
    </div>
  );
};

export default Knob;
