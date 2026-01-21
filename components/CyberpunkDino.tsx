import React, { useEffect, useRef, useState } from 'react';
import { Trophy, RefreshCw, X } from 'lucide-react';

export const CyberpunkDino: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -10;
  const SPAWN_RATE = 100; // frames
  const GAME_SPEED_START = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frames = 0;
    let gameSpeed = GAME_SPEED_START;
    
    // Player
    let player = {
      x: 50,
      y: 200,
      width: 30,
      height: 30,
      dy: 0,
      grounded: true,
      color: '#06b6d4', // Cyan
      trail: [] as {x: number, y: number}[]
    };

    // Obstacles
    let obstacles: { x: number; y: number; width: number; height: number; type: 'BUG' | 'ERR' }[] = [];
    
    // Stars/Grid
    let bgOffset = 0;

    const resetGame = () => {
      player.y = canvas.height - 50;
      player.dy = 0;
      player.trail = [];
      obstacles = [];
      frames = 0;
      gameSpeed = GAME_SPEED_START;
      setScore(0);
      setGameState('PLAYING');
    };

    // Draw Player Function
    const drawPlayer = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      // Cyber-Bot Shape (Pixel style)
      // Body
      ctx.fillRect(x + 5, y + 10, w - 10, h - 15); 
      // Head
      ctx.fillRect(x + 8, y, w - 16, 8);
      // Eye (Visor)
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#fff';
      ctx.fillRect(x + 10, y + 2, w - 12, 4);
      
      // Legs (Simple animation)
      ctx.fillStyle = color;
      ctx.shadowBlur = 0;
      if (player.grounded) {
         if (Math.floor(frames / 10) % 2 === 0) {
            // Run pose 1
            ctx.fillRect(x + 8, y + h - 5, 6, 5); // Left leg
            ctx.fillRect(x + w - 14, y + h - 5, 6, 5); // Right leg
         } else {
            // Run pose 2
            ctx.fillRect(x + 4, y + h - 8, 6, 5); // Left leg back
            ctx.fillRect(x + w - 10, y + h - 8, 6, 5); // Right leg fwd
         }
      } else {
         // Jump pose
         ctx.fillRect(x + 10, y + h - 8, 4, 8); // Jet legs
         ctx.fillRect(x + w - 14, y + h - 8, 4, 8);
         // Jet flame
         ctx.fillStyle = '#db2777'; // Pink flame
         ctx.fillRect(x + 11, y + h, 2, 6);
         ctx.fillRect(x + w - 13, y + h, 2, 6);
      }
    };

    const draw = () => {
      // Clear Canvas
      ctx.fillStyle = '#0f172a'; // Slate 900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      bgOffset -= 2;
      if (bgOffset <= -40) bgOffset = 0;
      
      for (let i = bgOffset; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      // Horizontal floor line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#06b6d4';
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (gameState === 'PLAYING') {
        // Player Logic
        player.dy += GRAVITY;
        player.y += player.dy;

        // Ground Collision
        if (player.y + player.height > canvas.height - 20) {
          player.y = canvas.height - 20 - player.height;
          player.dy = 0;
          player.grounded = true;
        } else {
          player.grounded = false;
        }

        // Draw Player Custom Sprite
        drawPlayer(player.x, player.y, player.width, player.height, player.color);

        // Obstacle Logic
        frames++;
        if (frames % SPAWN_RATE === 0) {
          gameSpeed += 0.1; // Increase difficulty
          const type = Math.random() > 0.5 ? 'BUG' : 'ERR';
          obstacles.push({
            x: canvas.width,
            y: canvas.height - (Math.random() > 0.8 ? 90 : 50),
            width: type === 'BUG' ? 40 : 50,
            height: 30,
            type
          });
        }

        // Move & Draw Obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.x -= gameSpeed;

          // Draw Obstacle
          ctx.fillStyle = '#ec4899'; // Pink
          ctx.font = 'bold 16px monospace';
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#ec4899';
          ctx.fillText(obs.type, obs.x, obs.y + 20);
          ctx.shadowBlur = 0;

          // Remove off-screen
          if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            setScore(s => s + 10);
          }

          // Collision Detection
          // Hitbox slightly smaller than sprite for fairness
          if (
            player.x + 5 < obs.x + obs.width &&
            player.x + player.width - 5 > obs.x &&
            player.y + 5 < obs.y + obs.height &&
            player.y + player.height > obs.y
          ) {
            setGameState('GAME_OVER');
            setHighScore(prev => Math.max(prev, score));
          }
        }
      } else if (gameState === 'START') {
        const text = "PRESS SPACE TO START";
        ctx.fillStyle = '#06b6d4';
        ctx.font = '20px monospace';
        ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2);
        
        // Show idle player
        drawPlayer(player.x, player.y, player.width, player.height, player.color);
      } 

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to Exit
      if (e.code === 'Escape') {
        onClose();
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'START' || gameState === 'GAME_OVER') {
          if (gameState === 'GAME_OVER') resetGame(); // Reset before playing
          else setGameState('PLAYING');
        } else if (player.grounded) {
          player.dy = JUMP_FORCE;
          player.grounded = false;
        }
      }
    };
    
    // Touch support
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (gameState === 'START' || gameState === 'GAME_OVER') {
        if (gameState === 'GAME_OVER') resetGame();
        else setGameState('PLAYING');
      } else if (player.grounded) {
        player.dy = JUMP_FORCE;
        player.grounded = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouch);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouch);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]); // Re-bind effect when state changes (simplified)

  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
      <div className="relative bg-slate-900 border-2 border-cyan-500 rounded-lg p-2 shadow-[0_0_50px_rgba(6,182,212,0.3)] max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="font-hero text-cyan-400 text-xl tracking-widest flex items-center gap-2">
                <Trophy size={20}/> CYBER RUNNER
            </h3>
            <button 
              onClick={onClose} 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              title="Press ESC to close"
            >
                <span className="text-xs font-mono border border-slate-600 px-1 rounded hidden sm:inline">ESC</span>
                <X size={24} />
            </button>
        </div>

        {/* Canvas */}
        <div className="relative border border-slate-700 bg-slate-950 rounded overflow-hidden">
            <canvas 
                ref={canvasRef} 
                width={600} 
                height={300} 
                className="w-full h-auto block"
            />
            
            {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                    <h2 className="text-4xl font-hero text-red-500 mb-2 animate-pulse">SYSTEM FAILURE</h2>
                    <p className="font-tech text-cyan-200 mb-6">SCORE: {score}</p>
                    <button 
                        onClick={() => setGameState('PLAYING')} // Allow click trigger too
                        className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-all"
                    >
                        <RefreshCw size={18} /> REBOOT SYSTEM
                    </button>
                    <p className="mt-4 text-xs text-slate-400">or press SPACE</p>
                </div>
            )}
        </div>

        {/* Score Board */}
        <div className="mt-4 flex justify-between px-4 font-tech text-sm">
            <div className="text-slate-300">
                STATUS: <span className={gameState === 'PLAYING' ? 'text-green-400' : 'text-red-400'}>{gameState}</span>
            </div>
            <div className="text-cyan-400">
                SCORE: {score} | HI: {highScore}
            </div>
        </div>
        
        <div className="mt-2 text-center text-xs text-slate-500 font-mono">
            [SPACE] to JUMP • Avoid BUGS and ERRORS
        </div>
      </div>
    </div>
  );
};
