import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Zap, Coins, Heart, Shield, HelpCircle } from 'lucide-react';
import { Reward } from '../types';
import { cn, getWeightedRandom } from '../lib/utils';

interface LuckyWheelProps {
  rewards: Reward[];
  onComplete: (reward: Reward) => void;
}

export default function LuckyWheel({ rewards, onComplete }: LuckyWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Reward | null>(null);

  // Calculate segments based on weights
  const totalWeight = rewards.reduce((sum, r) => sum + (r.weight || 1), 0);
  let currentAngle = 0;
  const segments = rewards.map(reward => {
    const angle = ((reward.weight || 1) / totalWeight) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...reward, startAngle, angle };
  });

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    const finalReward = getWeightedRandom(rewards);
    const rewardIndex = rewards.findIndex(r => r === finalReward);
    const segment = segments[rewardIndex];
    
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    // Target angle is the middle of the segment
    // We need to subtract from 360 because rotation is clockwise but angles are counter-clockwise from top
    const segmentCenter = segment.startAngle + (segment.angle / 2);
    const targetDegree = 360 - segmentCenter;
    
    const totalRotation = rotation + (extraSpins * 360) + (targetDegree - (rotation % 360));
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(finalReward);
      
      if (finalReward.weight && finalReward.weight < 20) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [finalReward.color, '#FFFFFF']
        });
      }
      
      setTimeout(() => onComplete(finalReward), 2500);
    }, 4000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'coin': return <Coins className="w-5 h-5" />;
      case 'life': return <Heart className="w-5 h-5" />;
      case 'shield': return <Shield className="w-5 h-5" />;
      case 'hint': return <HelpCircle className="w-5 h-5" />;
      case 'x2_score': return <Zap className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  // Helper to create SVG arc path
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-10 bg-[#16161D] rounded-[48px] border border-white/10 shadow-2xl max-w-lg mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
          LUCKY SPIN
        </h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Fortune favors the bold</p>
      </div>

      <div className="relative w-80 h-80">
        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-3xl animate-pulse" />
        
        {/* Pointer */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 drop-shadow-2xl">
          <div className="w-10 h-10 bg-white rotate-45 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-red-600 rotate-0 rounded-md" />
          </div>
        </div>

        {/* Wheel Container */}
        <motion.div 
          className="w-full h-full rounded-full border-[12px] border-[#1F1F29] relative shadow-2xl overflow-hidden"
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-0">
            {segments.map((segment, i) => (
              <g key={i}>
                <path
                  d={describeArc(100, 100, 100, segment.startAngle, segment.startAngle + segment.angle)}
                  fill={segment.color}
                  stroke="#1F1F29"
                  strokeWidth="0.5"
                />
                <g transform={`rotate(${segment.startAngle + segment.angle / 2} 100 100)`}>
                  <foreignObject x="85" y="20" width="30" height="50" className="overflow-visible">
                    <div className="flex flex-col items-center justify-start text-white text-center h-full pt-2">
                      <div className="drop-shadow-lg mb-1">
                        {getIcon(segment.type)}
                      </div>
                      <span className="text-[6px] font-black uppercase leading-none tracking-tighter drop-shadow-md max-w-[40px]">
                        {segment.label}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              </g>
            ))}
          </svg>
        </motion.div>
        
        {/* Center Button */}
        <button 
          onClick={spin}
          disabled={isSpinning}
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#16161D] border-8 border-[#1F1F29] z-20 flex items-center justify-center shadow-2xl transition-all group",
            isSpinning ? "opacity-50 cursor-not-allowed" : "hover:scale-110 active:scale-95"
          )}
        >
          <div className="text-[12px] font-black text-white uppercase tracking-widest group-hover:text-yellow-400 transition-colors">SPIN</div>
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center space-y-1"
          >
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Reward Unlocked</div>
            <div className="text-3xl font-black text-white uppercase tracking-tighter italic">{result.label}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
