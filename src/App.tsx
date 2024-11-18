import { useEffect, useState } from 'react';
import Disk from './Disk'

function App() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
	<div style={{marginTop: 0}}>    
		<Disk radius={screenWidth} />
	</div>
  );
};

export default App
