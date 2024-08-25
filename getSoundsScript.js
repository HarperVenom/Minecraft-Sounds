const fs = require("fs");
const path = require("path");

// Path to the json file in minecraft folder ... /.minecraft/assets/indexes/{name}.json
const filePath =
  "C:/Users/Harper/AppData/Roaming/.minecraft/assets/indexes/17.json";

// Path to objects folder in minecraft assets
const sourceDir = "C:/Users/Harper/AppData/Roaming/.minecraft/assets/objects"; // Update this to your source directory

const soundsDir = path.join(__dirname, "sounds"); // Target folder in the script's directory
const soundNamesJson = path.join(__dirname, "soundNames.json");

if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir);
}

const sounds = [];

// Extract all sound hashes
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    const json = JSON.parse(data);

    Object.entries(json.objects).forEach(([key, value]) => {
      if (!key.endsWith(".ogg")) return;
      const sound = {};

      sound.name = formatString(key);
      sound.hash = value.hash;

      sounds.push(sound);
    });

    //Create json with all sound names
    fs.writeFile(
      soundNamesJson,
      JSON.stringify(sounds.map((sound) => sound.name)),
      "utf8",
      (err) => {
        if (err) {
          console.error("An error occurred while writing the JSON file:", err);
          return;
        }
        console.log("JSON file has been saved successfully.");
      }
    );

    copyFiles(sourceDir, soundsDir, sounds);
  } catch (parseErr) {
    console.error("Error parsing JSON:", parseErr);
  }
});

const formatString = (path) => {
  const parts = path.split("/").filter((part) => part);

  const filteredParts = parts.filter(
    (part) =>
      part.toLowerCase() !== "minecraft" && part.toLowerCase() !== "sounds"
  );

  const fileName = filteredParts.pop().replace(".ogg", "");

  const formattedName = filteredParts
    .map((part) => part.toUpperCase())
    .concat(fileName.replace(/_/g, " "))
    .join("_") 
    .toUpperCase(); 

  return formattedName;
};

const copyFiles = (source, target, sounds) => {
  fs.readdir(source, (err, items) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    items.forEach((item) => {
      const sourcePath = path.join(source, item);

      fs.stat(sourcePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isDirectory()) {
          copyFiles(sourcePath, target, sounds);
        } else {
          let currentSound;
          if (
            !sounds.some((sound) => {
              if (sound.hash === item) {
                currentSound = sound;
                return true;
              }
              return false;
            })
          )
            return;

          const targetPath = path.join(target, currentSound.name + ".ogg");
          fs.copyFile(sourcePath, targetPath, (err) => {
            if (err) {
              console.error("Error copying file:", err);
            } else {
              console.log(`Copied file: ${sourcePath} to ${targetPath}`);
            }
          });
        }
      });
    });
  });
};
