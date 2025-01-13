export const effects = {

shadows: {
'soft':'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;'
},

gradients: {
'fadetoblack':'linear-gradient(0deg, rgba(0,0,0,0.5032387955182073) 0%, rgba(255,255,255,0) 100%);'
},

textShadows: {
'soft-text':  '0px 1px 2px rgba(0, 0, 0, 0.3);',
},

transitions: {
    'ultra-fast': 'all 0.05s ease-in-out',  // For very quick changes
    'fast': 'all 0.1s ease-in-out',  // Snappy but smooth
    'medium': 'all 0.2s ease-in-out',  // Balanced speed
    'slow': 'all 0.3s ease-in-out',  // Smooth, deliberate
    'ultra-slow': 'all 0.5s ease-in-out',  // For dramatic effects
    'ease': 'all 0.3s ease',  // Natural transition
    'ease-in': 'all 0.3s ease-in',  // Gradual start
    'ease-out': 'all 0.3s ease-out',  // Gradual end
    'linear': 'all 0.3s linear',  // Uniform speed, simple
    'snappy': 'all 0.2s cubic-bezier(0.4, 0, 0.6, 1)',  // Fast and sharp
    'fluid': 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',  // Elastic, fluid effect
    'relaxed': 'all 0.6s ease-in-out',  // Extra smooth and slow
  },

  backgrounds: {

    /* Thin diagonal stripes */
striped: 'repeating-linear-gradient(45deg, currentColor 0 5px, transparent 5px 10px)',

/* Bold diagonal stripes */
boldstripes: 'repeating-linear-gradient(45deg, currentColor 0 15px, transparent 15px 30px)',

/* Fine *actual* zigzag pattern */
thinzigzag: 'repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 6px, transparent 6px 8px)',

/* Thick *actual* zigzag pattern */
thickzigzag: 'repeating-linear-gradient(135deg, currentColor 0 6px, transparent 6px 12px, currentColor 12px 18px, transparent 18px 24px)',

/* Small evenly spaced polka dots */
polkadot: 'radial-gradient(circle, currentColor 2px, transparent 2px) 0 0 / 10px 10px, radial-gradient(circle, currentColor 2px, transparent 2px) 5px 5px / 10px 10px',

/* Large evenly spaced dots */
largedots: 'radial-gradient(circle, currentColor 5px, transparent 5px) 0 0 / 20px 20px, radial-gradient(circle, currentColor 5px, transparent 5px) 10px 10px / 20px 20px',

/* Crisscrossed diagonal lines (two repeating diagonals) */
crosshatch: 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 10px)',

/*
 Honeycomb approximation:
 Two angles of repeating stripes can produce a hex-like grid.
 Adjust angles and spacing for more or less “honeycomb” effect.
*/
honeycomb: 'repeating-linear-gradient(60deg, currentColor 0 2px, transparent 2px 20px), repeating-linear-gradient(120deg, currentColor 0 2px, transparent 2px 20px)',

/* Tiny dot-like “confetti” (repeated small radial dots) */
confetti: 'radial-gradient(circle, currentColor 1px, transparent 2px) 2px 2px / 6px 6px',

/*
 Bubble-like effect with ringed circles.
 More accurately resembles “bubbles” than overlapping filled circles.
*/
bubbles: 'radial-gradient(circle, transparent 4px, currentColor 5px, transparent 6px) 0 0 / 20px 20px, radial-gradient(circle, transparent 4px, currentColor 5px, transparent 6px) 10px 10px / 20px 20px',

/*
 Overlapping tartan-style lines.
 Using repeating-linear-gradient ensures lines repeat nicely.
*/
tartan: 'repeating-linear-gradient(0deg, currentColor 0 2px, transparent 2px 20px), repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 20px)',

/* Radial kaleidoscopic slices */
kaleidoscope: 'conic-gradient(from 0deg, currentColor 10%, transparent 10%)',

/* Dashed diagonal lines (short dash segments) */
dashes: 'repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 6px)',

/* Standard grid lines */
grid: 'repeating-linear-gradient(currentColor 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 20px)',

/* Checkerboard squares (repeating pattern for a 2D checker effect) */
checkerboard: 'repeating-linear-gradient(45deg, currentColor 0 25%, transparent 25% 50%, currentColor 50% 75%, transparent 75% 100%)',

/* Angled bars/slashes */
angledbars: 'repeating-linear-gradient(45deg, currentColor 0 25px, transparent 25px 50px)',

/* Radiating “rays” pattern */
rays: 'conic-gradient(from 0deg at center, currentColor 10%, transparent 10%)',

/* Mesh-style fine grid */
mesh: 'repeating-linear-gradient(currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 10px)',

/* Fading gradient mask */
fademask: 'linear-gradient(to bottom, transparent, currentColor 50%, transparent)',

/* Halftone-style dots (two radial layers) */
halftone: 'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0 / 6px 6px, radial-gradient(circle, transparent 3px, currentColor 3px) 3px 3px / 6px 6px',

/* Sparkle-like effect (two different small radial sizes, offset) */
sparkle: 'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0 / 10px 10px, radial-gradient(circle, currentColor 2px, transparent 2px) 5px 5px / 10px 10px',

/* Smooth left-to-right fade from color to transparent */
fade: 'linear-gradient(90deg, currentColor 0%, transparent 100%)',

/* Prism-like diagonal squares */
prism: 'repeating-linear-gradient(135deg, currentColor 0 25%, transparent 25% 50%, currentColor 50% 75%, transparent 75% 100%)',

/* 1. Vertical Stripes (narrow stripes running vertically) */
verticalstripes: 'repeating-linear-gradient(to top, currentColor 0 5px, transparent 5px 10px)',

/* 2. Horizontal Stripes (narrow stripes running horizontally) */
horizontalstripes: 'repeating-linear-gradient(to right, currentColor 0 5px, transparent 5px 10px)',

/* 3. Herringbone (two diagonal repeats offset) */
herringbone: 'repeating-linear-gradient(135deg, currentColor 0 10px, transparent 10px 20px), repeating-linear-gradient(225deg, currentColor 0 10px, transparent 10px 20px)',

/* 4. Triangles (small isosceles triangles from diagonal stripes) */
triangles: 'repeating-linear-gradient(45deg, currentColor 0 10px, transparent 10px 20px), repeating-linear-gradient(-45deg, currentColor 0 10px, transparent 10px 20px)',

/* 5. Diamond */
diamond: 'repeating-linear-gradient(45deg, currentColor 0 10px, transparent 10px 20px), repeating-linear-gradient(-45deg, currentColor 0 10px, transparent 10px 20px)',

/* 6. Plaid (vertical & horizontal stripes) */
plaid: 'repeating-linear-gradient(to right, currentColor 0 4px, transparent 4px 8px), repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 8px)',

/* 7. Star Field (approximate with small radial dots) */
stars: 'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0 / 20px 20px, radial-gradient(circle, currentColor 1px, transparent 1px) 10px 10px / 20px 20px, radial-gradient(circle, currentColor 1px, transparent 1px) 5px 15px / 20px 20px',

/* 8. Diamond Lattice (open diamonds) */
diamondlattice: 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 15px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 15px)',

