// utils/MusicManager.js
export let music = null;

export function toggleMusic(scene) {
  if (!window.__music) {
    window.__music = scene.sound.add("bgMusic", { loop: true, volume: 0.8 });
    window.__music.play();
  } else {
    if (window.__music.isPlaying) {
      window.__music.pause();
    } else {
      window.__music.resume();
    }
  }
}
