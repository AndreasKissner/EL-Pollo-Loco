
/**
 * Toggles the game sound on or off and persists the state.
 * - Calls SoundManager.toggleMute() to switch the mute state.
 * - Updates the sound icon depending on whether the sound is muted.
 * - Saves the mute state to localStorage.
 */
function toggleSound() {
    SoundManager.toggleMute();
    const icon = document.getElementById('sound-icon');
    icon.src = SoundManager.isMuted ? 'img/volume_off.png' : 'img/volume_on.png';
    localStorage.setItem('soundMuted', SoundManager.isMuted);
}

function toggleKeyboardInfo() {
    const box = document.getElementById('keyboardInstructions')
    const overlay = document.getElementById('keyboardOverlay')

    box.classList.toggle('hidden')
    overlay.classList.toggle('hidden')
}
