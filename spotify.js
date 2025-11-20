// Print a message to the console to confirm the script is running
console.log('Lets write JavaScript');

// Create an Audio object to control audio playback
let currentSong = new Audio();

// Store all song names fetched from a folder
let songs = [];

// Keep track of which folder is currently active
let currFolder = "";

/* 
Convert seconds (from song duration or current time)
into a readable "mm:ss" format, e.g., 02:35 
*/
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

/* 
Fetch all songs (MP3 files) from a specific folder on the server.
This populates the song list dynamically.
*/
async function getSongs(folder) {
    currFolder = folder;
    // Fetch directory contents (this assumes a directory listing is available)
    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    // Create a temporary element to parse HTML content
    let div = document.createElement("div");
    div.innerHTML = response;

    // Get all anchor tags (links to files)
    let as = div.getElementsByTagName("a");
    songs = [];

    // Loop through all links to find .mp3 files
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {

            // Normalize slashes to avoid bugs on different OSes
            let clean = element.href
                .replace(/%5C/gi, "/")   // correct encoded backslashes
                .replace(/\\/g, "/");    // correct raw backslashes

            // Extract the file name from the full path
            let fileName = clean.split("/").pop();

            songs.push(fileName);
        }
    }

    // Update HTML list of songs
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    // Display each song in the list with play button and info
    songs.forEach(song => {
        songUL.innerHTML += `
        <li>
            <img class="invert" width="34" src="img/music.svg">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <br>
                <div>${folder.replace("songs/", "")} song</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg">
            </div>
        </li>`;
    });

    // Add click listener to play selected song when clicked
    Array.from(document.querySelectorAll(".songList li")).forEach(li => {
        li.addEventListener("click", () => {
            let track = li.querySelector(".info div").innerHTML.trim();
            playMusic(track);
        });
    });

    return songs;
}

/*
Play a given track. If pause=true, load song but don’t auto-play.
*/
const playMusic = (track, pause = false) => {

    // Normalize slashes in path
    track = track.replace(/\\/g, "/");

    // Construct path to selected song
    currentSong.src = `/${currFolder}/` + track;

    // Play song automatically unless told to pause
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    // Update UI with current song info and reset time display
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

/*
Fetch and display all available albums (folders) from /songs/
Each album is represented by 'info.json' and a cover image.
*/
async function displayAlbums() {
    console.log("displaying albums");

    let req = await fetch("/songs/");
    let text = await req.text();
    let div = document.createElement("div");
    div.innerHTML = text;

    // Parse anchor elements to discover album folders
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    console.log("Links found:", anchors.length);

    for (let e of anchors) {
        // Decode folder URL
        let raw = decodeURIComponent(e.getAttribute("href"));

        // Skip if not a valid songs folder
        console.log("Raw Link:", raw);
        if (!raw.includes("songs")) continue;

        // Extract folder name
        let folder = raw.split("songs")[1];
        folder = folder.replace(/\\/g, "");
        folder = folder.replace(/\//g, "");

        console.log("Correct Folder:", folder);

        // Try to load album metadata
        try {
            let meta = await fetch(`/songs/${folder}/info.json`);
            let info = await meta.json();

            // Create album card with cover, title, and description
            cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M5 20V4L19 12L5 20Z" fill="#000"/>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${info.title}</h2>
            <p>${info.description}</p>
        </div>`;
        } catch (err) {
            console.log("info.json missing for:", folder);
        }
    }

    // Add click functionality to album cards
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            console.log("Fetching Songs");
            songs = await getSongs(`songs/${card.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

/*
Main function that initializes the player.
*/
async function main() {

    // Load default folder 'ncs' but don’t play immediately
    await getSongs("songs/90s");
    playMusic(songs[0], true);

    // Display available albums
    await displayAlbums();

    // Handle play/pause button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Update song progress and time as it plays
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        // Move progress circle based on current time
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Auto play next song when current song ends
    currentSong.addEventListener("ended", () => {
        let index = songs.indexOf(currentSong.src.split("/").pop());

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            // If last song ends → start again from first
            playMusic(songs[0]);
        }
    });


    // Seek functionality (jump to position when user clicks progress bar)
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Sidebar open (hamburger icon)
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Sidebar close (X icon)
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous song button - circular navigation
    previous.addEventListener("click", () => {
        currentSong.pause();

        let current = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(current);

        // If at first song, wrap around to the last
        let newIndex = (index - 1 + songs.length) % songs.length;
        playMusic(songs[newIndex]);
    });

    // Next song button - circular navigation
    next.addEventListener("click", () => {
        currentSong.pause();

        let current = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(current);

        // Wrap around to the first if at the end
        let newIndex = (index + 1) % songs.length;
        playMusic(songs[newIndex]);
    });

    // Volume control slider
    document.querySelector(".range input").addEventListener("change", e => {
        currentSong.volume = e.target.value / 100;

        // Update icon to mute/unmute dynamically
        document.querySelector(".volume img").src =
            currentSong.volume > 0 ? "img/volume.svg" : "img/mute.svg";
    });

    // Mute/unmute toggle icon
    document.querySelector(".volume img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = "img/mute.svg";
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = "img/volume.svg";
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        }
    });
}

// Execute the main setup when page loads
main();
