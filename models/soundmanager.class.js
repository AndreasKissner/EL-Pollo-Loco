class SoundManager {

    // Alle geladenen Sounds
    static audioCache = {};

    // Mute Status
    static isMuted = false;

    // 🔥 NEU: Aktuell laufende Hintergrundmusik
    static backgroundMusic = null;
    static currentMusicName = null;

    /**
     * Lädt alle Sounddateien einmalig vor.
     */
    static loadSounds(soundPaths) {
        for (const name in soundPaths) {
            const path = soundPaths[name];
            const audio = new Audio(path);
            audio.volume = 0.5; // Grundlautstärke
            SoundManager.audioCache[name] = audio;
        }
        console.log("AudioManager: Sounds erfolgreich vorgeladen.");
    }

    /**
     * Spielt einen Einzelsound ab (z.B. jump, hurt).
     */
    static play(name, volume = 1) {
        if (SoundManager.isMuted) return;

        const audio = SoundManager.audioCache[name];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = SoundManager.audioCache[name].volume * volume;

            audio.play().catch(error => {
                console.warn(`Fehler beim Abspielen von ${name}:`, error);
            });
        } else {
            console.warn(`Sound '${name}' nicht gefunden.`);
        }
    }

    /**
     * 🔥 Jetzt mit sauberem Wechsel der Hintergrundmusik
     */
    static startBackgroundMusic(name, volume = 0.3) {
        if (SoundManager.isMuted) return;

        const audio = SoundManager.audioCache[name];
        if (!audio) {
            console.warn(`Musik-Sound '${name}' nicht gefunden.`);
            return;
        }

        // Wenn bereits Musik läuft → stoppen
        if (SoundManager.backgroundMusic) {
            SoundManager.backgroundMusic.pause();
            SoundManager.backgroundMusic.currentTime = 0;
        }

        // Neue Musik starten
        audio.loop = true;
        audio.volume = volume;

        audio.play().catch(error => {
            console.warn("Fehler beim Starten der Musik:", error);
        });

        SoundManager.backgroundMusic = audio;
        SoundManager.currentMusicName = name;
    }

    /**
     * 🔥 NEU: Stoppt die Hintergrundmusik sauber
     */
    static stopBackgroundMusic() {
        if (SoundManager.backgroundMusic) {
            SoundManager.backgroundMusic.pause();
            SoundManager.backgroundMusic.currentTime = 0;
            SoundManager.backgroundMusic = null;
            SoundManager.currentMusicName = null;
        }
    }

    /**
     * Mute ein/aus
     */
    static toggleMute() {
        SoundManager.isMuted = !SoundManager.isMuted;
        console.log(`SoundManager Mute: ${SoundManager.isMuted}`);
    }
}
