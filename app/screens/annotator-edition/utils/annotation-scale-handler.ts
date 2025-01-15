import { useState } from 'react';

export const useAnnotationScale = () => {
  const [scale, setScale] = useState(1);
  const scaleUp = () => scale < 5 && setScale(p => p + 0.2);
  const scaleDown = () => scale > 1 && setScale(p => p - 0.2);
  const scaleReset = () => setScale(1);

  return {
    scale,
    scaleUp,
    scaleDown,
    scaleReset,
  };
};
