import { motion } from 'framer-motion';
import './css/SpinningCircle.css';
import { useEffect, useRef, useState } from 'react';


function Canvas() {
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const circleRef = useRef<HTMLDivElement | null>(null);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').reverse();
    const radius=250

    const handleDragStart = () => {        
        setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

    useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {  
      if (isDragging && circleRef.current) {
        const position = circleRef.current.getBoundingClientRect();
        const x = event.clientX - (position.x + position.width / 2); // Horizontal difference from center
        const y = (position.y + position.height / 2) - event.clientY; // Vertical difference from center
        const degrees = Math.atan2(x, y) * (180 / Math.PI); // Calculate the angle in degrees
        setRotation(degrees + rotation); // Set rotation based on mouse position
        
      }
    };

    // Listen to mouse move events on the document
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  return (
    <>
      <div>HELLO!</div>
      <motion.div
        ref={circleRef}
        className="circle-container"
        whileHover={{
          scale: 1.2,
          transition: { duration: 0.1 },
        }}
        drag="x"
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0} /* Fixes it in place */
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd} 
        style={{
          rotate: rotation,
          cursor: 'grab',
        }}
      > 
        <svg width="600" height="600" viewBox="0 0 600 600">
          {alphabet.map((letter, index) => {
            const angle = ((index + 1) * 360) / alphabet.length; // Calculate the angle for each letter
            const norm_angle = ((angle + 180) % 360) - 180;
            const deg_angle = norm_angle * Math.PI / 180;
            const x = radius * Math.cos(deg_angle); // X position based on angle
            const y = radius * Math.sin(deg_angle); // Y position based on angle
            console.log("x:", x, "y:", y)
            return (
              <text
                key={index}
                x={x}
                y={y}
                fontSize="12"
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center' }}
              >
                {letter}
              </text>
            );
          })}
        </svg>
      </motion.div>
    </>
  );
}

export default Canvas