# Diwali Mom

A 42-second vertical (1080x1920, 30 fps) animated short built with [Remotion](https://www.remotion.dev/)
and hand-built SVG characters: a 38 s story plus a 4 s "Happy Diwali" end card.
The finished render is at `out/diwali-mom.mp4`.

## Preview and render

```bash
npm install            # once
npx remotion studio    # live preview with a scrubbable timeline (http://localhost:3000)
npm run render         # renders out/diwali-mom.mp4
```

Other useful commands:

| Command | What it does |
|---|---|
| `npm run render:scene1` | Renders only scene 1 to `out/scene1.mp4` (quick look check) |
| `npx remotion still DiwaliMom out/still.png --frame=400` | Exports a single frame |
| `npx remotion render DiwaliMom out/part.mp4 --frames=330-449` | Renders a frame range (here, scene 4) |
| `npm run typecheck` | TypeScript check |

If Remotion cannot download its own headless Chrome (e.g. on an offline machine), point it at
any Chrome or Chromium binary: `--browser-executable=/path/to/chrome`.

In Studio there are three compositions: **DiwaliMom** (the film), **Scene1Preview** (first 3 s) and
**CharacterSheet** (both rigs with expressions, for design tweaks).

## Project layout

```
src/
  theme.ts            colours: COLD and WARM environment palettes (same keys) + character colours + grade
  timeline.ts         scene start/end frames, dissolves, captions, palette switch, end fade
  audio.ts            placeholder music slot (null = silent render)
  DiwaliMom.tsx       main composition: scenes, colour grade, dust, vignette, grain, captions
  characters/
    Mom.tsx  Son.tsx  rigged characters (one reusable component each)
    types.ts          shared props: pose, arms, face, head turn/tilt, walk, breathing...
    coords.ts         worldToChar(): aim a hand at a point in the scene
  rig/
    Arm.tsx           upper-arm → forearm → hand groups with 2-bone IK (or explicit elbow)
    Face.tsx          eyes (blink, look, squint, sparkle, tears), brows, morphing mouth
    HandProp.tsx      spoon, ladle, puri, laddoo
  components/         Camera/Stage, Diya (flickering flame + glow), Atmosphere, Captions, EndCard
  sets/               DiningRoom, BedroomTopDown, Doorway, Kitchen, BedroomFront, Props
  scenes/             Scene1.tsx … Scene8.tsx (one component per scene)
```

## How things work

- **Palette crossfade.** Every set reads its colours from `useMood().palette`, which is
  `mixPalette(warmth)`. Warmth goes 0 → 1 over `WARM_SWITCH` (when the door opens in scene 4).
  A whole-frame grade (desaturated blue wash → soft golden wash) is crossfaded at the same time.
- **Character rigs.** Mom and Son are drawn front-facing with the feet at (0, 0). Each is built
  from separate groups: `lower-body`, `upper-body` › `torso`, `head` › `face` (eyes, brows, mouth),
  `arm-left` / `arm-right` › `upper-arm` › `forearm` › `hand`. Props:
  - `pose`: `stand | sit | kneel | lie`, `seatDrop` to bow further forward
  - `armL` / `armR`: `{to, elbow?, handAngle?, prop?, flatHand?}` (hand targets in the character's
    standing coordinates; `worldToChar()` converts from scene pixels)
  - `face`: `smile`, `open`, `eyeOpen`, `closedStyle`, `look`, `brow`, `sad`, `squint`, `sparkle`, `tears`
  - `headTurn`, `headTilt`, `headBob`, `lean`, `breathe`, `walk` (cycle phase)
  - blinking and breathing run automatically from `frame` and `seed`
  - `layer="arms"` draws only the arms, used to put hands on top of a table or bed
- **Scenes** use `useSceneFrame()` (frame relative to the scene start) and the `Shot` helper for
  sub-shots that dissolve into each other (scenes 5 and 7).
- **Captions** are large, bold and centred in the top third (y 250–650) with 90 px side margins,
  clear of the Shorts UI. Edit the text and timing in `timeline.ts`; `\n` forces a line break.

## Adding music

The render is silent on purpose (music goes on in CapCut). To bake a track in, put it in
`public/audio/` and set `MUSIC_FILE = 'audio/your-track.mp3'` in `src/audio.ts`.

## Scene timing

| # | Time | Frames | Beat |
|---|---|---|---|
| 1 | 0–3 s | 0–89 | Mom eats plain rice alone. *"Every night, the same quiet."* |
| 2 | 3–7 s | 90–209 | Spoon lifts slowly, camera pushes in on the empty chair. *"No one to cook for."* |
| 3 | 7–11 s | 210–329 | Top-down: Mom in bed staring at the ceiling, silent phone |
| 4 | 11–15 s | 330–449 | Doorbell, door opens, son is there, palette turns warm, diyas ignite. *"Diwali."* |
| 5 | 15–21 s | 450–629 | Montage: stirring, laughing, plating sweets, table filling up |
| 6 | 21–26 s | 630–779 | Eating together. *"Same kitchen. Different taste."* |
| 7 | 26–32 s | 780–959 | She makes the bed for him, unrolls a mat, lies down. *"She slept on the floor. And smiled."* |
| 8 | 32–38 s | 960–1139 | Pull-back to the son asleep in her bed, fade to black. *"Mothers don't cook for taste. They cook for you."* |
| End | 38–42 s | 1140–1259 | A diya lights in the dark. **Happy Diwali** · *"Go home this year. Someone has been waiting by the door."* (edit in `END_CARD`, `timeline.ts`) |
