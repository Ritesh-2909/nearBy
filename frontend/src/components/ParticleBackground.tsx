import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  interactive?: boolean;
}

export function ParticleBackground({ 
  particleCount = 30,
  interactive = true 
}: ParticleBackgroundProps) {
  const particles = useRef<Particle[]>([]);
  const touchX = useSharedValue(SCREEN_WIDTH / 2);
  const touchY = useSharedValue(SCREEN_HEIGHT / 2);
  const touchActive = useSharedValue(0);

  // Initialize particles
  useEffect(() => {
    particles.current = Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * 4 + 2; // 2-6px
      const isGrey = Math.random() > 0.5;
      
      return {
        id: i,
        x: useSharedValue(Math.random() * SCREEN_WIDTH),
        y: useSharedValue(Math.random() * SCREEN_HEIGHT),
        size,
        color: isGrey ? '#9CA3AF' : '#000000', // Light grey or black
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      };
    });
  }, [particleCount]);

  // Animate particles
  useEffect(() => {
    particles.current.forEach((particle) => {
      const animateParticle = () => {
        'worklet';
        const newX = particle.x.value + particle.speedX;
        const newY = particle.y.value + particle.speedY;

        // Bounce off edges
        if (newX <= 0 || newX >= SCREEN_WIDTH) {
          particle.speedX *= -1;
        }
        if (newY <= 0 || newY >= SCREEN_HEIGHT) {
          particle.speedY *= -1;
        }

        // Apply touch interaction
        if (interactive && touchActive.value > 0) {
          const dx = particle.x.value - touchX.value;
          const dy = particle.y.value - touchY.value;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.speedX += (dx / distance) * force * 0.1;
            particle.speedY += (dy / distance) * force * 0.1;
          }
        }

        // Update position
        particle.x.value = Math.max(0, Math.min(SCREEN_WIDTH, newX));
        particle.y.value = Math.max(0, Math.min(SCREEN_HEIGHT, newY));
      };

      // Start animation loop
      const interval = setInterval(() => {
        animateParticle();
      }, 16); // ~60fps

      return () => clearInterval(interval);
    });
  }, [interactive, touchX, touchY, touchActive]);

  const handleTouch = (event: any) => {
    if (!interactive) return;
    
    const { locationX, locationY } = event.nativeEvent;
    touchX.value = withSpring(locationX);
    touchY.value = withSpring(locationY);
    touchActive.value = withTiming(1, { duration: 100 });
    
    setTimeout(() => {
      touchActive.value = withTiming(0, { duration: 500 });
    }, 200);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={StyleSheet.absoluteFill} pointerEvents={interactive ? 'auto' : 'none'}>
        {particles.current.map((particle) => (
          <ParticleComponent key={particle.id} particle={particle} />
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
}

function ParticleComponent({ particle }: { particle: Particle }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: particle.x.value },
        { translateY: particle.y.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});

