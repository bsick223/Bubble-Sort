import styled from "styled-components";

interface Point {
  x: number;
  y: number;
}

interface ConnectingLinesProps {
  connections: Array<{
    from: Point;
    to: Point;
  }>;
}

const SVGContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const ConnectingLines: React.FC<ConnectingLinesProps> = ({ connections }) => {
  return (
    <SVGContainer>
      {connections.map((connection, i) => (
        <line
          key={i}
          x1={connection.from.x}
          y1={connection.from.y}
          x2={connection.to.x}
          y2={connection.to.y}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
      ))}
    </SVGContainer>
  );
};

export default ConnectingLines;
