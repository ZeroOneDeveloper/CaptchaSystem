import React from "react";

const App: React.FC = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [positionHistory, setPositionHistory] = React.useState<
    { x: number; y: number; date: Date }[]
  >([]);

  const calculateSpeed = (
    p1: { x: number; y: number; date: Date },
    p2: { x: number; y: number; date: Date },
  ) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dt = (p2.date.getTime() - p1.date.getTime()) / 1000.0; // milliseconds to seconds
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance / dt; // pixels per second
  };

  const calculateAverage = (arr: number[]) => {
    const sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
  };

  const calculateVariance = (arr: number[], average: number) => {
    const sum = arr.reduce((a, b) => a + Math.pow(b - average, 2), 0);
    return sum / arr.length;
  };

  const calculateStandardDeviation = (arr: number[], average: number) => {
    const variance = calculateVariance(arr, average);
    return Math.sqrt(variance);
  };

  const speeds = positionHistory
    .slice(1)
    .map((pos, i) => calculateSpeed(positionHistory[i], pos));
  const averageSpeed = calculateAverage(speeds);
  const standardDeviationSpeed = calculateStandardDeviation(
    speeds,
    averageSpeed,
  );

  return (
    <div
      onMouseMove={(e) => {
        setPositionHistory((prev) => [
          ...prev,
          { x: e.clientX, y: e.clientY, date: new Date() },
        ]);
      }}
      className="min-h-screen p-4"
    >
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            setPosition({ x: e.clientX, y: e.clientY });
          }}
          className="px-4 py-2 rounded-lg bg-red-400 text-white"
        >
          클릭
        </button>
        <button
          onClick={(e) => {
            setPositionHistory([]);
          }}
          className="px-4 py-2 rounded-lg bg-blue-400 text-white"
        >
          새로고침
        </button>
      </div>
      <h2>
        클릭 포지션 : ({position.x}, {position.y})
      </h2>
      <h2>평균 속도 : {averageSpeed.toFixed(2)} px/s</h2>
      <h2>표준편차 : {standardDeviationSpeed.toFixed(2)} px/s</h2>
    </div>
  );
};

export default App;
