export const cssReset = `
/* CSS Reset */
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  line-height: 1.5;
  transition: all 0.3s ease; /* Smooth transitions */
  scroll-behavior: smooth; /* Smooth scrolling for anchored links */
}

body, h1, h2, h3, h4, p,
figure, blockquote, dl, dd {
  margin-block-end: 0;
}

ul[role='list'],
ol[role='list'] {
  list-style: none;
}

h1, h2, h3, h4,
button, input, label {
  line-height: 1.1;
}

h1, h2,
h3, h4 {
  text-wrap: balance;
}

a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

a {
  text-decoration: none; /* no underline */
}

img,
picture {
  max-width: 100%;
  display: block;
}

input, button,
textarea, select {
  font-family: inherit;
  font-size: inherit;
}

textarea:not([rows]) {
  min-height: 10em;
}

:target {
  scroll-margin-block: 5ex;
}

/* Added universal animations for better UI feedback */
*, *::before, *::after {
  transition: all 0.3s ease; /* Catch-all transition */
}
`;