/* 9. Spiral (conic-gradient trick) */
spiral: 'conic-gradient(from 0deg at center, currentColor 10%, transparent 10% 20%, currentColor 20% 30%, transparent 30% 40%, currentColor 40% 50%, transparent 50% 60%, currentColor 60% 70%, transparent 70% 80%, currentColor 80% 90%, transparent 90% 100%)',

/* 10. Woven (basketweave style) */
woven: 'repeating-linear-gradient(to right, currentColor 0 8px, transparent 8px 16px), repeating-linear-gradient(to bottom, currentColor 0 8px, transparent 8px 16px)',

/* 11. Shattered (“broken glass” style) */
shattered: 'repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(180deg, currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(225deg, currentColor 0 1px, transparent 1px 10px)',

/* 12. Mosaic Triangles */
mosaictriangles: 'repeating-linear-gradient(60deg, currentColor 0 12px, transparent 12px 24px), repeating-linear-gradient(120deg, currentColor 0 12px, transparent 12px 24px)',

/* 13. Offset Zigzag */
offsetzigzag: 'repeating-linear-gradient(135deg, currentColor 0 3px, transparent 3px 6px), repeating-linear-gradient(45deg, currentColor 0 3px, transparent 3px 6px)',

/* Was “sinewaves,” but actually horizontal stripes */
horizontalbars: 'repeating-linear-gradient(0deg, currentColor 0 8px, transparent 8px 16px)',

/* 15. Mixed Halftone */
mixedhalftone: 'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0 / 6px 6px, radial-gradient(circle, currentColor 2px, transparent 2px) 3px 3px / 12px 12px',

/* 16. Plastic (soft highlight bands) */
plastic: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at 50% 8%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)',

/* 17. Aluminum (fine repeating lines + subtle vertical gradient) */
aluminum: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 3px), linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.1))',

/* 18. Soft Touch (slight radial shading) */
softtouch: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.02), rgba(0,0,0,0.05))',

/* 19. Chrome (strong transitions for reflective look) */
chrome: 'linear-gradient(to bottom, #f0f0f0 0%, #ccc 20%, #fff 30%, #999 50%, #eee 60%, #666 80%, #fff 100%)',

/* 20. Satin (soft radial highlights + base color) */
satin: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2), transparent), radial-gradient(circle at 65% 65%, rgba(255,255,255,0.15), transparent), currentColor',

/* Moiré pattern: do not touch as requested */
moire: 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 2px), repeating-linear-gradient(44deg, currentColor 0 1px, transparent 1px 2px)',

/* 22. 3D Cubes (repeating triangles for hex/cube illusions) */
threeDcubes: 'repeating-linear-gradient(0deg, currentColor 0 20px, transparent 20px 40px), repeating-linear-gradient(60deg, currentColor 0 20px, transparent 20px 40px), repeating-linear-gradient(120deg, currentColor 0 20px, transparent 20px 40px)',

/* 23. Glitch (multi-angle stripes for a noisy, glitchy look) */
glitch: 'repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 8px), repeating-linear-gradient(45deg, currentColor 0 3px, transparent 3px 12px)',

velvetFade: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05), transparent 70%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05), transparent 80%), linear-gradient(to bottom right, transparent 30%, currentColor 70%)',

velvetMoire: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05), transparent 70%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05), transparent 80%), repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 6px), repeating-linear-gradient(44deg, currentColor 0 1px, transparent 1px 6px)',

liquidContours: 'radial-gradient(circle, rgba(255,255,255,0.05) 0 10%, transparent 10% 20%, currentColor 20% 30%, rgba(0,0,0,0.05) 30% 40%, transparent 40% 50%, rgba(255,255,255,0.05) 50% 60%, currentColor 60% 70%, rgba(0,0,0,0.05) 70% 80%, transparent 80% 90%, rgba(255,255,255,0.05) 90% 100%)',
   

   


  }

}
  