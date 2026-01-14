
import React, { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, type MotionProps } from 'framer-motion';

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> &
  MotionProps & {
    /** Displacement distance (px) */
    offsetY?: number;
    /** Hidden state opacity */
    hiddenOpacity?: number;
    /** Delay before animation starts */
    delay?: number;
  };

/**
 * ScrollSection: Handles whole section fade/slide based on scroll progress.
 */
export const ScrollSection = React.forwardRef<HTMLElement, BaseProps & { id?: string }>(
  (
    {
      offsetY = 40,
      hiddenOpacity = 0,
      style,
      children,
      ...rest
    },
    forwardedRef
  ) => {
    const localRef = useRef<HTMLElement | null>(null);
    const setRef = useMemo(() => {
      return (node: HTMLElement | null) => {
        localRef.current = node;
        if (!forwardedRef) return;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
      };
    }, [forwardedRef]);

    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ['start end', 'end start']
    });

    const opacity = useTransform(
      scrollYProgress,
      [0, 0.15, 0.85, 1], 
      [hiddenOpacity, 1, 1, hiddenOpacity],
      { clamp: true }
    );

    const y = useTransform(
      scrollYProgress,
      [0, 0.15, 0.85, 1],
      [offsetY, 0, 0, -offsetY],
      { clamp: true }
    );

    return (
      <motion.section
        ref={setRef as any}
        style={{
          position: 'relative',
          opacity,
          y,
          willChange: 'transform, opacity',
          ...style
        }}
        {...rest}
      >
        {children}
      </motion.section>
    );
  }
);

/**
 * Reveal: Animates individual elements as they enter the viewport.
 */
export const Reveal: React.FC<BaseProps> = ({ 
  children, 
  delay = 0, 
  offsetY = 30,
  hiddenOpacity = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: hiddenOpacity, y: offsetY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.215, 0.61, 0.355, 1] 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

ScrollSection.displayName = 'ScrollSection';
