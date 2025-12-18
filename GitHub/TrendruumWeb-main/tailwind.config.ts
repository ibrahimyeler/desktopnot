import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#F27A1A',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '0rem',
          sm: '0.5rem',
          lg: '1rem',
          xl: '2rem',
          '2xl': '3rem',
        },
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        'slide-up': {
          '0%, 25%': { transform: 'translateY(100%)' },
          '33%, 58%': { transform: 'translateY(0)' },
          '66%, 91%': { transform: 'translateY(-100%)' }
        },
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' }
        }
      },
      animation: {
        'slide-up': 'slide-up 8s infinite',
        'fade-in-out': 'fade-in-out 3s ease-in-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    function({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.input-no-underline': {
          'text-decoration': 'none',
          '&:focus': {
            'text-decoration': 'none'
          }
        }
      })
    }
  ],
} satisfies Config;
