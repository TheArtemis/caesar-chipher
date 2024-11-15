import { motion} from "framer-motion";
import React, { useRef, useState } from "react";
import "./css/SpinningCircle.css"
import NumberCircle from "./NumberCircle";

interface DiskProps {
    radius: number;
}

const Disk: React.FC<DiskProps> = ({radius = 500}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [angle, setAngle] = useState(0);
    const [previousAngle, setPreviousAngle] = useState(0);
    const [initialAngle, setInitialAngle] = useState(0);
    const [rotating, setRotating] = useState(false);
    const [plainText, setPlainText] = useState("")
    const [copied, setCopied] = useState(false)

    /* Angle Logic */

    function normalizeAngle(angle: number): number {
        return ((angle % 360) + 360) % 360;
    }

    function calculateAngle(x: number, y: number): number {
        return normalizeAngle(Math.atan2(x, y) * (180 / Math.PI))
    }

    function handleRotationStart(e: PointerEvent) {
        setRotating(true)
        
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        
        const x = e.clientX - centerX;
        const y = centerY - e.clientY;
        
        const newInitialAngle = calculateAngle(x, y);
        setInitialAngle(newInitialAngle - previousAngle);
    }

    function handleRotation(e: PointerEvent) {
        if (!rotating || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        
        const x = e.clientX - centerX;
        const y = centerY - e.clientY;
        
        const currentAngle = calculateAngle(x, y);
        const newAngle = normalizeAngle(currentAngle - initialAngle);
    
        setAngle(newAngle);
    }

    function handleRotationStop() {
        console.log("Rotation Stopped")
        setPreviousAngle(angle)
        setRotating(false)
    }


    /* Text Logic */
    function mapToIndex(angle:number) {
        angle = ((angle % 360) + 360) % 360;

        return Math.floor((angle / 360) * 26);
    }
    
    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPlainText(event.target.value);
    };

    const shiftLetter = (char: string, k: number) => {
        // Check if the character is a letter
        if (/[a-zA-Z]/.test(char)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97; // ASCII for 'A' or 'a'

            // Compute shifted character
            const shiftedChar = String.fromCharCode(
                ((char.charCodeAt(0) - base + k) % 26 + 26) % 26 + base
            );
            return shiftedChar;
        }
        return char;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(plainText.split("").map((c) => shiftLetter(c, mapToIndex(angle))).join(""));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <div>
            <div className="shift-header"><h3>Current shift: {mapToIndex(angle)}</h3></div>
            <div className="text-container">
                <textarea
                value={plainText}
                onChange={handleChange}
                placeholder="Type here..."
            />
            <div className="chipher-container">
                <div className="chiphered-text">{plainText.split("").map((c) => shiftLetter(c, mapToIndex(angle))).join("")}</div>
            </div> 
            </div>
            <div className="button-container">
                <motion.button
                    onClick={handleCopy}
                    style={{
                        padding: "1rem 2rem",
                        fontSize: "16px",
                        fontWeight: "bold",
                        backgroundColor: copied ? "#28a745" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        position: "absolute",
                    }}
                >
                    {copied ? "Copied!" : "Copy"}
                </motion.button> 
            </div>                                              
            <div
                className="disk-container" 
                style={{ width: `${radius}px`, height: `${radius}px` }}    
            >
                {/* <h2 style={{color: "white"}}>Initial Angle: {initialAngle.toFixed(2)}</h2>
                <h2 style={{color: "white"}}>Previous Angle: {previousAngle.toFixed(2)}</h2>
                <h2 style={{color: "white"}}>Cursor Angle: {normalizeAngle(angle + initialAngle).toFixed(2)}</h2>
                <h2 style={{color: "white"}}>Current Angle: {angle.toFixed(2)}</h2> */}
                <motion.div
                    ref={ref}
                    style={{
                        width: `${radius}px`,
                        height: `${radius}px`,
                        transform: `rotate(${angle}deg)`,
                        touchAction: "none",
                    }}
                    className="circle"
                    onPanStart={(e) => {handleRotationStart(e)}}
                    onPan={(e) => {handleRotation(e)}}
                    onPanEnd={handleRotationStop}
                    >                  
                    <NumberCircle radius={radius} fontSize={36}/>
                </motion.div>
                <div
                    className="inner-circle-container"
                    style={{
                        width: `${radius*0.6}px`,
                        height: `${radius*0.6}px`,
                        zIndex: 2,
                    }}
                >
                    <NumberCircle radius={radius*0.6} fontSize={24}/>
                </div>            
            </div>
        </div>
    )
}

export default Disk;