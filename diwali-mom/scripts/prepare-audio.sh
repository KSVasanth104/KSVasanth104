#!/bin/bash
# Turns the raw ElevenLabs downloads in public/audio/raw/ into the mix-ready files
# the film uses (public/audio/vo, music, sfx). Voice lines are loudness-normalised
# to -16 LUFS (light compression, true-peak limit); music and SFX get a fixed gain so their
# dynamics (quiet intro, swells) survive. Re-run after swapping a take.
set -euo pipefail
cd "$(dirname "$0")/../public/audio"
mkdir -p vo music sfx
enc=(-ar 48000 -ac 2 -c:a libmp3lame -b:a 256k)

# chosen takes (a/b) for each voice line
declare -A VO=(
  [01_every_night]=l1a  [02_no_one_to_cook_for]=l2b  [02b_memory_laughter]=l3a  [03_son_amma]=amma_a
  [04_deepavali]=l4a    [05_same_kitchen]=l5b        [06_slept_on_floor]=l6a
  [07_mothers_cook_for_you]=l7b  [08_happy_deepavali]=l8b
)
# extra make-up gain (dB) for soft takes so every line sits near -16 LUFS
declare -A TRIM=([01_every_night]=5 [04_deepavali]=3.5)
for name in "${!VO[@]}"; do
  ffmpeg -loglevel error -y -i "raw/${VO[$name]}.mp3" \
    -af "acompressor=threshold=-26dB:ratio=3.5:attack=5:release=90:makeup=4dB,loudnorm=I=-16:TP=-1.5:LRA=9,volume=${TRIM[$name]:-0}dB,alimiter=limit=0.89" \
    "${enc[@]}" "vo/$name.mp3"
done

ffmpeg -loglevel error -y -i raw/musicA.mp3 -af "volume=4dB,alimiter=limit=0.89" "${enc[@]}" music/a_lonely_veena.mp3
ffmpeg -loglevel error -y -i raw/musicB.mp3 -af "volume=-1dB,alimiter=limit=0.89" "${enc[@]}" music/b_festive_nadaswaram.mp3
ffmpeg -loglevel error -y -i raw/musicC.mp3 -af "volume=-1dB,alimiter=limit=0.89" "${enc[@]}" music/c_tender_flute.mp3
# the flashback hears the festive cue as a distant, muffled memory
ffmpeg -loglevel error -y -i raw/musicB.mp3 -af "atrim=0:6.5,lowpass=f=1400,aecho=0.8:0.75:70|140:0.35|0.22,volume=3dB,afade=t=in:d=0.6,afade=t=out:st=5.6:d=0.9,alimiter=limit=0.89" "${enc[@]}" music/memory_festive_muffled.mp3
ffmpeg -loglevel error -y -i raw/memory_sfx.mp3 -af "lowpass=f=6500,aecho=0.8:0.6:50:0.25,volume=-1dB,alimiter=limit=0.89" "${enc[@]}" sfx/memory_sparklers_laughter.mp3
ffmpeg -loglevel error -y -i raw/doorbell.mp3 -af "volume=-2dB" "${enc[@]}" sfx/doorbell.mp3
ffmpeg -loglevel error -y -i raw/night.mp3 -af "volume=6dB" "${enc[@]}" sfx/night_clock_crickets.mp3
ffmpeg -loglevel error -y -i raw/crackers.mp3 -af "volume=4dB" "${enc[@]}" sfx/distant_crackers.mp3
echo "audio ready"
