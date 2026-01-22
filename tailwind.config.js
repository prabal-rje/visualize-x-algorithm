import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '560px',
      md: '820px',
      lg: '900px',
      xl: '1200px',
      '2xl': '1600px'
    },
    spacing: {
      ...defaultTheme.spacing,
      gutter: 'var(--shell-gutter)',
      'gutter-sm': 'var(--shell-gutter-sm)',
      shell: 'var(--shell-gap)',
      panel: 'var(--panel-pad)',
      'panel-sm': 'var(--panel-pad-sm)',
      'panel-lg': 'var(--panel-pad-lg)'
    },
    extend: {
      colors: {
        crt: {
          ink: 'rgb(var(--phosphor-green-rgb) / <alpha-value>)',
          amber: 'rgb(var(--phosphor-amber-rgb) / <alpha-value>)',
          cyan: 'rgb(var(--phosphor-cyan-rgb) / <alpha-value>)',
          magenta: 'rgb(var(--phosphor-magenta-rgb) / <alpha-value>)',
          black: 'rgb(var(--crt-black-rgb) / <alpha-value>)',
          dark: 'rgb(var(--crt-dark-rgb) / <alpha-value>)',
          void: 'rgb(var(--crt-void-rgb) / <alpha-value>)',
          panel: 'rgb(var(--crt-panel-rgb) / <alpha-value>)',
          'panel-strong': 'rgb(var(--crt-panel-strong-rgb) / <alpha-value>)',
          'panel-deep': 'rgb(var(--crt-panel-deep-rgb) / <alpha-value>)',
          'panel-soft': 'rgb(var(--crt-panel-soft-rgb) / <alpha-value>)',
          line: 'rgb(var(--crt-line-rgb) / <alpha-value>)'
        }
      },
      fontFamily: {
        display: ['Press Start 2P', 'VT323', 'monospace'],
        mono: ['VT323', 'IBM Plex Mono', 'monospace']
      },
      maxWidth: {
        shell: 'var(--shell-max)'
      },
      borderRadius: {
        panel: 'var(--panel-radius)'
      },
      boxShadow: {
        crt: '0 0 12px rgb(var(--phosphor-green-rgb) / 0.3)',
        'crt-strong': '0 0 24px rgb(var(--phosphor-green-rgb) / 0.5)',
        'crt-inset': 'inset 0 0 30px rgb(var(--phosphor-green-rgb) / 0.1)',
        amber: '0 0 16px rgb(var(--phosphor-amber-rgb) / 0.4)'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'stack-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'chapter-enter': {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' }
        }
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'stack-scroll': 'stack-scroll 16s linear infinite',
        'chapter-enter': 'chapter-enter 0.3s ease-out'
      },
      backgroundImage: {
        'crt-veil':
          'radial-gradient(120% 140% at 20% 0%, rgb(var(--crt-panel-rgb) / 0.25), transparent 60%), radial-gradient(140% 160% at 80% 120%, rgb(var(--crt-panel-rgb) / 0.18), transparent 65%), linear-gradient(180deg, rgb(var(--crt-void-rgb) / 0.95), rgb(var(--crt-black-rgb) / 0.98))'
      }
    }
  },
  plugins: []
};
