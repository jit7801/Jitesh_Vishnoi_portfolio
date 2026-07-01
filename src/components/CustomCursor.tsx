import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useApp } from '../context/AppContext';

export const CustomCursor: React.FC = () => {
  const { cursorType } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  // Mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Bind ring and dot directly to raw mouse positions to remove latency/delay
  const ringX = mouseX;
  const ringY = mouseY;
  const dotX = mouseX;
  const dotY = mouseY;

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveMouse);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  // Determine size and color based on cursorType
  const getRingVariants = () => {
    switch (cursorType) {
      case 'hover':
        return {
          width: 48,
          height: 48,
          borderColor: 'rgba(0, 245, 255, 0.8)',
          backgroundColor: 'rgba(0, 245, 255, 0.05)',
          borderWidth: '1.5px',
        };
      case 'click':
        return {
          width: 24,
          height: 24,
          borderColor: 'rgba(139, 92, 246, 1)',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderWidth: '2px',
        };
      case 'magnetic':
        return {
          width: 56,
          height: 56,
          borderColor: 'rgba(0, 85, 255, 0.8)',
          backgroundColor: 'rgba(0, 85, 255, 0.1)',
          borderWidth: '1px',
        };
      default:
        return {
          width: 32,
          height: 32,
          borderColor: 'rgba(0, 85, 255, 0.5)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderWidth: '1px',
        };
    }
  };

  const getDotVariants = () => {
    switch (cursorType) {
      case 'hover':
        return {
          scale: 1.5,
          backgroundColor: 'rgba(0, 245, 255, 1)',
        };
      case 'click':
        return {
          scale: 0.5,
          backgroundColor: 'rgba(139, 92, 246, 1)',
        };
      case 'magnetic':
        return {
          scale: 2,
          backgroundColor: 'rgba(0, 85, 255, 1)',
        };
      default:
        return {
          scale: 1,
          backgroundColor: 'rgba(0, 85, 255, 1)',
        };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-9999 hidden md:block">
      {/* Outer Ring */}
      <motion.div
        className="absolute rounded-full border -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={getRingVariants()}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      {/* Inner Dot */}
      <motion.div
        className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={getDotVariants()}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </div>
  );
};
