function enterFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    }
}

function exitFullscreen() {
    if (document.fullscreenElement) {
        return document.exitFullscreen();
    }
}

function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        enterFullscreen(element);
    } else {
        exitFullscreen();
    }
}
