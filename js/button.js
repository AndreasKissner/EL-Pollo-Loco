function toggleSound() {
    console.log("🔊 Sound Button geklickt");

    SoundManager.toggleMute();

    // ICON richtig aktualisieren – diesmal das IMG, nicht den Button!
    const icon = document.getElementById('sound-icon');
    icon.src = SoundManager.isMuted ? "img/volume_off.png" : "img/volume_on.png";
}

function toggleKeyboardInfo() {
    const box = document.getElementById('keyboardInstructions');
    box.classList.toggle('hidden');
}
