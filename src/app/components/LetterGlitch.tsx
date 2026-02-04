'use client';
import { useEffect, useRef, useCallback } from 'react';

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
}

const LetterGlitch = ({
  glitchColors = ['#2b4539', '#61dca3', '#61b3dc'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
}: LetterGlitchProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<
    {
      char: string;
      color: string;
      targetChar: string;
      targetColor: string;
      progress: number;
    }[][]
  >([]);
  const grid = useRef<{ cols: number; rows: number }>({ cols: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const lettersAndSymbols = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '!', '@', '#', '$', '&', '*', '(', ')', '-', '_', '+', '=', '/',
    '[', ']', '{', '}', ';', ':', '<', '>', ',', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9',
  ];

  const getRandomChar = useCallback(() => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  }, []);

  const getRandomColor = useCallback(() => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  }, [glitchColors]);

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    if (!c1 || !c2) return color1;

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return `rgb(${r},${g},${b})`;
  };

  const initGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cols = Math.ceil(canvas.width / charWidth);
    const rows = Math.ceil(canvas.height / charHeight);

    grid.current = { cols, rows };
    letters.current = [];

    for (let y = 0; y < rows; y++) {
      const row: {
        char: string;
        color: string;
        targetChar: string;
        targetColor: string;
        progress: number;
      }[] = [];
      for (let x = 0; x < cols; x++) {
        const char = getRandomChar();
        const color = getRandomColor();
        row.push({
          char,
          color,
          targetChar: char,
          targetColor: color,
          progress: 1,
        });
      }
      letters.current.push(row);
    }
  }, [getRandomChar, getRandomColor]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initGrid();
  }, [initGrid]);

  const drawLetters = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = context.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    for (let y = 0; y < grid.current.rows; y++) {
      for (let x = 0; x < grid.current.cols; x++) {
        const letter = letters.current[y]?.[x];
        if (!letter) continue;

        if (smooth && letter.progress < 1) {
          letter.progress += 0.1;
          if (letter.progress > 1) letter.progress = 1;

          ctx.fillStyle = interpolateColor(
            letter.color,
            letter.targetColor,
            letter.progress
          );

          if (letter.progress >= 1) {
            letter.char = letter.targetChar;
            letter.color = letter.targetColor;
          }
        } else {
          ctx.fillStyle = letter.color;
        }

        ctx.fillText(letter.char, x * charWidth, y * charHeight);
      }
    }

    // Apply vignette effects
    if (outerVignette) {
      const outerGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))
      );
      outerGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      outerGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
      outerGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      ctx.fillStyle = outerGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (centerVignette) {
      const centerGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2
      );
      centerGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      centerGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
      centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [smooth, outerVignette, centerVignette]);

  const updateLetters = useCallback(() => {
    const numChanges = Math.ceil(
      (grid.current.cols * grid.current.rows) / 15
    );

    for (let i = 0; i < numChanges; i++) {
      const x = Math.floor(Math.random() * grid.current.cols);
      const y = Math.floor(Math.random() * grid.current.rows);
      const letter = letters.current[y]?.[x];

      if (letter) {
        letter.targetChar = getRandomChar();
        letter.targetColor = getRandomColor();
        letter.progress = 0;
      }
    }
  }, [getRandomChar, getRandomColor]);

  const animate = useCallback(() => {
    drawLetters();
    animationRef.current = requestAnimationFrame(animate);
  }, [drawLetters]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');
    resizeCanvas();

    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);

    animate();

    const glitchInterval = setInterval(updateLetters, glitchSpeed);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(glitchInterval);
    };
  }, [resizeCanvas, animate, updateLetters, glitchSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};

export default LetterGlitch;
