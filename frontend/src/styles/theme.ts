import { ColorSchemeName } from 'react-native';

const darkColors = {
    main: {
        primary: '#FFFFFF',
        secondary: '#CCCCCC',
    },

    primary: {
        default: '#FF7A00',
        hover: '#FF8F33',
        pressed: '#E56A00',
        subtle: '#331A00',
    },
    secondary: {
        default: '#2ECC71',
        subtle: '#143821',
        pressed: '#28B463',
    },

    disabled: '#777777',
    onPrimary: '#FFFFFF',

    error: '#FF4C4C',
    success: '#28A745',
    warning: '#FFC107',

    base: '#0D0D0D',
    surface: '#1A1A1A',
    overlay: '#262626',

    muted: '#333333',
};

const lightColors = {
    main: {
        primary: '#000000',
        secondary: '#4B4B4B',
    },

    primary: {
        default: '#FF9636',
        hover: '#FF9729',
        pressed: '#D7750D',
        subtle: '#FFF3DA',
    },
    secondary: {
        default: '#55D987',
        subtle: '#075932',
        pressed: '#17D236',
    },

    disabled: '#A6A6A6',
    onPrimary: '#000000',

    error: '#FF4C4C',
    success: '#47B35D',
    warning: '#EE6262',

    base: '#FDFDFD',
    surface: '#F7F7F7',
    overlay: '#EBEBEB',

    muted: '#FBFBFB',
};

export const COLORS = {
    primary: '#000000',
    'primary-dark': '#FFFFFF',
    secondary: '#4B4B4B',
    'secondary-dark': '#CCCCCC',

    'primary-default': '#FF9636',
    'primary-default-dark': '#FF7A00',
    'primary-hover': '#FF9729',
    'primary-hover-dark': '#FF8F33',
    'primary-pressed': '#D7750D',
    'primary-pressed-dark': '#E56A00',
    'primary-subtle': '#FFF3DA',
    'primary-subtle-dark': '#331A00',

    'secondary-default': '#55D987',
    'secondary-default-dark': '#2ECC71',
    'secondary-subtle': '#075932',
    'secondary-subtle-dark': '#143821',
    'secondary-pressed': '#17D236',
    'secondary-pressed-dark': '#28B463',

    disabled: '#A6A6A6',
    'disabled-dark': '#777777',
    onPrimary: '#000000',
    'onPrimary-dark': '#FFFFFF',

    error: '#FF4C4C',
    'error-dark': '#FF4C4C',
    success: '#47B35D',
    'success-dark': '#28A745',
    warning: '#EE6262',
    'warning-dark': '#FFC107',

    base: '#FDFDFD',
    'base-dark': '#0D0D0D',
    surface: '#F7F7F7',
    'surface-dark': '#1A1A1A',
    overlay: '#EBEBEB',
    'overlay-dark': '#262626',
    muted: '#FBFBFB',
    'muted-dark': '#333333',
};

export const DARK = 'dark';
export const LIGHT = 'light';
