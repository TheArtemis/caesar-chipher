import React from "react";
import "./css/SpinningCircle.css"

interface NumberCircleProps {
    radius: number;
    fontSize: number;
}

const NumberCircle: React.FC<NumberCircleProps> = ({radius = 500, fontSize = 12}) => {

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const letterRadius = radius * 0.4;

    return (
        <svg className="no-select" width={radius} height={radius} viewBox={`0 0 ${radius} ${radius}`}>
                    <g transform={`translate(${radius/2}, ${radius/2})`}>
                        {alphabet.map((letter, index) => {
                            const angleInDegrees = (index * (360 / alphabet.length));
                            const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
                            const x = letterRadius * Math.cos(angleInRadians);
                            const y = letterRadius * Math.sin(angleInRadians);
                            
                            return (
                                <text
                                    key={index}
                                    x={x}
                                    y={y}
                                    fontSize={fontSize}
                                    fill="white"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    transform={`rotate(${angleInDegrees} ${x} ${y})`}
                                >
                                    {letter}
                                </text>
                            );
                        })}
                    </g>
        </svg>
    )
}

export default NumberCircle