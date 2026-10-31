# LuminaGlass — Liquid Glass & Browser Audio Lab

**Author:** Pooya Goodarzi  
**Live site:** https://pooya16pg-spec.github.io/lumina-glass/

LuminaGlass is a client-side visual and audio experiment inspired by spatial glass interfaces.

## Optical studio
- Interactive SVG-based glass geometry, theme controls, optical parameters, and local preset storage in the running app state.
- PNG export renders the current optical configuration through the browser canvas.
- The prompt field is saved as preset metadata; it does not call an AI image-generation service.

## Audio lab
- Five browser-native Web Audio filters process the built-in oscillator synth, a user-selected local audio file, or a microphone stream.
- AudioContext is resumed from the user's playback action.
- Stopping audio releases oscillator nodes, microphone tracks, the AudioContext, and temporary object URLs created for uploaded files.
- Microphone access requires browser permission and a secure context (HTTPS or localhost).

## Deployment and stack
- Next.js 14 static export deployed to GitHub Pages.
- React 18, TypeScript, Tailwind CSS, SVG/Canvas, and the Web Audio API.
- No remote audio processing, server-side AI generation, user account, or cloud preset database is included.
