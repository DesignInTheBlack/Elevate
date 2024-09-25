// elevate/colorPlugins.js

const plugin = require('tailwindcss/plugin');
const Color = require('colorjs.io').default;

const isValidColor = (color) => {
  try {
    new Color(color);
    return true;
  } catch (e) {
    return false;
  }
};

const getComplementaryColor = (color) => {
  const hsl = color.clone().to('hsl');
  hsl.h = (hsl.h + 180) % 360;
  const complement = hsl.to('srgb').toString({ format: 'hex' });
  return complement;
};

const getTriadicColors = (color) => {
  const hsl = color.clone().to('hsl');
  const triadic1 = hsl.clone();
  triadic1.h = (hsl.h + 120) % 360;
  const triadic2 = hsl.clone();
  triadic2.h = (hsl.h + 240) % 360;
  return [
    triadic1.to('srgb').toString({ format: 'hex' }),
    triadic2.to('srgb').toString({ format: 'hex' }),
  ];
};

const lightenDarkenPlugin = plugin(function({ addUtilities, theme, e }) {
  const colors = theme('colors');
  const newUtilities = {};

  Object.entries(colors).forEach(([key, value]) => {
    if (isValidColor(value)) {
      const color = new Color(value);

      for (let i = 10; i <= 50; i += 10) {
        // Lighten the color
        const lightenedColor = color.clone().to('lch');
        lightenedColor.l += i;
        if (lightenedColor.l > 100) lightenedColor.l = 100;
        const lightenedHex = lightenedColor.to('srgb').toString({ format: 'hex' });

        newUtilities[`.bg-${e(`${key}:lighten-${i}`)}`] = {
          backgroundColor: lightenedHex,
        };
        newUtilities[`.text-${e(`${key}:lighten-${i}`)}`] = {
          color: lightenedHex,
        };

        // Darken the color
        const darkenedColor = color.clone().to('lch');
        darkenedColor.l -= i;
        if (darkenedColor.l < 0) darkenedColor.l = 0;
        const darkenedHex = darkenedColor.to('srgb').toString({ format: 'hex' });

        newUtilities[`.bg-${e(`${key}:darken-${i}`)}`] = {
          backgroundColor: darkenedHex,
        };
        newUtilities[`.text-${e(`${key}:darken-${i}`)}`] = {
          color: darkenedHex,
        };
      }
    }
  });

  addUtilities(newUtilities, ['responsive', 'hover', 'focus', 'active']);
});

const colorHarmonyPlugin = plugin(function({ addUtilities, theme, e }) {
  const colors = theme('colors');
  const harmonyUtilities = {};

  Object.entries(colors).forEach(([key, value]) => {
    if (isValidColor(value)) {
      const color = new Color(value);

      // Complementary color
      const complementHex = getComplementaryColor(color);

      harmonyUtilities[`.bg-${e(key)} .text-complement`] = {
        color: complementHex,
      };

      // Triadic colors
      const [triadic1Hex, triadic2Hex] = getTriadicColors(color);

      harmonyUtilities[`.bg-${e(key)} .text-triadic-1`] = {
        color: triadic1Hex,
      };
      harmonyUtilities[`.bg-${e(key)} .text-triadic-2`] = {
        color: triadic2Hex,
      };
    }
  });

  addUtilities(harmonyUtilities, ['responsive', 'hover', 'focus', 'active']);
});

const gradientPlugin = plugin(function({ addUtilities, theme, e }) {
  const colors = theme('colors');
  const gradientUtilities = {};

  Object.entries(colors).forEach(([key1, value1]) => {
    if (isValidColor(value1)) {
      Object.entries(colors).forEach(([key2, value2]) => {
        if (key1 !== key2 && isValidColor(value2)) {
          gradientUtilities[`.gradient-${e(key1)}-to-${e(key2)}`] = {
            backgroundImage: `linear-gradient(to right, ${value1}, ${value2})`,
          };
        }
      });
    }
  });

  addUtilities(gradientUtilities, ['responsive', 'hover', 'focus', 'active']);
});

const darkAdaptPlugin = plugin(function({ addUtilities, theme, e }) {
  const colors = theme('colors');
  const darkAdaptUtilities = {};

  Object.entries(colors).forEach(([key, value]) => {
    if (isValidColor(value)) {
      const color = new Color(value).to('lch');
      const luminance = color.luminance;

      const adjustedColor = color.clone();

      if (luminance > 0.5) {
        // Darken the color
        adjustedColor.l -= 30;
        if (adjustedColor.l < 0) adjustedColor.l = 0;
      } else {
        // Lighten the color
        adjustedColor.l += 30;
        if (adjustedColor.l > 100) adjustedColor.l = 100;
      }

      const adjustedHex = adjustedColor.to('srgb').toString({ format: 'hex' });

      darkAdaptUtilities[`.dark .dark-adapt.bg-${e(key)}`] = {
        backgroundColor: adjustedHex,
      };
      darkAdaptUtilities[`.dark .dark-adapt.text-${e(key)}`] = {
        color: adjustedHex,
      };
    }
  });

  addUtilities(darkAdaptUtilities, ['responsive', 'hover', 'focus', 'active']);
});

const accessibleTextPlugin = plugin(function({ addUtilities, theme, e }) {
  const colors = theme('colors');
  const accessibleTextUtilities = {};

  Object.entries(colors).forEach(([key, value]) => {
    if (isValidColor(value)) {
      const bgColor = new Color(value);
      const contrastWithBlack = bgColor.contrast(new Color('black'), 'WCAG21');
      const textColor = contrastWithBlack >= 4.5 ? 'black' : 'white';

      accessibleTextUtilities[`.bg-${e(key)} .text-accessible`] = { color: textColor };
    }
  });

  addUtilities(accessibleTextUtilities, ['responsive', 'hover', 'focus', 'active']);
});

module.exports = [
  lightenDarkenPlugin,
  colorHarmonyPlugin,
  gradientPlugin,
  darkAdaptPlugin,
  accessibleTextPlugin,
];
