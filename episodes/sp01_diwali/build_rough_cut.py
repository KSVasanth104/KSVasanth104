#!/usr/bin/env python3
"""Build the rough cut for the Diwali Special from frames/ + voice/.

Steps: trim silence from each voice line and speed it up slightly, lay the lines
on a timeline, give each still frame a slow Ken Burns move, burn in captions,
and mix the voices over a soft synthesized drone and a closing bell.

Usage: python3 build_rough_cut.py [workdir]
Outputs (next to this script): rough_cut.mp4, subtitles.srt
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, ".build")
os.makedirs(WORK, exist_ok=True)

W, H, FPS = 1080, 1920, 30
TEMPO = 1.10          # slight speed-up to keep the Short near 60s
GAP = 0.25            # silence between lines inside a shot
SHOT_PAD = 0.35       # breathing room at the end of each shot
LEAD = 0.5            # silence before the very first line

# (shot, [(voice file, speaker, caption)], camera move)
SHOTS = [
    (1, [("sp01_l01_narakasura.mp3", "NARAKASURA", "Mother... let the world... light lamps for me.")], "in"),
    (2, [("sp01_l02_paati.mp3", "PAATI", "A demon's last wish... is why we light lamps on Diwali."),
         ("sp01_l03_raghu.mp3", "RAGHU", "A demon wanted lamps, Paati?")], "out"),
    (3, [("sp01_l04_paati.mp3", "PAATI", "Listen, kanna. Narakasura, son of Mother Earth, had a boon. No one could kill him... except his own mother.")], "up"),
    (4, [("sp01_l05_paati.mp3", "PAATI", "Drunk on power, he spread darkness... and locked away sixteen thousand women.")], "in"),
    (5, [("sp01_l06_paati.mp3", "PAATI", "So Krishna came, with Queen Satyabhama... Mother Earth herself, born again.")], "down"),
    (6, [("sp01_l07_paati.mp3", "PAATI", "In battle, Krishna stepped back... and smiled. This fight was hers.")], "in"),
    (7, [("sp01_l08_satyabhama.mp3", "SATYABHAMA", "Your darkness ends today, Naraka!")], "fast"),
    (8, [("sp01_l09_narakasura.mp3", "NARAKASURA", "Mother...?"),
         ("sp01_l10_paati.mp3", "PAATI", "With his last breath, he knew her. And he asked for only one thing... light.")], "in"),
    (9, [("sp01_l11_paati.mp3", "PAATI", "At dawn, the prisoners walked free... and every home lit a lamp.")], "up"),
    (10, [("sp01_l12_raghu.mp3", "RAGHU", "So even darkness wished for light..."),
          ("sp01_l13_paati.mp3", "PAATI", "No darkness is so deep that one small lamp cannot end it. Happy Diwali, kanna.")], "in"),
]
END_HOLD = 1.8        # extra hold on the last frame (peacock-feather reveal + bell)


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", path],
                         check=True, capture_output=True, text=True).stdout
    return float(json.loads(out)["format"]["duration"])


def ts(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}"


def ass_ts(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


# 1. Clean voice lines: trim edge silence, cap inner pauses at ~0.3s, apply tempo.
trim = ("silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
        "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,"
        "silenceremove=stop_periods=-1:stop_duration=0.32:stop_threshold=-42dB:stop_silence=0.32,"
        f"atempo={TEMPO}")
clean = {}
for _, lines, _ in SHOTS:
    for f, _, _ in lines:
        out = os.path.join(WORK, f.replace(".mp3", ".wav"))
        run(["ffmpeg", "-y", "-i", os.path.join(HERE, "voice", f), "-af", trim, "-ar", "48000", "-ac", "2", out])
        clean[f] = (out, duration(out))

# 2. Timeline.
t = LEAD
shot_times, cues = [], []
for i, (shot, lines, move) in enumerate(SHOTS):
    start = 0.0 if i == 0 else t
    for j, (f, who, text) in enumerate(lines):
        if j:
            t += GAP
        d = clean[f][1]
        cues.append((t, t + d, f, who, text))
        t += d
    t += SHOT_PAD
    if i == len(SHOTS) - 1:
        t += END_HOLD
    shot_times.append((shot, start, t, move))
TOTAL = t

# 3. Subtitles (.srt for the editor, .ass for burn-in).
with open(os.path.join(HERE, "subtitles.srt"), "w") as fh:
    for n, (a, b, _, who, text) in enumerate(cues, 1):
        fh.write(f"{n}\n{ts(a)} --> {ts(b)}\n{text}\n\n")

ass = os.path.join(WORK, "subs.ass")
with open(ass, "w") as fh:
    fh.write(f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,DejaVu Sans,58,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,5,2,2,90,90,430,1
Style: Divine,DejaVu Sans,58,&H0060E8FF,&H0060E8FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,5,2,2,90,90,430,1
Style: Hook,DejaVu Serif,74,&H0060E8FF,&H0060E8FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,6,3,8,70,70,200,1
Style: End,DejaVu Serif,92,&H0060E8FF,&H0060E8FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,6,3,8,70,70,220,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""")
    fh.write(f"Dialogue: 1,{ass_ts(0)},{ass_ts(shot_times[1][2])},Hook,,0,0,0,,{{\\fad(300,300)}}WHY DO WE LIGHT\\NLAMPS ON DIWALI?\n")
    for a, b, _, who, text in cues:
        style = "Divine" if who in ("SATYABHAMA",) else "Cap"
        fh.write(f"Dialogue: 0,{ass_ts(a)},{ass_ts(b)},{style},,0,0,0,,{text}\n")
    fh.write(f"Dialogue: 1,{ass_ts(TOTAL - END_HOLD - 0.4)},{ass_ts(TOTAL)},End,,0,0,0,,{{\\fad(400,0)}}Happy Diwali\n")

