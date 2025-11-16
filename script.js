// === ENTER Fullscreen ===
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    }
}

// === EXIT Fullscreen ===
function exitFullscreen() {
    if (document.fullscreenElement) {
        return document.exitFullscreen();
    }
}

// === TOGGLE Fullscreen ===
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        enterFullscreen(element);
    } else {
        exitFullscreen();
    }
}
