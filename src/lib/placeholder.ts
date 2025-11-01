// This is a simple SVG placeholder for cars
// You can replace this with actual car images
export const placeholderCarImage = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f3f4f6"/>
  <g transform="translate(100 75)">
    <!-- Car body -->
    <rect x="20" y="80" width="160" height="60" fill="#4a5568" rx="10"/>
    <!-- Car roof -->
    <rect x="40" y="40" width="120" height="40" fill="#4a5568" rx="8"/>
    <!-- Windows -->
    <rect x="50" y="50" width="30" height="20" fill="#e2e8f0" rx="2"/>
    <rect x="120" y="50" width="30" height="20" fill="#e2e8f0" rx="2"/>
    <!-- Wheels -->
    <circle cx="50" cy="150" r="15" fill="#2d3748"/>
    <circle cx="150" cy="150" r="15" fill="#2d3748"/>
    <circle cx="50" cy="150" r="8" fill="#4a5568"/>
    <circle cx="150" cy="150" r="8" fill="#4a5568"/>
  </g>
  <text x="200" y="200" font-family="Arial" font-size="14" fill="#6b7280" text-anchor="middle">
    No Image Available
  </text>
</svg>
`)}`;