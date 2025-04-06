'use client';

import { useState, useRef, useCallback } from 'react';

/**
 * 크기 조절 가능한 패널을 관리하는 커스텀 훅
 * @param initialWidth 초기 너비 (백분율)
 * @param minWidth 최소 너비 (백분율)
 * @param maxWidth 최대 너비 (백분율)
 */
function useResizable(initialWidth: number = 33, minWidth: number = 15, maxWidth: number = 50) {
  const [width, setWidth] = useState<number>(initialWidth);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeRef.current) return;

    const parentElement = resizeRef.current.parentElement;
    if (!parentElement) return;

    const containerRect = parentElement.getBoundingClientRect();
    const leftOffset = e.clientX - containerRect.left;

    const newWidth = (leftOffset / containerRect.width) * 100;
    const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
    setWidth(clampedWidth);

    document.body.style.cursor = 'col-resize';
  }, [minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    setIsDragging(false);
    document.body.style.cursor = 'default';
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    setIsDragging(true);
  }, [handleMouseMove, handleMouseUp]);

  return {
    width,
    isDragging,
    resizeRef,
    handleMouseDown
  };
}

export default useResizable;
