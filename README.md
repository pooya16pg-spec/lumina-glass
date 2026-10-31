# LuminaGlass — Liquid Glass, Optics & Browser Audio Lab

**Author:** Pooya Goodarzi  
**Live site:** https://pooya16pg-spec.github.io/lumina-glass/

LuminaGlass is a browser-native exploration of spatial glass surfaces and hands-on audio processing.

## Optical studio
- Tune iridescence, fluidity, and crystal-layer complexity with a live SVG preview.
- Export the current optical state as a real PNG rendered with Canvas.
- Name and save optical presets, restore them later, or delete presets you no longer need.
- Presets and optical preferences persist in this browser's localStorage. The descriptive text field is preset metadata; it does not call an AI image-generation service.

## Audio lab
- Five Biquad filters process the built-in oscillator synth, a selected local audio file, or microphone input.
- Start from Flat, Warm, Clarity, or Cinematic EQ profiles, then tune each band manually.
- AudioContext is resumed from the user's playback action.
- Stopping or switching sources releases oscillator nodes, microphone tracks, AudioContext resources, and temporary file object URLs.
- EQ settings are saved locally; audio playback itself never resumes automatically after a reload.
- Microphone access requires browser permission and a secure context (HTTPS or localhost).

## Studio workflow
- Maintain a three-stage local task board (Backlog, In Progress, Completed).
- Add tasks, advance their status, and remove them.
- Task state is saved in this browser; it is not a cloud project-management service.

## Stack and deployment
Next.js 16 static export, React 19, TypeScript, Tailwind CSS, SVG/Canvas, Web Audio API, and localStorage. Hosted on GitHub Pages with no remote audio processing, server-side AI generation, account system, or cloud preset database.
