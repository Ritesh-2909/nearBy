import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  interpolate,
  Easing,
} from 'react-native-reanimated';

type BlobExpression =
  | 'greeting'
  | 'lookingDown'
  | 'followingText'
  | 'thiefStaring'
  | 'whistling'
  | 'caught';

interface AnimatedBlobCharactersProps {
  expression: BlobExpression;
  emailLength?: number;
  emailPosition?: number; // Position of cursor in email (0 to emailLength)
  isPasswordVisible?: boolean;
}

export function AnimatedBlobCharacters({
  expression,
  emailLength = 0,
  emailPosition = 0,
  isPasswordVisible = false,
}: AnimatedBlobCharactersProps) {
  // Animation values for greeting
  const greetingScale = useSharedValue(0);
  const greetingOpacity = useSharedValue(0);

  // Animation values for looking down
  const headTilt = useSharedValue(0);
  const eyeY = useSharedValue(0);

  // Animation values for following text
  const eyeX = useSharedValue(0);

  // Animation values for thief expression
  const thiefEyes = useSharedValue(0);
  const thiefMouth = useSharedValue(0);
  const thiefBrows = useSharedValue(0);

  // Animation values for whistling
  const whistleRotation = useSharedValue(0);
  const whistleMouth = useSharedValue(0);
  const lookAtEachOther = useSharedValue(0);

  useEffect(() => {
    switch (expression) {
      case 'greeting':
        greetingScale.value = withSpring(1, { damping: 15, stiffness: 150 });
        greetingOpacity.value = withTiming(1, { duration: 500 });
        headTilt.value = withSpring(0);
        eyeY.value = withSpring(0);
        break;

      case 'lookingDown':
        headTilt.value = withSpring(25);
        eyeY.value = withSpring(3);
        eyeX.value = 0;
        break;

      case 'followingText':
        // Calculate eye position based on email position
        // Map email position (0 to emailLength) to eye X position (-15 to 15)
        const maxEyeMovement = 15;
        const normalizedPosition = emailLength > 0 ? emailPosition / emailLength : 0;
        eyeX.value = withTiming(
          (normalizedPosition - 0.5) * maxEyeMovement * 2,
          { duration: 200, easing: Easing.out(Easing.quad) }
        );
        headTilt.value = withSpring(25);
        eyeY.value = withSpring(3);
        break;

      case 'thiefStaring':
        headTilt.value = withSpring(30);
        eyeY.value = withSpring(4);
        thiefEyes.value = withSequence(
          withTiming(1, { duration: 300 }),
          withRepeat(
            withSequence(
              withTiming(1.2, { duration: 400 }),
              withTiming(1, { duration: 400 })
            ),
            -1,
            true
          )
        );
        thiefMouth.value = withSequence(
          withTiming(1, { duration: 300 }),
          withRepeat(
            withSequence(
              withTiming(1.3, { duration: 500 }),
              withTiming(1, { duration: 500 })
            ),
            -1,
            true
          )
        );
        thiefBrows.value = withTiming(1, { duration: 300 });
        break;

      case 'whistling':
        lookAtEachOther.value = withSpring(1);
        whistleMouth.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 800 }),
            withTiming(0.8, { duration: 800 })
          ),
          -1,
          true
        );
        whistleRotation.value = withRepeat(
          withSequence(
            withTiming(5, { duration: 1000 }),
            withTiming(-5, { duration: 1000 })
          ),
          -1,
          true
        );
        headTilt.value = withSpring(0);
        eyeY.value = withSpring(0);
        break;

      case 'caught':
        lookAtEachOther.value = withSpring(1);
        headTilt.value = withSpring(-10);
        eyeY.value = withSpring(-2);
        break;
    }
  }, [expression, emailLength, emailPosition]);

  return (
    <View className="items-center justify-center mb-6" style={{ height: 200 }}>
      <View className="flex-row items-center justify-center" style={{ width: 300, height: 180 }}>
        {/* Left Blob */}
        <BlobCharacter
          position="left"
          expression={expression}
          greetingScale={greetingScale}
          greetingOpacity={greetingOpacity}
          headTilt={headTilt}
          eyeX={eyeX}
          eyeY={eyeY}
          thiefEyes={thiefEyes}
          thiefMouth={thiefMouth}
          thiefBrows={thiefBrows}
          whistleRotation={whistleRotation}
          whistleMouth={whistleMouth}
          lookAtEachOther={lookAtEachOther}
        />

        {/* Middle Blob (with magnifying glass) */}
        <BlobCharacter
          position="center"
          expression={expression}
          greetingScale={greetingScale}
          greetingOpacity={greetingOpacity}
          headTilt={headTilt}
          eyeX={eyeX}
          eyeY={eyeY}
          thiefEyes={thiefEyes}
          thiefMouth={thiefMouth}
          thiefBrows={thiefBrows}
          whistleRotation={whistleRotation}
          whistleMouth={whistleMouth}
          lookAtEachOther={lookAtEachOther}
          hasMagnifyingGlass={true}
        />

        {/* Right Blob */}
        <BlobCharacter
          position="right"
          expression={expression}
          greetingScale={greetingScale}
          greetingOpacity={greetingOpacity}
          headTilt={headTilt}
          eyeX={eyeX}
          eyeY={eyeY}
          thiefEyes={thiefEyes}
          thiefMouth={thiefMouth}
          thiefBrows={thiefBrows}
          whistleRotation={whistleRotation}
          whistleMouth={whistleMouth}
          lookAtEachOther={lookAtEachOther}
        />
      </View>
    </View>
  );
}

