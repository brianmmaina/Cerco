// src/theme.js

export const colors = {
  primary:   '#C1002F', // BU Crimson
  secondary: '#FFC72C', // BU Gold
  background:'#FAFAFA', // Light neutral
  surface:   '#FFFFFF', // Cards, containers
  text:      '#222222', // Dark text
  muted:     '#888888', // Less‐important text
  error:     '#B00020', // Error states
};

export const spacing = {
    tiny:   4,
    small:  8,
    medium: 16,
    large:  24,
};

export const typography = {
    h1:      { fontSize: 32, fontWeight: '700', color: colors.text },
    h2:      { fontSize: 24, fontWeight: '600', color: colors.text },
    body:    { fontSize: 16, fontWeight: '400', color: colors.text },
    caption: { fontSize: 12, fontWeight: '400', color: colors.muted },
};
