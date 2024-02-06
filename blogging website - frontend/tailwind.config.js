/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        
        colors: {
            'white': '#FFFFFF',
            'black': '#242424',
            'grey': '#F3F3F3',
            'dark-grey': '#6B6B6B',
            'red': '#FF4E4E',
            'transparent': 'transparent',
            'twitter': '#1DA1F2',
            'purple': '#242424',
            'dark-grey': '3a3b3c'
        },

        fontSize: {
            'sm': '12px',
            'base': '14px',
            'xl': '16px',
            '2xl': '20px',
            '3xl': '28px',
            '4xl': '38px',
            '5xl': '50px',
        },

        extend: {
            fontFamily: {
              inter: ["'Inter'", "sans-serif"],
              gelasio: ["'Gelasio'", "serif"],
              IBM: ["'IBM Plex Sans Thai'", "sans-serif"]
            },
            fontWeight: {
                'medium': 600,
                'bold': 700, // ตัวอย่างเพิ่มค่า weight 500
              },
        },

    },
    plugins: [],
};