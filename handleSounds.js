let currentAudio = null;
let currentActiveButton = null;

function createSoundButtons(soundFiles) {
  const container = document.getElementById("buttonsContainer");
  container.innerHTML = ""; // Clear any existing content

  soundFiles.forEach((fileName, index) => {
    // Create a button element
    const button = document.createElement("button");
    button.className = "sound-button";
    button.innerText = fileName;

    button.addEventListener("click", () => {
      currentActiveButton && currentActiveButton.classList.remove("active");
      currentActiveButton = button;
      currentActiveButton.classList.add("active");

      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset the audio to the beginning
      }

      // Create a new Audio object for the clicked sound
      currentAudio = new Audio(`sounds/${fileName}.ogg`);
      currentAudio.type = "audio/ogg";
      currentAudio.play();
    });

    // Append the button and audio elements to the container
    container.appendChild(button);
    // container.appendChild(audio);
  });
}

// Fetch the JSON file and create sound buttons
async function loadNames() {
  try {
    const res = await fetch("soundNames.json");
    const data = await res.json();

    createSoundButtons(data);
  } catch (err) {
    console.error("Error loading sound files:", err);
  }
}

loadNames();
