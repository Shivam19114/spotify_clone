console.log("Spotify player booting");

let currentSong = new Audio();
let songs = [];
let currFolder = "";

const SONG_LIBRARY = {
  "90s": { "title": "90s songs", "description": "Hits 90s bollywood songs", "songs": ["Barsaat_Ke_Mausam_Mein.mp3", "Chalte_Chalte_Mere_Yeh_Geet.mp3", "Choli_ke_Peeche_Kya_Hai.mp3", "Chura_Ke_Dil_Mera.mp3", "Duniya_Mein_Aaye.mp3", "Main_Yahaan_Hoon.mp3", "Mere_Mehboob_Mere_Sanam.mp3", "Uncha_Lamba_Kad.mp3"] },
  "Arjit singh": { "title": "Arjit singh", "description": "Best songs of Arjit singh", "songs": ["_Milne_Hai_Mujhse_Aayi.mp3", "Ae_Dil_Hai_Mushkil.mp3", "Apna_Bana_Le.mp3", "Bekhayali.mp3", "Dil_Sambhal_Ja_Zara.mp3", "Pal.mp3", "Pal_Pal_Dil_Ke_Paas.mp3", "Sajni.mp3", "Tainu_Khabar_Nah.mp3", "Tera_Yaar_Hoon_Main.mp3"] },
  "Arman malik": { "title": "Armaan malik", "description": "Best of Armaan malik", "songs": ["BOL_DO_NA_ZARA.mp3", "CHALE_AANA.mp3", "Dil_Mein_Ho_Tum.mp3", "Ghar_Se_Nikalte_Hi.mp3", "Hua_Hai_Aaj_Pehli_Baar.mp3", "JAB_TAK.mp3", "Mujhko_Barsaat_Bana_Lo.mp3", "WAJAH_TUM_HO.mp3", "Zara_Thehro.mp3"] },
  "Badsah": { "title": "Badshah", "description": "Badshah all hit songs", "songs": ["Bad_Boy_X_Bad_Girl.mp3", "Driving_Slow.mp3", "Gone_Girl.mp3", "Jugnu.mp3", "Morni___Badshah__.mp3", "O_Sajna__Official_song.mp3", "Sajna.mp3", "Sheher_Ki_Ladki_Song.mp3", "Tauba___Official_Music.mp3", "ZAALIM__Official_Music_.mp3"] },
  "Bhojpuri": { "title": "Bhojpuri songs", "description": "Hit Bhojpuri songs", "songs": ["Chhalakata_Hamro_Jawaniya_-_PAWAN_Singh.mp3", "Choliya_Ke_Hook_Raja_Ji___Bhojpuri_Song(48k).mp3", "Cooler_Kurti_Me_Laga_La.mp3", "KHESARI_LAL_YADAV_SUPERHIT_MOVIE_SONG_-_Saj_Ke_Sawar_Ke.mp3", "Lagelu_Horha_Ke_Chana___Bhojpuri_Song(48k).mp3", "Neelkamal_Singh_New_Song___Heroine__Bhojpuri_Gana(48k).mp3", "Pagal_Banaibe___bhojpurisong(48k).mp3", "Pahin_Ke_Chali_Bikini___Bhojpuri_Hit_Song(48k).mp3", "Palang_Sagwan_Ke___fULL_SONG_Song(48k).mp3", "Patna_Mein_Du_Du_Go_Flat_Chahi.mp3", "Pawan_Singh_New_Song_2025___Arrah_Ke_Othlali.mp3"] },
  "Hart Touching": { "title": "Hart touching", "description": "Feel this Hart touching songs", "songs": ["Aashiqui_Aa_Gayi__,_Arijit_Singh___Bhushan_K(48k).mp3", "Awari_Full_Video_Song.mp3", "Banjaara_Full_Video_Song.mp3", "Dil__Shreya_s_Version__Lyrical.mp3", "Janiye.mp3", "Kaifi_Khalil_-_Kahani_Suno_2.0.mp3", "Mahi_Aaja__Akshay_Kumar.mp3", "Sanam_Teri_Kasam.mp3", "Toota_Jo_Kabhi_Tara.mp3"] },
  "Honey singh": { "title": "Yo Yo honey singh", "description": "Honey singh new hit songs", "songs": ["_One_Bottle_Down__FULL_SONG.mp3", "Blue_Eyes_Full_Video_Song.mp3", "Dheere_Dheere_Se_Meri_Zindagi_Song_.mp3", "Love_Does__Official_Hindi_Songs_2024(48k).mp3", "LYRICAL__Desi_Kalakaar_Full_Song.mp3", "MANIAC__Official_Video___YO_YO_HONEY_SINGH.mp3", "MILLIONAIRE_SONG__Full_song.mp3", "Party_All_Night_Feat._Honey_Singh__Full_song.mp3", "Party_With_The_Bhoothnath_Song__Official.mp3", "PAYAL_SONG__Official_song.mp3"] },
  "jubin nautiyal": { "title": "Jubin nautiyal", "description": "Jubin nautiyal top songs playlist", "songs": ["Barsaat_Ki_Dhun_Song.mp3", "Bewafa_Tera_Masoom_Chehra.mp3", "Dil_Galti_Kar_Baitha_Ha.mp3", "Full_Song___Bezubaan_Kab_Se.mp3", "Lut_Gaye__Full_Song.mp3", "Meri_Aashiqui_Song.mp3", "Official_Video__Humnava_Mere_Song.mp3", "Video__Mast_Nazron_Se.mp3"] },
  "Rap": { "title": "Rap song", "description": "Top hit Rap songs", "songs": ["Dhanda_Nyoliwala_-_Russian_Bandana__Music.mp3", "Hustle___Jiya_Ho_Bihar_Ke_Lala!(48k).mp3", "Jaadugar___Paradox___Hustle_2.0(48k).mp3", "Kasoor___Bassick___(256k).mp3", "Kho_Na_Jaun___Bassick___(256k).mp3", "Kothi_bangle_wali___Mad_Trip___MTV_Hustle_4(48k).mp3", "Naina_ki_Talwar___MC_SQUARE___Hustle_2.0(48k).mp3", "Rihaayi___Paradox__(256k).mp3", "VICTORY_ANTHEM-__[Official_Audio](48k).mp3", "WOH.mp3", "Yeda_Yung_Mashup___2025___Bollywood_Rap_MUSIC(48k).mp3"] },
  "Subh": { "title": "Subh", "description": "Best of Subh", "songs": ["Billo_Gutt_Te_Paranda_Tera_Karda_Kamal_Ni___Shubh.mp3", "Elevated__Official_Audio__-_Shubh(48k).mp3", "Shubh_-_Bars__Official_Music_Video_(48k).mp3", "Shubh_-_Cheques__Official_Music_Video_(48k).mp3", "Shubh_-_Fell_For_You__Official_Audio_(48k).mp3", "We_Rollin__Official_Audio__-_Shubh(48k).mp3"] }
};

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function normalizeFolder(folder) {
  return folder.replace(/^\/?songs\/?/i, "").replace(/^\/+|\/+$/g, "");
}

