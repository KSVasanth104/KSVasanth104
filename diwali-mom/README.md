# Diwali Mom

A 56-second vertical (1080x1920, 30 fps) animated short built with [Remotion](https://www.remotion.dev/)
and hand-built SVG characters: a 46 s story (including a flashback) plus a 10 s "Happy Diwali" end
card, with a Tamil
voice-over, a South Indian score and sound effects.
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
| `npx remotion render DiwaliMom out/part.mp4 --frames=510-629` | Renders a frame range (here, scene 4) |
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
  audio.ts            soundtrack cue sheet: Tamil voice lines, music cues, SFX, ducking
  DiwaliMom.tsx       main composition: scenes, colour grade, dust, vignette, grain, captions
  characters/
    Mom.tsx  Son.tsx  rigged characters (one reusable component each; Mom has a `young` look)
    Dad.tsx  Kid.tsx  the late husband and the son as a boy, for the flashback
    types.ts          shared props: pose, arms, face, head turn/tilt, walk, breathing...
    coords.ts         worldToChar(): aim a hand at a point in the scene
  rig/
    Arm.tsx           upper-arm → forearm → hand groups with 2-bone IK (or explicit elbow)
    Face.tsx          eyes (blink, look, squint, sparkle, tears), brows, morphing mouth
    HandProp.tsx      spoon, ladle, puri, laddoo
  components/         Camera/Stage, Diya, Crackers (flowerpot, sparkler, incense), Atmosphere, Captions, EndCard, Soundtrack
  sets/               DiningRoom, BedroomTopDown, Courtyard, Doorway, Kitchen, BedroomFront, Props
  scenes/             Scene1.tsx … Scene8.tsx, SceneMemory.tsx, SceneTears.tsx (one component per scene)
```

## How things work

- **Sad → happy, naturally.** The turn is built as a chain of motivated beats rather than one cut:
  the doorbell interrupts her tears (scene 3c), she walks to the door still wiping her eyes,
  and on opening it she goes through disbelief → recognition → tears → smile (scene 4). The
  outside of the door is festive all along (`outsideWarmth`), so opening it *lets the warmth in*;
  the room's palette (`WARM_SWITCH`) finishes warming only when her smile breaks through; and the
  festive music is heard muffled through the door, clears as it opens, stays soft through her
  tears and swells with her smile.
- **Palette crossfade.** Every set reads its colours from `useMood().palette`, which is
  `mixPalette(warmth)`. Warmth goes 0 → 1 over `WARM_SWITCH` (when the door opens in scene 4),
  and glows warm briefly during the memory (`MEMORY_GLOW`) before the present turns cold again.
  A whole-frame grade (desaturated blue wash → soft golden wash) is crossfaded at the same time.
- **Character rigs.** Mom and Son are drawn front-facing with the feet at (0, 0). Each is built
  from separate groups: `lower-body`, `upper-body` › `torso`, `head` › `face` (eyes, brows, mouth),
  `arm-left` / `arm-right` › `upper-arm` › `forearm` › `hand`. Props:
  - `pose`: `stand | sit | kneel | lie`, `seatDrop` to bow further forward
  - `armL` / `armR`: `{to, elbow?, handAngle?, prop?, flatHand?}` (hand targets in the character's
    standing coordinates; `worldToChar()` converts from scene pixels)
  - `face`: `smile`, `open`, `eyeOpen`, `closedStyle`, `look`, `brow`, `sad`, `squint`, `sparkle`, `tears`,
    `tearDrop` / `tearDrop2` (a tear rolling down each cheek, progress 0..1)
  - `headTurn`, `headTilt`, `headBob`, `lean`, `breathe`, `walk` (cycle phase)
  - blinking and breathing run automatically from `frame` and `seed`
  - `layer="arms"` draws only the arms, used to put hands on top of a table or bed
- **Scenes** use `useSceneFrame()` (frame relative to the scene start) and the `Shot` helper for
  sub-shots that dissolve into each other (scenes 5 and 7).
- **Captions** are large, bold and centred in the top third (y 250–650) with 90 px side margins,
  clear of the Shorts UI. Edit the text and timing in `timeline.ts`; `\n` forces a line break.

## Soundtrack (Tamil)

All audio was generated with ElevenLabs and lives in `public/audio/`:

| Folder | Contents |
|---|---|
| `raw/` | Every original take as downloaded (two takes per voice line) |
| `vo/` | Chosen voice lines, compressed and normalised to about -16 LUFS |
| `music/` | **A** lonely veena + tanpura (0–10 s, returns briefly for the tears), the festive cue **muffled like a distant memory** under the flashback (10–16 s), **B** festive nadaswaram + thavil: first heard muffled *through the closed door*, clearing as it opens, held soft through her tears and swelling when she smiles (18–34 s), **C** tender bansuri + veena to the end (34–56 s) |
| `sfx/` | Wall clock + crickets (scenes 1–3 and the tears), sparklers + flowerpot + family laughter (flashback), doorbell (rings at 16.5 s while she is in bed, again at 17 s), distant Diwali crackers (19–39 s) |

Voices: narrator **Vennila – Calm & Engaging Storyteller**, son **Muthu – Romantic, Warm & Shy** (`eleven_v4`).
Music: `eleven_music_v2_5`. SFX: `eleven_text_to_sound_v2`.

| Time | Speaker | Tamil | Meaning |
|---|---|---|---|
| 0.4 s | Narrator | ஒவ்வொரு ராத்திரியும்… அதே அமைதி. | Every night… the same quiet. |
| 3.6 s | Narrator | சமைச்சுப் போட… யாருமே இல்ல. | No one… to cook for. |
| 11.0 s | Narrator | ஒரு காலத்துல… இந்த வீடு முழுக்க சிரிப்பு சத்தம் தான். | Once… this whole house was full of laughter. |
| 20.1 s | Son | அம்மா! | Amma! |
| 22.2 s | Narrator | தீபாவளி. | Deepavali. |
| 29.9 s | Narrator | அதே சமையலறை… ஆனா ருசி வேற. | Same kitchen… but a different taste. |
| 36.8 s | Narrator | அவங்க தரையில தூங்கினாங்க… சிரிச்சுக்கிட்டே. | She slept on the floor… smiling. |
| 43.4 s | Narrator | அம்மா சமைக்கிறது ருசிக்காக இல்ல… உனக்காக. | A mother doesn't cook for taste… she cooks for you. |
| 47.0 s | Narrator | இனிய தீபாவளி நல்வாழ்த்துகள். இந்த வருஷம்… வீட்டுக்குப் போங்க. வாசல்லயே ஒருத்தங்க காத்துக்கிட்டு இருக்காங்க. | Happy Deepavali. This year… go home. Someone is waiting right at the door. |

**Changing the mix:** timings, volumes and fade envelopes are in `src/audio.ts`; the music ducks
automatically under every voice line (`DUCK`). To swap a take, change the mapping at the top of
`scripts/prepare-audio.sh` and run it (needs ffmpeg), then re-render.

**Licence note:** the ElevenLabs free plan is non-commercial and requires attribution
("Voice and music generated with ElevenLabs"). Upgrade before monetising the video.

## Scene timing

| # | Time | Frames | Beat |
|---|---|---|---|
| 1 | 0–3 s | 0–89 | Mom eats plain rice alone. *"Every night, the same quiet."* |
| 2 | 3–7 s | 90–209 | Spoon lifts slowly, camera pushes in on the empty chair. *"No one to cook for."* |
| 3 | 7–10 s | 210–299 | Top-down: Mom in bed, silent phone; her eyes drift and glisten |
| 3b | 10–15 s | 300–449 | **Memory** (golden, dreamy): years ago her husband lights a flowerpot, their boy jumps with a sparkler, young Mom claps and laughs. *"Once, this house was full of laughter."* |
| 3c | 15–17 s | 450–509 | Back in the dark bedroom: tears roll down; she closes her eyes… the doorbell rings and they snap open |
| 4 | 17–23 s | 510–689 | The reunion, in beats: she walks to the door wiping her tears → opens it (the festival outside spills in) → freezes in disbelief → he says *"Amma"* → hand to mouth, tears → the smile breaks through. The room warms with her face. *"Diwali."* |
| 5 | 23–29 s | 690–869 | Montage: stirring, laughing, plating sweets, table filling up |
| 6 | 29–34 s | 870–1019 | Eating together. *"Same kitchen. Different taste."* |
| 7 | 34–40 s | 1020–1199 | She makes the bed for him, unrolls a mat, lies down. *"She slept on the floor. And smiled."* |
| 8 | 40–46 s | 1200–1379 | Pull-back to the son asleep in her bed, fade to black. *"Mothers don't cook for taste. They cook for you."* |
| End | 46–56 s | 1380–1679 | A diya lights in the dark. **Happy Diwali** · *"Go home this year. Someone has been waiting by the door."* (edit in `END_CARD`, `timeline.ts`) |
