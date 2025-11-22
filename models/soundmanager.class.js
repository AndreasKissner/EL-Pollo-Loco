class SoundManager {

    static audioCache = {};
    static isMuted = false;
    static masterVolume = 1; 
    static backgroundMusic = null;
    static currentMusicName = null;
    static currentMusicVolume = 0.3;

    static loadSounds(soundPaths) {
        for (const name in soundPaths) {
            const audio = new Audio(soundPaths[name]);
            audio.volume = 0.5;
            audio.preload = "auto";
            audio.autoplay = false;
            SoundManager.audioCache[name] = audio;
        }
        console.log("AudioManager: Sounds erfolgreich vorgeladen.");
    }

    /**
     * SICHERES SOUND-PLAY:
     * - Keine Unterbrechungen mehr
     * - Keine play/pause Konflikte
     * - Chrome wirft keine Fehler mehr
     */
    static play(name, volume = 1) {

        if (SoundManager.masterVolume === 0) return;

        const audio = SoundManager.audioCache[name];
        if (!audio) return;

        // WICHTIG: Wenn Sound gerade spielt → NICHT erneut starten
        if (!audio.paused) return;

        // Zeit nur zurücksetzen wenn pausiert
        audio.currentTime = 0;

        audio.volume = 0.5 * volume * SoundManager.masterVolume;

        audio.play().catch(err => {
            console.warn(`Play-Fehler bei ${name}:`, err);
        });
    }


    static startBackgroundMusic(name, volume = 0.3) {

        SoundManager.currentMusicVolume = volume;

        if (SoundManager.isMuted) return;

        const audio = SoundManager.audioCache[name];
        if (!audio) {
            console.warn(`Musik '${name}' nicht gefunden.`);
            return;
        }

        // Falls andere Musik läuft → stoppen
        if (SoundManager.backgroundMusic && SoundManager.backgroundMusic !== audio) {
            SoundManager.stopBackgroundMusic();
        }

        // Wenn Musik schon spielt → nichts tun
        if (SoundManager.backgroundMusic === audio && !audio.paused) return;

        audio.loop = true;
        audio.volume = volume * SoundManager.masterVolume;

        audio.play().catch(e => console.warn("Musik-Start Fehler:", e));

        SoundManager.backgroundMusic = audio;
        SoundManager.currentMusicName = name;
    }


    static stopBackgroundMusic() {
        if (SoundManager.backgroundMusic) {
            SoundManager.backgroundMusic.pause();
            SoundManager.backgroundMusic.currentTime = 0;
        }
        SoundManager.backgroundMusic = null;
        SoundManager.currentMusicName = null;
    }


    /**
     * Toggle-Mute – nur Volume ändern!  
     * KEIN pause() mehr → KEINE Chrome-Bugs!
     */
    static toggleMute() {
        SoundManager.isMuted = !SoundManager.isMuted;
        SoundManager.masterVolume = SoundManager.isMuted ? 0 : 1;

        console.log("Mute:", SoundManager.isMuted);

        // Musik nur leiser/höher stellen
        if (SoundManager.backgroundMusic) {
            SoundManager.backgroundMusic.volume =
                SoundManager.currentMusicVolume * SoundManager.masterVolume;

            if (!SoundManager.isMuted && SoundManager.backgroundMusic.paused) {
                SoundManager.backgroundMusic.play().catch(e => console.warn(e));
            }
        }
    }
}
