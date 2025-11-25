/**
 * Requests fullscreen mode for the given element.
 * @param {HTMLElement} element - Element to display in fullscreen.
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    }
}

/**
 * Exits fullscreen mode if active.
 */
function exitFullscreen() {
    if (document.fullscreenElement) {
        return document.exitFullscreen();
    }
}

/**
 * Toggles between fullscreen and normal mode.
 * @param {HTMLElement} element - Element to toggle fullscreen for.
 */
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        enterFullscreen(element);
    } else {
        exitFullscreen();
    }
}
