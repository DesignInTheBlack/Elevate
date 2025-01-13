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


}