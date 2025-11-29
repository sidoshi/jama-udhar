import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface CelebrationProps {
  trigger: boolean;
  enabled: boolean;
  onComplete?: () => void;
}

export function Celebration({
  trigger,
  enabled,
  onComplete,
}: CelebrationProps) {
  const hasTriggered = useRef(false);
  const wasTriggeredBefore = useRef(false);

  useEffect(() => {
    // Only trigger confetti if:
    // 1. Celebration is enabled
    // 2. We're balanced now
    // 3. We haven't triggered this cycle yet
    // 4. We've seen an unbalanced state before (prevents triggering on page load)
    if (
      enabled &&
      trigger &&
      !hasTriggered.current &&
      wasTriggeredBefore.current
    ) {
      hasTriggered.current = true;

      // Create a spectacular confetti celebration
      const duration = 3000; // 3 seconds
      const end = Date.now() + duration;

      // Colors matching the accounting theme (green for success, gold for celebration)
      const colors = [
        "#4caf50",
        "#66bb6a",
        "#81c784",
        "#FFD700",
        "#FFA726",
        "#FF7043",
      ];

      // Initial burst from center
      confetti({
        particleCount: 150,
        spread: 160,
        origin: { y: 0.6 },
        colors: colors,
        scalar: 1.2,
      });

      // Side cannons after a brief delay
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          scalar: 1.1,
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          scalar: 1.1,
        });
      }, 200);

      // Money-themed celebration (dollar signs and stars)
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 360,
          startVelocity: 15,
          decay: 0.92,
          scalar: 1.5,
          shapes: ["star"],
          colors: ["#FFD700", "#FFA500", "#4caf50"],
          origin: { y: 0.3 },
        });
      }, 400);

      // Continuous small bursts for ongoing celebration
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          hasTriggered.current = false;
          if (onComplete) onComplete();
          return;
        }

        confetti({
          particleCount: 25,
          startVelocity: 25,
          spread: 70,
          origin: {
            x: Math.random(),
            y: Math.random() * 0.3 + 0.5,
          },
          colors: colors,
          scalar: 0.8,
        });
      }, 400);

      // Final celebration burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          startVelocity: 30,
          colors: ["#4caf50", "#FFD700"],
          origin: { y: 0.7 },
          scalar: 1.3,
        });
      }, 1000);
    }
  }, [trigger, onComplete, enabled]);

  // Track state changes and reset when trigger becomes false
  useEffect(() => {
    if (!trigger) {
      hasTriggered.current = false;
      wasTriggeredBefore.current = true; // Mark that we've seen an unbalanced state
    }
  }, [trigger]);

  return null; // This component doesn't render anything visible
}
