/**
 * Handles all sound effects and background music for the game.
 */
class SoundManager {
    static audioCache = {}
    static isMuted = false
    static masterVolume = 1
    static backgroundMusic = null
    static currentMusicName = null
    static currentMusicVolume = 0.3

    /**
     * Preloads all audio files into cache.
     * @param {Object} soundPaths - Sound name → file path.
     */
    static loadSounds(soundPaths) {
        for (const name in soundPaths) {
            const audio = new Audio(soundPaths[name])
            audio.volume = 0.5
            audio.preload = 'auto'
            audio.autoplay = false
            SoundManager.audioCache[name] = audio
        }
    }

    /**
     * Safely plays a sound effect with volume control.
     * @param {string} name - Sound key.
     * @param {number} volume - Additional volume multiplier.
     */
    static play(name, volume = 1) {
        if (SoundManager.masterVolume === 0) return

        const audio = SoundManager.audioCache[name]
        if (!audio) return

        SoundManager.resetSound(audio)
        SoundManager.applyVolume(audio, volume)

        audio.play().catch(err => {
            console.warn(`Play-Fehler bei ${name}:`, err)
        })
    }

    /**
     * Stops & resets a sound before playing.
     */
    static resetSound(audio) {
        if (!audio.paused) audio.pause()
        audio.currentTime = 0
    }

    /**
     * Applies master + local volume.
     */
    static applyVolume(audio, volume) {
        audio.volume = 0.5 * volume * SoundManager.masterVolume
    }

    /**
     * Starts looping background music.
     * @param {string} name - Music key.
     * @param {number} volume - Music volume.
     */
    static startBackgroundMusic(name, volume = 0.3) {
        SoundManager.currentMusicVolume = volume
        SoundManager.currentMusicName = name
        const audio = SoundManager.audioCache[name]
        if (!audio) return
        if (
            SoundManager.backgroundMusic &&
            SoundManager.backgroundMusic !== audio
        ) {
            SoundManager.stopBackgroundMusic()
        }
        if (SoundManager.backgroundMusic === audio && !audio.paused) return
        SoundManager.configureMusic(audio, volume)
        SoundManager.backgroundMusic = audio
        if (!SoundManager.isMuted) {
            SoundManager.playMusic(audio)
        }
    }

    /**
     * Configures loop & volume for background music.
     */
    static configureMusic(audio, volume) {
        audio.loop = true
        audio.volume = volume * SoundManager.masterVolume
    }

    /**
     * Plays background music safely.
     */
    static playMusic(audio) {
        audio.play().catch(e => console.warn('Musik-Start Fehler:', e))
    }

    /**
     * Stops background music immediately.
     */
    static stopBackgroundMusic() {
        if (SoundManager.backgroundMusic) {
            SoundManager.backgroundMusic.pause()
            SoundManager.backgroundMusic.currentTime = 0
        }
        SoundManager.backgroundMusic = null
        SoundManager.currentMusicName = null
    }

    /**
     * Toggles mute state without pausing audio.
     */
    static toggleMute() {
        SoundManager.isMuted = !SoundManager.isMuted;
        SoundManager.masterVolume = SoundManager.isMuted ? 0 : 1;
        if (window.victoryVideo && window.victoryVideo.videoElement) {
            window.victoryVideo.videoElement.muted = SoundManager.isMuted;
        }
        if (SoundManager.backgroundMusic) {
            SoundManager.updateMusicVolume();
            SoundManager.resumeMusicIfNeeded();
        }
    }

    /**
     * Updates background music volume after mute toggle.
     */
    static updateMusicVolume() {
        SoundManager.backgroundMusic.volume =
            SoundManager.currentMusicVolume * SoundManager.masterVolume
    }

    /**
     * Resumes music after unmuting.
     */
    static resumeMusicIfNeeded() {
        if (!SoundManager.isMuted && SoundManager.backgroundMusic.paused) {
            SoundManager.backgroundMusic.play().catch(e => console.warn(e))
        }
    }
}
