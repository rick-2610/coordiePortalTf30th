// src/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Import a cyberpunk-style font (e.g., from Google Fonts) */
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');


  body {
    margin: 0;
    background: #0D0D10; /* Very dark background */
    color: #00FFFF; /* Cyan/aqua for text */
    overflow: hidden; /* Hide scrollbars, especially for game */
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  #root, .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #1A0D2A 0%, #05010B 100%); /* Subtle dark gradient */
    color: #00FFFF; /* Main text color */
  }

  button {
    background: #2A0D4A; /* Dark purple button */
    color: #00FFFF; /* Cyan text */
    border: 2px solid #00FFFF; /* Cyan border */
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    &:hover {
      background: #00FFFF; /* Cyan on hover */
      color: #0D0D10; /* Dark text on hover */
      border-color: #00FFFF;
    }
    &:active {
      transform: translateY(1px);
    }
  }

  h1, h2, h3, h4, h5, h6 {
    color: #00FFFF; /* Consistent heading color */
    font-family: sans-serif; /* A more readable futuristic font for headings */
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5); /* Subtle glow */
  }

  /* Specific styles for the game area if needed */
  .game-area {
    border: 2px solid #00FFFF; /* Cyberpunk border */
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.7); /* Stronger glow for game */
    background: rgba(10, 0, 20, 0.7); /* Slightly transparent dark game background */
  }
`;

export default GlobalStyle;