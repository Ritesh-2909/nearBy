import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DarkBackgroundProps {
  children: React.ReactNode;
}

export function DarkBackground({ children }: DarkBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Subtle grid pattern overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937', // Dark charcoal gray
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1F2937',
    opacity: 0.1,
    // You can add a pattern here using a library or SVG if needed
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

