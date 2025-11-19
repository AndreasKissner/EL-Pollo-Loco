class SoundManager {
    // Statische Map zum Speichern der geladenen Audio-Objekte
    static audioCache = {};
    static isMuted = false;

    /**
     * Lädt alle Sounddateien einmalig vor.
     * @param {Object} soundPaths - Ein Objekt mit {name: path} Paaren.
     */
    static loadSounds(soundPaths) {
        for (const name in soundPaths) {
            const path = soundPaths[name];
            const audio = new Audio(path);
            // Empfohlen: Sounds leiser stellen, da Browser-Defaults oft zu laut sind
            audio.volume = 0.5; 
            SoundManager.audioCache[name] = audio;
        }
        console.log("AudioManager: Sounds erfolgreich vorgeladen.");
    }

    /**
     * Spielt einen Sound ab und startet ihn ggf. neu, wenn er bereits läuft.
     * @param {string} name - Der eindeutige Name des Sounds (z.B. 'jump').
     * @param {number} [volume=1] - Optionale Lautstärke (0 bis 1).
     */
    static play(name, volume = 1) {
        if (SoundManager.isMuted) {
            return;
        }

        const audio = SoundManager.audioCache[name];
        if (audio) {
            // Stoppt und setzt den Sound zurück, falls er noch läuft (verhindert Verzögerungen)
            audio.pause();
            audio.currentTime = 0;
            
            audio.volume = SoundManager.audioCache[name].volume * volume;
            audio.play().catch(error => {
                // Dies kann bei Autoplay-Regeln im Browser passieren.
                console.warn(`Fehler beim Abspielen von ${name}:`, error);
            });
        } else {
            console.warn(`Sound '${name}' nicht gefunden.`);
        }
    }

    /**
     * 🔥 NEUE FUNKTION: Startet die Hintergrundmusik im Loop.
     * @param {string} name - Der Name der Musikdatei.
     * @param {number} [volume=0.3] - Die Lautstärke.
     */
    static startBackgroundMusic(name, volume = 0.3) {
        if (SoundManager.isMuted) return;

        const audio = SoundManager.audioCache[name];
        if (audio) {
            audio.loop = true; // Wichtig: Endlosschleife aktivieren
            audio.volume = volume;
            audio.play().catch(error => {
                // Dies ist normal, wenn der Browser noch keine Interaktion hatte
                console.warn(`Fehler beim Starten der Musik:`, error);
            });
        } else {
            console.warn(`Musik-Sound '${name}' nicht gefunden.`);
        }
    }

    /**
     * Ändert den Mute-Status.
     */
    static toggleMute() {
        SoundManager.isMuted = !SoundManager.isMuted;
        console.log(`SoundManager Mute: ${SoundManager.isMuted}`);
    }
}  