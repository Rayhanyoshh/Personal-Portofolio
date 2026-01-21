import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalHeroProps {
  fullName: string;
  title: string;
  bio: string;
}

interface CommandLine {
  command: string;
  output: string;
  delay: number;
}

export const TerminalHero: React.FC<TerminalHeroProps> = ({ fullName, title, bio }) => {
  const [displayedLines, setDisplayedLines] = useState<{ command: string; output: string; isTyping: boolean }[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingCommand, setIsTypingCommand] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const commands: CommandLine[] = [
    { command: 'whoami', output: fullName, delay: 50 },
    { command: 'cat role.txt', output: `// ${title}`, delay: 40 },
    { command: 'cat bio.txt', output: bio, delay: 20 },
  ];

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    if (currentLineIndex >= commands.length) return;

    const currentCommand = commands[currentLineIndex];
    const targetText = isTypingCommand ? currentCommand.command : currentCommand.output;
    const typingSpeed = isTypingCommand ? 80 : currentCommand.delay;

    if (currentCharIndex < targetText.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (!newLines[currentLineIndex]) {
            newLines[currentLineIndex] = { command: '', output: '', isTyping: true };
          }
          if (isTypingCommand) {
            newLines[currentLineIndex].command = targetText.substring(0, currentCharIndex + 1);
          } else {
            newLines[currentLineIndex].output = targetText.substring(0, currentCharIndex + 1);
          }
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      // Finished typing current part
      if (isTypingCommand) {
        // Switch to typing output after a pause
        const timeout = setTimeout(() => {
          setIsTypingCommand(false);
          setCurrentCharIndex(0);
        }, 300);
        return () => clearTimeout(timeout);
      } else {
        // Move to next command after a pause
        const timeout = setTimeout(() => {
          setDisplayedLines(prev => {
            const newLines = [...prev];
            if (newLines[currentLineIndex]) {
              newLines[currentLineIndex].isTyping = false;
            }
            return newLines;
          });
          setCurrentLineIndex(prev => prev + 1);
          setIsTypingCommand(true);
          setCurrentCharIndex(0);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentCharIndex, isTypingCommand, commands]);

  const isCurrentlyTyping = currentLineIndex < commands.length;

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto">
      {/* Terminal Window */}
      <div className="bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/10">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-950/80 border-b border-gray-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="font-tech text-xs text-gray-500 flex items-center justify-center gap-2">
              <Terminal size={12} />
              rayhan@portfolio ~ 
            </span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-sm space-y-4 min-h-[280px]">
          {displayedLines.map((line, index) => (
            <div key={index} className="space-y-1">
              {/* Command Line */}
              <div className="flex items-center gap-2">
                <span className="text-green-400">❯</span>
                <span className="text-cyan-400">{line.command}</span>
                {line.isTyping && isTypingCommand && index === currentLineIndex && (
                  <span className={`inline-block w-2 h-5 bg-cyan-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                )}
              </div>
              {/* Output */}
              {line.output && (
                <div className="pl-5 text-gray-200 leading-relaxed">
                  {index === 2 ? (
                    // Bio - smaller text, different styling
                    <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
                      {line.output}
                      {line.isTyping && !isTypingCommand && index === currentLineIndex && (
                        <span className={`inline-block w-2 h-4 bg-cyan-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                      )}
                    </p>
                  ) : index === 0 ? (
                    // Name - large and bold
                    <h1 className="font-hero text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {line.output}
                      {line.isTyping && !isTypingCommand && index === currentLineIndex && (
                        <span className={`inline-block w-3 h-10 bg-cyan-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                      )}
                    </h1>
                  ) : (
                    // Title - medium cyan
                    <span className="text-cyan-500 font-tech text-lg tracking-wider">
                      {line.output}
                      {line.isTyping && !isTypingCommand && index === currentLineIndex && (
                        <span className={`inline-block w-2 h-5 bg-cyan-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {/* Current typing line placeholder */}
          {isCurrentlyTyping && !displayedLines[currentLineIndex] && (
            <div className="flex items-center gap-2">
              <span className="text-green-400">❯</span>
              <span className={`inline-block w-2 h-5 bg-cyan-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            </div>
          )}

          {/* Final prompt after all commands */}
          {!isCurrentlyTyping && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-green-400">❯</span>
              <span className={`inline-block w-2 h-5 bg-cyan-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
