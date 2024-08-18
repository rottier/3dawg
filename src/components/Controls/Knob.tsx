import React, { useRef, useEffect, useState } from "react";

interface KnobProps {
  valueMin: number;
  valueMax: number;
  angleMin: number;
  angleMax: number;
  value: number;
  onValueChange: (newValue: number) => void;
  logarithmic: boolean;
  valueStep: number;
}

const Knob: React.FC<KnobProps> = ({
  valueMin,
  valueMax,
  angleMin,
  angleMax,
  value,
  onValueChange,
  logarithmic,
  valueStep,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startRotation, setStartRotation] = useState<number>(0);
  const [cumulativeRotation, setCumulativeRotation] = useState<number>(0);
  const [startValue, setStartValue] = useState<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && knobRef.current) {
        const rect = knobRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const currentRotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        let deltaRotation = currentRotation - startRotation;

        // Normalize deltaRotation to be within [-180, 180] degrees
        if (deltaRotation > 180) {
          deltaRotation -= 360;
        } else if (deltaRotation < -180) {
          deltaRotation += 360;
        }

        const newCumulativeRotation = cumulativeRotation + deltaRotation;
        setCumulativeRotation(newCumulativeRotation);
        setStartRotation(currentRotation); // Update the startRotation for the next move event

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

          // Apply step size in logarithmic space
          newValue = Math.exp(
            Math.round(Math.log(newValue) / Math.log(1 + valueStep / 100)) *
              Math.log(1 + valueStep / 100)
          );
        } else {
          newValue = startValue + (newCumulativeRotation / angleRange) * range;

          // Apply linear step size
          newValue = Math.round(newValue / valueStep) * valueStep;
        }

        newValue = Math.max(valueMin, Math.min(valueMax, newValue));
        onValueChange(newValue);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setCumulativeRotation(0);
      setStartRotation(0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
  }, [
    isDragging,
    startRotation,
    cumulativeRotation,
    startValue,
    valueMin,
    valueMax,
    angleMin,
    angleMax,
    onValueChange,
    logarithmic,
    valueStep,
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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
    }
  };

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

  const mapValueToPercentage = (value: number): string => {
    const range = valueMax - valueMin;
    const percentage = Math.round(((value - valueMin) / range) * 100);
    return `${percentage}%`;
  };

  return (
    <div>
      <div className="absolute w-24 h-24 flex items-center justify-center pointer-events-none">
        <label className="absolute text-white/80 font-mono z-[1]">
          {mapValueToPercentage(value)}
        </label>
      </div>

      <div
        ref={knobRef}
        onMouseDown={handleMouseDown}
        className="w-24 h-24 rounded-full bg-secondary transparent cursor-pointer border-[16px] border-white/80"
        style={{
          transform: `rotate(${getRotation()}deg)`,
        }}
      >
        <div className="w-1 h-[20px] bg-secondary mx-auto -my-[18px]" />
      </div>
    </div>
  );
};

export default Knob;