function fileUrlPart(text) {
  return encodeURIComponent(text).replace(/%2F/gi, "/");
}

function trackPath(folder, track) {
  return `songs/${fileUrlPart(folder)}/${fileUrlPart(track)}`;
}

function coverPath(folder) {
  return `songs/${fileUrlPart(folder)}/cover.jpg`;
}

function setSongListUI() {
  let songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";

  songs.forEach((song) => {
    songUL.innerHTML += `
      <li>
        <img class="invert" width="34" src="img/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <br>
          <div>${currFolder} song</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
  });

  Array.from(document.querySelectorAll(".songList li")).forEach((li) => {
    li.addEventListener("click", () => {
      const track = li.querySelector(".info div").innerHTML.trim();
      playMusic(track);
    });
  });
}

function getSongs(folder) {
  currFolder = normalizeFolder(folder);
  const album = SONG_LIBRARY[currFolder];
  songs = album ? [...album.songs] : [];
  setSongListUI();
  return songs;
}

function playMusic(track, pause = false) {
  currentSong.src = trackPath(currFolder, track);
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

function getCurrentTrackName() {
  try {
    const parts = new URL(currentSong.src).pathname.split("/");
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    const parts = currentSong.src.split("/");
    return decodeURIComponent(parts[parts.length - 1] || "");
  }
}

function displayAlbums() {
  const cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  Object.entries(SONG_LIBRARY).forEach(([folder, info]) => {
    cardContainer.innerHTML += `
      <div data-folder="${folder}" class="card">
        <div class="play">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M5 20V4L19 12L5 20Z" fill="#000"></path>
          </svg>
        </div>
        <img src="${coverPath(folder)}" alt="${info.title}">
        <h2>${info.title}</h2>
        <p>${info.description}</p>
      </div>`;
  });

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      songs = getSongs(`songs/${card.dataset.folder}`);
      if (songs.length > 0) playMusic(songs[0]);
    });
  });
}

function main() {
  const albumKeys = Object.keys(SONG_LIBRARY);
  if (albumKeys.length === 0) {
    document.querySelector(".cardContainer").innerHTML = "<p>No songs found in library.</p>";
    return;
  }

  getSongs("songs/90s");
  if (songs.length > 0) playMusic(songs[0], true);

  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
      document.querySelector(".circle").style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
    }
  });

  currentSong.addEventListener("ended", () => {
    let index = songs.indexOf(getCurrentTrackName());
    if (index < 0) index = 0;
    let newIndex = (index + 1) % songs.length;
    playMusic(songs[newIndex]);
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const box = e.target.getBoundingClientRect();
    let percent = (e.offsetX / box.width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    if (!isNaN(currentSong.duration)) {
      currentSong.currentTime = (currentSong.duration * percent) / 100;
    }
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    if (!songs.length) return;
    let index = songs.indexOf(getCurrentTrackName());
    if (index < 0) index = 0;
    let newIndex = (index - 1 + songs.length) % songs.length;
    playMusic(songs[newIndex]);
  });

  next.addEventListener("click", () => {
    if (!songs.length) return;
    let index = songs.indexOf(getCurrentTrackName());
    if (index < 0) index = 0;
    let newIndex = (index + 1) % songs.length;
    playMusic(songs[newIndex]);
  });

  const volumeInput = document.querySelector(".range input");
  volumeInput.value = 10;
  currentSong.volume = 0.1;

  volumeInput.addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
    document.querySelector(".volume img").src =
      currentSong.volume > 0 ? "img/volume.svg" : "img/mute.svg";
  });

  document.querySelector(".volume img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = "img/mute.svg";
      currentSong.volume = 0;
      volumeInput.value = 0;
    } else {
      e.target.src = "img/volume.svg";
      currentSong.volume = 0.1;
      volumeInput.value = 10;
    }
  });
}

main();
