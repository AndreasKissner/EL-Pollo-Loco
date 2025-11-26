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
function toggleKeyboardOverlay() {
    const overlay = document.getElementById("screenOverlay");
    const box = document.getElementById("keyboardInstructions");
    overlay.classList.toggle("hidden");
    box.classList.toggle("hidden");
    if (!box.classList.contains("hidden")) {
        document.body.appendChild(box);
    }
    overlay.onclick = () => {
        overlay.classList.add("hidden");
        box.classList.add("hidden");
    };
}



