import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'full' | 'icon-only';
}

export function Logo({ 
  size = 'large', 
  showText = true, 
  variant = 'full' 
}: LogoProps) {
  const sizeMap = {
    small: { icon: 40, text: 16, subtitle: 10 },
    medium: { icon: 60, text: 20, subtitle: 12 },
    large: { icon: 80, text: 28, subtitle: 14 },
  };

  const dimensions = sizeMap[size];

  return (
    <View style={styles.container}>
      {/* Map Pin Icon with N */}
      <View 
        style={{
          width: dimensions.icon,
          height: dimensions.icon * 1.2, // Pin is taller than wide
          marginBottom: showText ? 16 : 0,
        }}
      >
        {/* Shadow */}
        <View
          style={{
            position: 'absolute',
            width: dimensions.icon,
            height: dimensions.icon * 1.2,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: dimensions.icon / 2,
            transform: [{ translateX: 2 }, { translateY: 2 }],
            zIndex: 0,
          }}
        />
        
        {/* Gradient Pin */}
        <LinearGradient
          colors={['#14B8A6', '#0D9488', '#0F766E']} // Teal to darker teal-blue
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: dimensions.icon,
            height: dimensions.icon * 1.2,
            borderRadius: dimensions.icon / 2,
            position: 'relative',
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: dimensions.icon * 0.15,
            shadowColor: '#14B8A6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {/* N Letter */}
          <Text
            style={{
              fontSize: dimensions.icon * 0.5,
              fontWeight: 'bold',
              color: '#FFFFFF',
              letterSpacing: -2,
            }}
          >
            N
          </Text>
        </LinearGradient>
      </View>

      {/* Text */}
      {showText && variant === 'full' && (
        <View style={styles.textContainer}>
          <Text
            style={{
              fontSize: dimensions.text,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            NEARBY
          </Text>
          <View style={styles.subtitleContainer}>
            <Text
              style={{
                fontSize: dimensions.subtitle,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              LOCAL DISCOVERY
            </Text>
            {/* Golden underline */}
            <View
              style={{
                width: dimensions.subtitle * 8,
                height: 2,
                backgroundColor: '#F59E0B', // Golden-orange
                borderRadius: 1,
                marginTop: 4,
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
});
