class GameVideo {

    constructor(videoId) {
        this.container = document.getElementById("cutscene-container");
        this.videoElement = document.getElementById(videoId);
        this.onFinishCallback = null;

        // Beim Ende des Videos automatisch verstecken
        this.videoElement.onended = () => {
            this.stop();
            if (this.onFinishCallback) {
                this.onFinishCallback();
            }
        window.location.reload();  
       window.location.href = "index.html";

        };
    }

    // Video + Container sichtbar machen (mit Fade-In)
    show() {
        this.container.style.pointerEvents = "all";
        this.container.style.opacity = "1";
    }

    hide() {
        this.container.style.opacity = "0";
        setTimeout(() => {
            this.container.style.pointerEvents = "none";
        }, 1000);
    }

    play(volume = 1) {
        this.show();
        this.videoElement.volume = volume;
        this.videoElement.currentTime = 0;
        this.videoElement.play();
    }

    stop() {
        this.videoElement.pause();
        this.hide();
    }

    onFinish(callback) {
        this.onFinishCallback = callback;
    }
}
