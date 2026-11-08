# Edit Plan: Diwali Special "The Demon's Last Wish"

## What's in this folder
| Path | What it is |
|---|---|
| `rough_cut.mp4` | 1080×1920, 30fps, ~66s. Still frames with Ken Burns moves, all voices, burned-in captions, a soft drone and a closing bell |
| `frames/shot01–10.png` | Storyboard frames (Higgsfield GPT Image 2.6, 752×1344) |
| `voice/sp01_lXX_*.mp3` | 13 ElevenLabs voice lines (raw, untrimmed) |
| `subtitles.srt` | Caption timings that match the rough cut |
| `build_rough_cut.py` | Rebuilds the rough cut: `python3 build_rough_cut.py [scratch_dir]` |

The rough cut is a complete, postable video. The steps below are the polish pass in CapCut.

## CapCut polish
1. **Music:** replace the synthesized drone with a soft flute or tanpura track (Krishna = flute). Keep it about −20 dB under the voices,
   swell it at shot 7 (arrow) and resolve it into a bell at shot 10.
2. **SFX:** crackling fire (shot 1), wing whoosh (shot 5), bow-string twang plus arrow whoosh (shot 7), a soft heartbeat under
   "Mother…?" (shot 8), distant crackers and a temple bell (shots 9–10).
3. **Divine glow:** add a gold glow/bloom when Krishna appears (shots 5–6) and on the arrow (shots 7–8).
4. **Reverb:** a slight reverb on Satyabhama's line (bible §6: divine voices get light reverb).
5. **Captions:** captions are already burned in. To use CapCut's animated captions instead, re-export without the
   `ass=` burn-in step and import `subtitles.srt`.
6. **Animate (optional):** replace each still with a Midjourney or Higgsfield image-to-video clip using the motion prompts
   in `script.md`. Save the clips as `clips/shotXX.mp4`.

## Getting under 60 seconds (bible target)
The cut runs ~66s. Pick one of these if you want ≤60s:
- Cut Raghu's question in shot 2 (−2.6s) and start Paati's L04 directly.
- Drop "Happy Diwali, kanna." from L13 and let the on-screen text carry it (−1.5s).
- Speed the voice track to 1.08× in CapCut (−5s).
YouTube Shorts and Reels both accept up to 3 minutes, so 66s will still post as a Short.

## Attribution
ElevenLabs voices: if you are on the free plan, credit ElevenLabs in the description and do not monetise (bible §6).
