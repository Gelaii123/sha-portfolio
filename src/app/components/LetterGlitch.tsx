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
  glitchSpeed = 100, // Increased default for better performance
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
  const lastUpdateTime = useRef<number>(0);
  const isVisible = useRef<boolean>(true);

  // Reduced character set for better performance
  const lettersAndSymbols = useRef([
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '#', '@', '*', '+', '=',
  ]);

  // Increased for better performance (less letters = less rendering)
  const fontSize = 18;
  const charWidth = 12;
  const charHeight = 22;

  const getRandomChar = useCallback(() => {
    return lettersAndSymbols.current[
      Math.floor(Math.random() * lettersAndSymbols.current.length)
    ];
  }, []);

  const getRandomColor = useCallback(() => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  }, [glitchColors]);

  // Cached RGB values to avoid repeated conversion
  const rgbCache = useRef<Map<string, { r: number; g: number; b: number }>>(
    new Map()
  );

  const hexToRgb = useCallback((hex: string) => {
    if (rgbCache.current.has(hex)) {
      return rgbCache.current.get(hex)!;
    }

    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (result) {
      const rgb = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      };
      rgbCache.current.set(hex, rgb);
      return rgb;
    }
    return null;
  }, []);

  const interpolateColor = useCallback(
    (color1: string, color2: string, factor: number) => {
      const c1 = hexToRgb(color1);
      const c2 = hexToRgb(color2);
      if (!c1 || !c2) return color1;

      const r = Math.round(c1.r + (c2.r - c1.r) * factor);
      const g = Math.round(c1.g + (c2.g - c1.g) * factor);
      const b = Math.round(c1.b + (c2.b - c1.b) * factor);

      return `rgb(${r},${g},${b})`;
    },
    [hexToRgb]
  );

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

  // Cached gradients to avoid recreating them every frame
  const outerGradientRef = useRef<CanvasGradient | null>(null);
  const centerGradientRef = useRef<CanvasGradient | null>(null);

  const createGradients = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = context.current;
    if (!canvas || !ctx) return;

    if (outerVignette && !outerGradientRef.current) {
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
      outerGradientRef.current = outerGradient;
    }

    if (centerVignette && !centerGradientRef.current) {
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
      centerGradientRef.current = centerGradient;
    }
  }, [outerVignette, centerVignette]);

  const drawLetters = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = context.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    // Batch rendering - only update letters that are changing
    for (let y = 0; y < grid.current.rows; y++) {
      for (let x = 0; x < grid.current.cols; x++) {
        const letter = letters.current[y]?.[x];
        if (!letter) continue;

        if (smooth && letter.progress < 1) {
          letter.progress += 0.15; // Faster transition
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

    // Apply cached vignette effects
    if (outerVignette && outerGradientRef.current) {
      ctx.fillStyle = outerGradientRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (centerVignette && centerGradientRef.current) {
      ctx.fillStyle = centerGradientRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [smooth, outerVignette, centerVignette, interpolateColor]);

  const updateLetters = useCallback(() => {
    // Reduce number of changes for better performance
    const numChanges = Math.ceil(
      (grid.current.cols * grid.current.rows) / 25 // Reduced from 15 to 25
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

  // Throttled animation using timestamp
  const animate = useCallback(
    (timestamp: number) => {
      if (!isVisible.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Limit to ~30 FPS for better performance
      if (timestamp - lastUpdateTime.current >= 33) {
        drawLetters();
        lastUpdateTime.current = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [drawLetters]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d', { 
      alpha: true,
      // Enable hardware acceleration
      desynchronized: true,
    });
    
    resizeCanvas();
    createGradients();

    const handleResize = () => {
      resizeCanvas();
      // Reset gradients on resize
      outerGradientRef.current = null;
      centerGradientRef.current = null;
      createGradients();
    };

    // Pause animation when tab is not visible
    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animationRef.current = requestAnimationFrame(animate);

    const glitchInterval = setInterval(updateLetters, glitchSpeed);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(glitchInterval);
    };
  }, [resizeCanvas, animate, updateLetters, glitchSpeed, createGradients]);

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