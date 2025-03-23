import { useState, useEffect } from "react";
import styled from "styled-components";
import Bubble from "./components/Bubble";
import Sidebar from "./components/Sidebar";
import ConnectingLines from "./components/ConnectingLines";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1a1a1f;
  overflow: hidden;
  position: relative;
`;

interface Point {
  x: number;
  y: number;
}

interface BubbleDataType {
  id: number;
  title: string;
  x: number;
  y: number;
  size: number;
  type: "center" | "main" | "sub";
  connections?: number[];
}

const createBubbleData = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const mainRadius = Math.min(windowWidth, windowHeight) * 0.25;
  const subRadius = 60;

  // Calculate main bubble positions
  const mainPositions = [
    { x: centerX, y: centerY - mainRadius }, // Top
    { x: centerX + mainRadius, y: centerY }, // Right
    { x: centerX, y: centerY + mainRadius }, // Bottom
    { x: centerX - mainRadius, y: centerY }, // Left
  ];

  const bubbles: BubbleDataType[] = [
    // Center bubble
    {
      id: 1,
      title: "Elevator Star",
      x: centerX - 75,
      y: centerY - 75,
      size: 150,
      type: "center",
      connections: [2, 3, 4, 5],
    },
    // Main bubbles
    {
      id: 2,
      title: "Colorways",
      x: mainPositions[0].x - 100,
      y: mainPositions[0].y - 100,
      size: 200,
      type: "main",
      connections: [6, 7, 8],
    },
    {
      id: 3,
      title: "Sales Flow",
      x: mainPositions[1].x - 100,
      y: mainPositions[1].y - 100,
      size: 200,
      type: "main",
      connections: [9, 10],
    },
    {
      id: 4,
      title: "Tea Lounge",
      x: mainPositions[2].x - 100,
      y: mainPositions[2].y - 100,
      size: 200,
      type: "main",
      connections: [11, 12],
    },
    {
      id: 5,
      title: "Sitting & Dining",
      x: mainPositions[3].x - 100,
      y: mainPositions[3].y - 100,
      size: 200,
      type: "main",
      connections: [13, 14, 15],
    },
    // Sub bubbles for Colorways
    {
      id: 6,
      title: "Light",
      x: mainPositions[0].x - 150,
      y: mainPositions[0].y - 180,
      size: 80,
      type: "sub",
    },
    {
      id: 7,
      title: "Dark",
      x: mainPositions[0].x - 50,
      y: mainPositions[0].y - 200,
      size: 80,
      type: "sub",
    },
    {
      id: 8,
      title: "Natural",
      x: mainPositions[0].x + 50,
      y: mainPositions[0].y - 180,
      size: 80,
      type: "sub",
    },
    // Sub bubbles for Sales Flow
    {
      id: 9,
      title: "Entry",
      x: mainPositions[1].x + 120,
      y: mainPositions[1].y - 80,
      size: 80,
      type: "sub",
    },
    {
      id: 10,
      title: "Process",
      x: mainPositions[1].x + 120,
      y: mainPositions[1].y + 80,
      size: 80,
      type: "sub",
    },
    // Sub bubbles for Tea Lounge
    {
      id: 11,
      title: "Tea",
      x: mainPositions[2].x - 50,
      y: mainPositions[2].y + 150,
      size: 80,
      type: "sub",
    },
    {
      id: 12,
      title: "Service",
      x: mainPositions[2].x + 50,
      y: mainPositions[2].y + 150,
      size: 80,
      type: "sub",
    },
    // Sub bubbles for Sitting & Dining
    {
      id: 13,
      title: "Layout",
      x: mainPositions[3].x - 180,
      y: mainPositions[3].y - 80,
      size: 80,
      type: "sub",
    },
    {
      id: 14,
      title: "Service",
      x: mainPositions[3].x - 180,
      y: mainPositions[3].y,
      size: 80,
      type: "sub",
    },
    {
      id: 15,
      title: "Back",
      x: mainPositions[3].x - 180,
      y: mainPositions[3].y + 80,
      size: 80,
      type: "sub",
    },
  ];

  return bubbles;
};

const calculateEdgePoint = (from: Point, to: Point, radius: number): Point => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return from;

  const ratio = radius / distance;
  return {
    x: from.x + dx * ratio,
    y: from.y + dy * ratio,
  };
};

function App() {
  const [selectedBubble, setSelectedBubble] = useState<number | null>(null);
  const [bubbleData, setBubbleData] = useState<BubbleDataType[]>(
    createBubbleData()
  );
  const [currentPositions, setCurrentPositions] = useState<
    Record<number, Point>
  >({});

  useEffect(() => {
    const handleResize = () => {
      setBubbleData(createBubbleData());
      setCurrentPositions({});
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBubbleClick = (id: number) => {
    setSelectedBubble(id);
  };

  const handleSidebarClose = () => {
    setSelectedBubble(null);
  };

  const handleBubbleMove = (id: number, x: number, y: number) => {
    setCurrentPositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }));
  };

  const getSelectedBubbleContent = () => {
    const bubble = bubbleData.find((b) => b.id === selectedBubble);
    if (!bubble) return null;

    return (
      <div>
        <h2>{bubble.title}</h2>
        <p>This is where your database content will go for {bubble.title}.</p>
      </div>
    );
  };

  const getBubblePosition = (bubble: BubbleDataType): Point => {
    const currentPos = currentPositions[bubble.id];
    if (currentPos) {
      return currentPos;
    }
    return { x: bubble.x, y: bubble.y };
  };

  const getConnections = () => {
    const connections: Array<{ from: Point; to: Point }> = [];
    bubbleData.forEach((bubble) => {
      if (bubble.connections) {
        const fromCenter = {
          x: getBubblePosition(bubble).x + bubble.size / 2,
          y: getBubblePosition(bubble).y + bubble.size / 2,
        };

        bubble.connections.forEach((targetId) => {
          const target = bubbleData.find((b) => b.id === targetId);
          if (target) {
            const toCenter = {
              x: getBubblePosition(target).x + target.size / 2,
              y: getBubblePosition(target).y + target.size / 2,
            };

            // Calculate points on the edges of the bubbles
            const fromPoint = calculateEdgePoint(
              fromCenter,
              toCenter,
              bubble.size / 2
            );
            const toPoint = calculateEdgePoint(
              toCenter,
              fromCenter,
              target.size / 2
            );

            connections.push({
              from: fromPoint,
              to: toPoint,
            });
          }
        });
      }
    });
    return connections;
  };

  return (
    <AppContainer>
      <ConnectingLines connections={getConnections()} />
      {bubbleData.map((bubble) => (
        <Bubble
          key={bubble.id}
          id={bubble.id}
          x={bubble.x}
          y={bubble.y}
          size={bubble.size}
          title={bubble.title}
          type={bubble.type}
          onClick={() => handleBubbleClick(bubble.id)}
          onMove={handleBubbleMove}
        />
      ))}
      <Sidebar
        isOpen={selectedBubble !== null}
        onClose={handleSidebarClose}
        content={getSelectedBubbleContent()}
      />
    </AppContainer>
  );
}

export default App;
