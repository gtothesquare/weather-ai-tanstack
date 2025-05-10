import tailwindforms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [tailwindforms()],
  theme: {
    extend: {
      colors: {
        // Dominant color for branding, call-to-action buttons, active states
        // Primary background / accent
        'tiffany-blue': '#97EAD2',
        //Used for info states, tag backgrounds, visual balance
        // Secondary background / card fill
        celadon: '#8CC7A1',
        // Text on light / buttons
        'pump-power': '#816E94',
        // Interactive / links / hover
        byzantium: '#74226C',
        // Surface / footer background
        violet: '#4B2142',

        // simple pallete
        'eerie-black': '#1C1C1C',
        platinum: '#DADDD8',
        alabaster: '#ECEBE4',
        'anti-flash-white': '#EEF0F2',
        'ghost-white': '#FAFAFF',
      },
    },
  },
};

/*
Primary / Brand / CTA	Dominant color for branding, call-to-action buttons, active states
Accent / Highlight	Draws attention subtly (badges, highlights, hover effects)
Secondary Accent / Info	Used for info states, tag backgrounds, visual balance
Neutral Text / Border	Subtle color for body text, input outlines, dividers
Text / Background on Light	For foreground text or dark UI sections over light backgrounds
 */
