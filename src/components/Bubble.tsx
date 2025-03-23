import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { useState, useEffect } from "react";

interface BubbleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  title: string;
  type: "center" | "main" | "sub";
  onClick: () => void;
  onMove: (id: number, x: number, y: number) => void;
}

const getBubbleStyles = (type: "center" | "main" | "sub") => {
  switch (type) {
    case "center":
      return `
        background: radial-gradient(
          circle at 30% 30%,
          rgba(255, 165, 0, 0.3) 0%,
          rgba(255, 165, 0, 0.2) 40%,
          rgba(255, 165, 0, 0.1) 100%
        );
        border: 1px solid rgba(255, 165, 0, 0.3);
        box-shadow: inset 0 0 20px rgba(255, 165, 0, 0.2),
          0 0 15px rgba(255, 165, 0, 0.1);
      `;
    case "main":
      return `
        background: radial-gradient(
          circle at 30% 30%,
          rgba(144, 238, 144, 0.2) 0%,
          rgba(144, 238, 144, 0.1) 40%,
          rgba(144, 238, 144, 0.05) 100%
        );
        border: 1px solid rgba(144, 238, 144, 0.2);
        box-shadow: inset 0 0 20px rgba(144, 238, 144, 0.2),
          0 0 15px rgba(144, 238, 144, 0.1);
      `;
    case "sub":
      return `
        background: radial-gradient(
          circle at 30% 30%,
          rgba(135, 206, 235, 0.2) 0%,
          rgba(135, 206, 235, 0.1) 40%,
          rgba(135, 206, 235, 0.05) 100%
        );
        border: 1px solid rgba(135, 206, 235, 0.2);
        box-shadow: inset 0 0 20px rgba(135, 206, 235, 0.2),
          0 0 15px rgba(135, 206, 235, 0.1);
      `;
  }
};

const BubbleWrapper = styled(animated.div)<{
  $type: "center" | "main" | "sub";
}>`
  position: absolute;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  backdrop-filter: blur(4px);
  z-index: 1;
  text-align: center;
  padding: 10px;
  font-size: ${(props) => (props.$type === "sub" ? "12px" : "16px")};
  ${(props) => getBubbleStyles(props.$type)}
`;

const Bubble: React.FC<BubbleProps> = ({
  id,
  x,
  y,
  size,
  title,
  type,
  onClick,
  onMove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [{ xy }, api] = useSpring(() => ({
    xy: [x, y],
    config: { tension: 120, friction: 14 },
    onChange: ({ value }) => {
      onMove(id, value.xy[0], value.xy[1]);
    },
  }));

  useEffect(() => {
    if (!isDragging) {
      api.start({
        xy: [x, y],
        onChange: ({ value }) => {
          onMove(id, value.xy[0], value.xy[1]);
        },
      });
    }
  }, [x, y, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - size / 2;
      const newY = e.clientY - size / 2;
      api.start({
        xy: [newX, newY],
        onChange: ({ value }) => {
          onMove(id, value.xy[0], value.xy[1]);
        },
      });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <BubbleWrapper
      $type={type}
      style={{
        width: size,
        height: size,
        transform: xy.to((x, y) => `translate3d(${x}px,${y}px,0)`),
      }}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      {title}
    </BubbleWrapper>
  );
};

export default Bubble;