interface BlobCharacterProps {
  position: 'left' | 'center' | 'right';
  expression: BlobExpression;
  greetingScale: Animated.SharedValue<number>;
  greetingOpacity: Animated.SharedValue<number>;
  headTilt: Animated.SharedValue<number>;
  eyeX: Animated.SharedValue<number>;
  eyeY: Animated.SharedValue<number>;
  thiefEyes: Animated.SharedValue<number>;
  thiefMouth: Animated.SharedValue<number>;
  thiefBrows: Animated.SharedValue<number>;
  whistleRotation: Animated.SharedValue<number>;
  whistleMouth: Animated.SharedValue<number>;
  lookAtEachOther: Animated.SharedValue<number>;
  hasMagnifyingGlass?: boolean;
}

function BlobCharacter({
  position,
  expression,
  greetingScale,
  greetingOpacity,
  headTilt,
  eyeX,
  eyeY,
  thiefEyes,
  thiefMouth,
  thiefBrows,
  whistleRotation,
  whistleMouth,
  lookAtEachOther,
  hasMagnifyingGlass = false,
}: BlobCharacterProps) {
  // Calculate look direction for whistling (looking at each other)
  const getLookDirection = () => {
    if (expression === 'whistling' || expression === 'caught') {
      if (position === 'left') return 1; // Look right
      if (position === 'right') return -1; // Look left
      return 0; // Center looks forward
    }
    return 0;
  };

  const lookDirection = getLookDirection();

  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    const scale = greetingScale.value;
    const opacity = greetingOpacity.value;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const headStyle = useAnimatedStyle(() => {
    const tilt = headTilt.value;
    const rotation = expression === 'whistling' || expression === 'caught'
      ? interpolate(lookAtEachOther.value, [0, 1], [0, lookDirection * 15])
      : 0;
    return {
      transform: [
        { rotate: `${tilt}deg` },
        { rotateZ: `${rotation}deg` },
      ],
    };
  });

  const leftEyeStyle = useAnimatedStyle(() => {
    const x = eyeX.value;
    const y = eyeY.value;
    const lookX = interpolate(lookAtEachOther.value, [0, 1], [0, lookDirection * 3]);
    const finalX = x + lookX;
    
    // Thief expression - eyes get bigger and more intense
    const scale = expression === 'thiefStaring'
      ? interpolate(thiefEyes.value, [0, 1], [1, 1.3])
      : 1;
    
    return {
      transform: [
        { translateX: finalX },
        { translateY: y },
        { scale },
      ],
    };
  });

  const rightEyeStyle = useAnimatedStyle(() => {
    const x = eyeX.value;
    const y = eyeY.value;
    const lookX = interpolate(lookAtEachOther.value, [0, 1], [0, lookDirection * 3]);
    const finalX = x + lookX;
    
    const scale = expression === 'thiefStaring'
      ? interpolate(thiefEyes.value, [0, 1], [1, 1.3])
      : 1;
    
    return {
      transform: [
        { translateX: finalX },
        { translateY: y },
        { scale },
      ],
    };
  });

  const eyebrowStyle = useAnimatedStyle(() => {
    if (expression === 'thiefStaring') {
      const browY = interpolate(thiefBrows.value, [0, 1], [0, -3]);
      return {
        transform: [{ translateY: browY }],
      };
    }
    return {};
  });

  const mouthStyle = useAnimatedStyle(() => {
    if (expression === 'thiefStaring') {
      const mouthScale = interpolate(thiefMouth.value, [0, 1], [1, 1.3]);
      return {
        transform: [{ scale: mouthScale }],
      };
    }
    if (expression === 'whistling') {
      const mouthY = interpolate(whistleMouth.value, [0, 1], [0, 2]);
      return {
        transform: [{ translateY: mouthY }],
      };
    }
    return {};
  });

  const magnifyingGlassStyle = useAnimatedStyle(() => {
    if (hasMagnifyingGlass && (expression === 'lookingDown' || expression === 'followingText' || expression === 'thiefStaring')) {
      const tilt = headTilt.value;
      return {
        transform: [{ rotate: `${tilt}deg` }],
      };
    }
    return {};
  });

  // Character-specific features
  const getCharacterFeatures = () => {
    switch (position) {
      case 'left':
        return {
          eyebrowRaised: true,
          handPosition: 'chin',
          sweatDrops: true,
        };
      case 'center':
        return {
          eyebrowRaised: false,
          handPosition: 'magnifying',
          sweatDrops: true,
          zzz: expression === 'greeting',
        };
      case 'right':
        return {
          eyebrowRaised: false,
          handPosition: 'clasped',
          sweatDrops: true,
          mouthShape: expression === 'whistling' ? 'whistle' : 'surprised',
        };
      default:
        return {};
    }
  };

  const features = getCharacterFeatures();

  return (
    <Animated.View style={[containerStyle, { width: 100, height: 180, alignItems: 'center', justifyContent: 'center' }]}>
      {/* Blob Body */}
      <View
        style={{
          width: 60,
          height: 80,
          backgroundColor: 'white',
          borderRadius: 30,
          borderWidth: 2,
          borderColor: 'black',
          position: 'absolute',
          bottom: 0,
        }}
      />

      {/* Head Container */}
      <Animated.View
        style={[
          headStyle,
          {
            width: 50,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 20,
          },
        ]}
      >
        {/* Head Shape */}
        <View
          style={{
            width: 36,
            height: 44,
            backgroundColor: 'white',
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'black',
            position: 'relative',
          }}
        >
          {/* Left Eyebrow */}
          <Animated.View
            style={[
              eyebrowStyle,
              {
                position: 'absolute',
                left: 6,
                top: 8,
                width: 12,
                height: 2,
                backgroundColor: 'black',
                borderRadius: 1,
              },
            ]}
          />
          {features.eyebrowRaised && (
            <View
              style={{
                position: 'absolute',
                left: 4,
                top: 6,
                width: 14,
                height: 1.5,
                backgroundColor: 'black',
                borderRadius: 1,
              }}
            />
          )}

          {/* Right Eyebrow */}
          <Animated.View
            style={[
              eyebrowStyle,
              {
                position: 'absolute',
                right: 6,
                top: 8,
                width: 12,
                height: 2,
                backgroundColor: 'black',
                borderRadius: 1,
              },
            ]}
          />

          {/* Left Eye */}
          <Animated.View
            style={[
              leftEyeStyle,
              {
                position: 'absolute',
                left: 8,
                top: 18,
                width: 12,
                height: 12,
                backgroundColor: 'white',
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <View
              style={{
                width: 6,
                height: 6,
                backgroundColor: 'black',
                borderRadius: 3,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 2,
                top: 2,
                width: 2,
                height: 2,
                backgroundColor: 'white',
                borderRadius: 1,
              }}
            />
          </Animated.View>

          {/* Right Eye */}
          <Animated.View
            style={[
              rightEyeStyle,
              {
                position: 'absolute',
                right: 8,
                top: 18,
                width: 12,
                height: 12,
                backgroundColor: 'white',
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <View
              style={{
                width: 6,
                height: 6,
                backgroundColor: 'black',
                borderRadius: 3,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 2,
                top: 2,
                width: 2,
                height: 2,
                backgroundColor: 'white',
                borderRadius: 1,
              }}
            />
          </Animated.View>

          {/* Mouth */}
          <Animated.View
            style={[
              mouthStyle,
              {
                position: 'absolute',
                left: '50%',
                top: 32,
                transform: [{ translateX: -12 }],
              },
            ]}
          >
            {expression === 'thiefStaring' ? (
              // Evil grin
              <View
                style={{
                  width: 16,
                  height: 8,
                  borderBottomWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderColor: 'black',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              />
            ) : expression === 'whistling' || features.mouthShape === 'whistle' ? (
              // Whistling mouth (puckered)
              <Animated.View
                style={useAnimatedStyle(() => ({
                  width: interpolate(whistleMouth.value, [0, 1], [4, 6]),
                  height: interpolate(whistleMouth.value, [0, 1], [6, 8]),
                  backgroundColor: 'black',
                  borderRadius: 3,
                }))}
              />
            ) : features.mouthShape === 'surprised' ? (
              // Surprised mouth (small '3' shape)
              <View
                style={{
                  width: 6,
                  height: 3,
                  borderTopWidth: 2,
                  borderColor: 'black',
                  borderRadius: 2,
                }}
              />
            ) : (
              // Normal smile
              <View
                style={{
                  width: 12,
                  height: 6,
                  borderBottomWidth: 2,
                  borderColor: 'black',
                  borderRadius: 3,
                }}
              />
            )}
          </Animated.View>

          {/* Sweat Drops */}
          {features.sweatDrops && (
            <View
              style={{
                position: 'absolute',
                left: -12,
                top: 12,
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 6,
                  backgroundColor: 'black',
                  borderRadius: 2,
                  opacity: 0.6,
                  marginBottom: 2,
                }}
              />
              <View
                style={{
                  width: 3,
                  height: 5,
                  backgroundColor: 'black',
                  borderRadius: 1.5,
                  opacity: 0.6,
                }}
              />
            </View>
          )}
        </View>

        {/* Hands */}
        {features.handPosition === 'chin' && (
          <View
            style={{
              position: 'absolute',
              left: -8,
              top: 20,
              width: 4,
              height: 12,
              backgroundColor: 'black',
              borderRadius: 2,
            }}
          />
        )}

        {features.handPosition === 'clasped' && (
          <View
            style={{
              position: 'absolute',
              top: 28,
              flexDirection: 'row',
              gap: 4,
            }}
          >
            <View
              style={{
                width: 4,
                height: 8,
                backgroundColor: 'black',
                borderRadius: 2,
              }}
            />
            <View
              style={{
                width: 4,
                height: 8,
                backgroundColor: 'black',
                borderRadius: 2,
              }}
            />
          </View>
        )}

        {/* Magnifying Glass (for center character) */}
        {hasMagnifyingGlass && (
          <Animated.View
            style={[
              magnifyingGlassStyle,
              {
                position: 'absolute',
                right: -15,
                top: 20,
              },
            ]}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: 'black',
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: -2,
                bottom: -2,
                width: 8,
                height: 2,
                backgroundColor: 'black',
                transform: [{ rotate: '45deg' }],
              }}
            />
          </Animated.View>
        )}

        {/* ZZZ (for center character when greeting) */}
        {features.zzz && (
          <View
            style={{
              position: 'absolute',
              top: -20,
              flexDirection: 'row',
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 12, color: 'black' }}>Z</Text>
            <Text style={{ fontSize: 14, color: 'black' }}>Z</Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}
