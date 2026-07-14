import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                'brand-gold': {
                    50: '#FFF9E6',
                    100: '#FFF0B3',
                    200: '#FFE680',
                    300: '#FFDB4D',
                    400: '#FFD11A',
                    500: '#D4A417',
                    600: '#B8860B',
                    700: '#9A7209',
                    800: '#7C5C07',
                    900: '#5E4605',
                },
                'brand-green': {
                    50: '#E8F5E9',
                    100: '#C8E6C9',
                    200: '#A5D6A7',
                    300: '#81C784',
                    400: '#4CAF50',
                    500: '#2E7D32',
                    600: '#1B5E20',
                    700: '#145A18',
                    800: '#0D4710',
                    900: '#063308',
                },
            },
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