# 4. Video: one Ken Burns clip per frame.
clips = []
for shot, a, b, move in shot_times:
    d = b - a
    n = int(round(d * FPS))
    z = {"in": f"1.0+0.12*on/{n}", "out": f"1.12-0.12*on/{n}", "fast": f"1.0+0.22*on/{n}",
         "up": "1.10", "down": "1.10"}[move]
    if move == "up":
        x, y = "(iw-iw/zoom)/2", f"(ih-ih/zoom)*(1-on/{n})"
    elif move == "down":
        x, y = "(iw-iw/zoom)/2", f"(ih-ih/zoom)*on/{n}"
    else:
        x, y = "(iw-iw/zoom)/2", "(ih-ih/zoom)/2"
    out = os.path.join(WORK, f"clip{shot:02d}.mp4")
    fade_out = max(d - 0.25, 0)
    vf = (f"scale={W*2}:{H*2}:flags=lanczos,"
          f"zoompan=z='{z}':x='{x}':y='{y}':d={n}:s={W}x{H}:fps={FPS},"
          f"fade=t=in:st=0:d=0.25,fade=t=out:st={fade_out:.3f}:d=0.25,format=yuv420p")
    run(["ffmpeg", "-y", "-loop", "1", "-i", os.path.join(HERE, "frames", f"shot{shot:02d}.png"),
         "-vf", vf, "-frames:v", str(n), "-c:v", "libx264", "-preset", "medium", "-crf", "20", out])
    clips.append(out)

concat = os.path.join(WORK, "concat.txt")
with open(concat, "w") as fh:
    fh.writelines(f"file '{c}'\n" for c in clips)
silent = os.path.join(WORK, "video_silent.mp4")
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat, "-c", "copy", silent])

# 5. Audio: voices + drone + closing bell.
inputs, filters, labels = [], [], []
for k, (a, _, f, _, _) in enumerate(cues):
    inputs += ["-i", clean[f][0]]
    ms = int(a * 1000)
    filters.append(f"[{k}:a]adelay={ms}|{ms},volume=1.6[v{k}]")
    labels.append(f"[v{k}]")
nv = len(cues)
drone = (f"aevalsrc='0.05*sin(2*PI*130.81*t)+0.035*sin(2*PI*196.0*t)+0.03*sin(2*PI*261.63*t)"
         f"+0.012*sin(2*PI*392.0*t)*(0.6+0.4*sin(2*PI*0.25*t))':s=48000:d={TOTAL:.2f}")
filters.append(f"{drone},aformat=channel_layouts=stereo,afade=t=in:d=2,afade=t=out:st={TOTAL-2.5:.2f}:d=2.5[dr]")
bell_t = TOTAL - END_HOLD - 0.4
filters.append(f"aevalsrc='0.35*sin(2*PI*1318.5*t)*exp(-2.2*t)+0.2*sin(2*PI*2637*t)*exp(-3.5*t)':s=48000:d=2.5,"
               f"aformat=channel_layouts=stereo,adelay={int(bell_t*1000)}|{int(bell_t*1000)}[bell]")
filters.append("".join(labels) + f"[dr][bell]amix=inputs={nv + 2}:normalize=0,alimiter=limit=0.95[aout]")
audio = os.path.join(WORK, "mix.m4a")
run(["ffmpeg", "-y", *inputs, "-filter_complex", ";".join(filters), "-map", "[aout]",
     "-t", f"{TOTAL:.2f}", "-c:a", "aac", "-b:a", "192k", audio])

# 6. Burn captions and mux.
final = os.path.join(HERE, "rough_cut.mp4")
run(["ffmpeg", "-y", "-i", silent, "-i", audio, "-vf", f"ass={ass}", "-c:v", "libx264", "-preset", "medium",
     "-crf", "21", "-c:a", "copy", "-shortest", "-movflags", "+faststart", final])

print(f"total {TOTAL:.2f}s")
for shot, a, b, move in shot_times:
    print(f"shot{shot:02d} {a:6.2f} -> {b:6.2f}  ({b-a:.2f}s, {move})")
