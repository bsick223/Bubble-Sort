import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  content?: React.ReactNode;
}

const SidebarWrapper = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: rgba(30, 30, 35, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  color: white;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, content }) => {
  const animation = useSpring({
    transform: isOpen ? "translateX(0%)" : "translateX(100%)",
    config: { tension: 300, friction: 30 },
  });

  return (
    <SidebarWrapper style={animation}>
      <CloseButton onClick={onClose}>×</CloseButton>
      {content}
    </SidebarWrapper>
  );
};

export default Sidebar;
