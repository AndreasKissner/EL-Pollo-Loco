/**
 * Toggles the game sound on or off.
 * - Calls SoundManager.toggleMute() to switch the mute state.
 * - Updates the sound icon depending on whether the sound is muted.
 */
function toggleSound() {
    console.log('🔊 Sound Button clicked')
    SoundManager.toggleMute()
    const icon = document.getElementById('sound-icon')
    icon.src = SoundManager.isMuted ? 'img/volume_off.png' : 'img/volume_on.png'
}

/**
 * Toggles the visibility of the keyboard instruction box.
 */
function toggleKeyboardInfo() {
    const box = document.getElementById('keyboardInstructions')
    box.classList.toggle('hidden')
}
