import { useEffect } from 'react';

export default function ScreenFlicker() {
  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const flicker = () => {
      if (!mounted) return;
      const brightness = 0.95 + Math.random() * 0.1;
      document.body.style.filter = `brightness(${brightness})`;
      timeoutId = setTimeout(flicker, 50 + Math.random() * 150);
    };

    flicker();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      document.body.style.filter = '';
    };
  }, []);

  return null;
}
