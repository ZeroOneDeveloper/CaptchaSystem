import React from "react";

function Cos_Similarity(
  clicked: {
    x: number;
    y: number;
    velocity: number;
    standardDeviation: number;
  },
  standard: {
    x: number;
    y: number;
    velocity: number;
    standardDeviation: number;
  },
) {
  const numerator =
    clicked.x * standard.x +
    clicked.y * standard.y +
    clicked.velocity * standard.velocity +
    clicked.standardDeviation * standard.standardDeviation;

  const denominator =
    Math.sqrt(
      clicked.x ** 2 +
        clicked.y ** 2 +
        clicked.velocity ** 2 +
        clicked.standardDeviation ** 2,
    ) *
    Math.sqrt(
      standard.x ** 2 +
        standard.y ** 2 +
        standard.velocity ** 2 +
        standard.standardDeviation ** 2,
    );

  return numerator / denominator;
}

function Euclidean_Distance(
  clicked: {
    x: number;
    y: number;
    velocity: number;
    standardDeviation: number;
  },
  standard: {
    x: number;
    y: number;
    velocity: number;
    standardDeviation: number;
  },
) {
  return Math.sqrt(
    (clicked.x - standard.x) ** 2 +
      (clicked.y - standard.y) ** 2 +
      (clicked.velocity - standard.velocity) ** 2 +
      (clicked.standardDeviation - standard.standardDeviation) ** 2,
  );
}

const Page = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [positionHistory, setPositionHistory] = React.useState<
    { x: number; y: number; date: Date }[]
  >([]);
  const [buttonRectanglePosition, setButtonRectanglePosition] = React.useState<
    { x: number; y: number }[]
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

  const [standardPos, setStandardPos] = React.useState([56.25, 42]);
  const [standardVelocity, setStandardVelocity] = React.useState(1530.0825);
  const [standardDeviation, setStandardDeviation] = React.useState(1254.995);

  const [cosSimilarity, setCosSimilarity] = React.useState(0);
  const [euclideanDistance, setEuclideanDistance] = React.useState(0);

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
          id="clickButton"
          onClick={(e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            const rect = e.currentTarget.getBoundingClientRect();
            setButtonRectanglePosition([
              { x: rect.left, y: rect.top },
              { x: rect.right, y: rect.bottom },
            ]);
            setCosSimilarity(
              Cos_Similarity(
                {
                  x: e.clientX,
                  y: e.clientY,
                  velocity: averageSpeed,
                  standardDeviation: standardDeviationSpeed,
                },
                {
                  x: standardPos[0],
                  y: standardPos[1],
                  velocity: standardVelocity,
                  standardDeviation: standardDeviation,
                },
              ),
            );
            setEuclideanDistance(
              Euclidean_Distance(
                {
                  x: e.clientX,
                  y: e.clientY,
                  velocity: averageSpeed,
                  standardDeviation: standardDeviationSpeed,
                },
                {
                  x: standardPos[0],
                  y: standardPos[1],
                  velocity: standardVelocity,
                  standardDeviation: standardDeviation,
                },
              ),
            );
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
      {cosSimilarity !== 0 && (
        <h2>코사인 유사도 : {cosSimilarity.toFixed(2)}</h2>
      )}
      {euclideanDistance !== 0 && (
        <h2>유클리디안 거리 : {euclideanDistance.toFixed(2)}</h2>
      )}

      {cosSimilarity !== 0 && (
        <h2>
          코사인 유사도 측정 :{" "}
          {Number(cosSimilarity.toFixed(2)) < 0.9 ? "봇입니다." : "사람입니다."}
        </h2>
      )}
      {euclideanDistance !== 0 && (
        <h2>
          유클리디안 거리 측정 :{" "}
          {Number(euclideanDistance.toFixed(2)) > 1500
            ? "봇입니다."
            : "사람입니다."}
        </h2>
      )}
    </div>
  );
};

export default Page;
