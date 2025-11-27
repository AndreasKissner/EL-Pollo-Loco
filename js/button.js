/**
 * Toggles game sound and saves the mute state.
 */
function toggleSound() {
    SoundManager.toggleMute();
    const icon = document.getElementById('sound-icon');
    icon.src = SoundManager.isMuted ? 'img/volume_off.png' : 'img/volume_on.png';
    localStorage.setItem('soundMuted', SoundManager.isMuted);
}

/**
 * Shows or hides the keyboard help overlay.
 */
function toggleKeyboardInfo() {
    const box = document.getElementById('keyboardInstructions')
    const overlay = document.getElementById('keyboardOverlay')

    box.classList.toggle('hidden')
    overlay.classList.toggle('hidden')
}
