// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId = "4d47f7f7b6234523bba1a4aa4824f505";

export async function initializeApp(): Promise<any> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("location : ", window.location.origin);
    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        const tracks_long = await fetchTopTrack(accessToken, "long_term");
        const tracks_medium = await fetchTopTrack(accessToken, "medium_term");
        const tracks_short = await fetchTopTrack(accessToken, "short_term");
        const artists_long = await fetchTopArtist(accessToken, "long_term");
        const artists_medium = await fetchTopArtist(accessToken, "medium_term");
        const artists_short = await fetchTopArtist(accessToken, "short_term");
        console.log(artists_long);
        displayArtist(artists_long, "longArtist");
        // displayArtist(tracks_medium, "mediumArtist");
        // displayArtist(tracks_short, "shortArtist");
        displayTracks(tracks_long, "longSong");
        displayTracks(tracks_medium, "mediumSong");
        displayTracks(tracks_short, "shortSong");
    }
}

async function fetchProfile(code: string) {
    const result = await fetch("https://api.spotify.com/v1/me/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${code}`
        }
    });

    const data = await result.json();
    console.log(data);
    return data;
}

async function fetchTopTrack(code: string, time: string) {
    let TopTracks = [];
     
    for(let i=0; i<2; i++){
        const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=" + time, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${code}`
            }
        });
        const data = await result.json();
        TopTracks = TopTracks .concat(data.items);
    }
    console.log("TopTracks : ", time, " : ", TopTracks);
    return TopTracks;
}

async function fetchTopArtist(code: string, time: string) {
    let TopArtists = [];
     
    for(let i=0; i<1; i++){
        const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=20&offset=0&time_range=" + time, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${code}`
            }
        });
        const data = await result.json();
        TopArtists = TopArtists .concat(data.items);
    }
    console.log("TopArtists : ", time, " : ", TopArtists);
    return TopArtists;
}

async function fetchCurrentlyPlaying(code: string) {
    const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing?market=FR", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${code}`
        }
    });

    if (result.status === 204) {
        throw new Error("No currently playing content available.");
    }

    if (!result.ok) {
        throw new Error(`Error fetching currently playing content: ${result.status}`);
    }

    const data = await result.json();

    if (!data) {
        throw new Error("Empty response from Spotify API");
    }

    console.log("CurrentPlay : ", data);
    return data;
}

function displayProfile(profile: UserProfile) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("profilePicture")!.setAttribute("src", profile.images[1].url);
    document.getElementById("email")!.innerText = profile.email;
}

function displayTracks(tracks: Tracks, query: string) {
    const queryDiv = document.getElementById(query);
    for (let i = 0; i < tracks.length; i++) {
        const albumName = tracks[i].album.name;
        const artistName = tracks[i].album.artists[0].name;
        const sonName = tracks[i].name;
        const artistSpotifyLink = tracks[i].album.artists[0].external_urls.spotify;
        const sonSpotifyLink = tracks[i].external_urls.spotify;
        const imageSrc = tracks[i].album.images[0].url;

        // Création d'un élément <div> pour chaque élément avec la classe "element"
        const paragraph = document.createElement('div');
        paragraph.className = 'element';

        const trackNumberSpan = document.createElement('span');
        trackNumberSpan.innerText = `${i + 1}`;
        trackNumberSpan.className = 'track-number';
        paragraph.appendChild(trackNumberSpan);

        const image = document.createElement('img');
        image.src = imageSrc;
        image.alt = sonName;
        image.className = 'track-image';
        paragraph.appendChild(image);

        // Ajout de l'élément <a> pour le nom du son
        const sonNameLink = document.createElement('a');
        sonNameLink.href = sonSpotifyLink;
        sonNameLink.target = '_blank';
        sonNameLink.innerText = sonName;
        sonNameLink.className = 'son-name';
        paragraph.appendChild(sonNameLink);

        // Création d'un élément <div> pour le nom de l'artiste et le nom de l'album avec la classe "element-info"
        const artistAndAlbumDiv = document.createElement('div');
        artistAndAlbumDiv.className = 'element-info';

        // Création d'un élément <a> pour le nom de l'artiste
        const artistNameLink = document.createElement('a');
        artistNameLink.href = artistSpotifyLink;
        artistNameLink.target = '_blank';
        artistNameLink.innerText = artistName;
        artistNameLink.className = 'artist-name';
        artistAndAlbumDiv.appendChild(artistNameLink);

        // Création d'un élément <span> pour le nom de l'album
        const albumNameSpan = document.createElement('span');
        albumNameSpan.innerText = albumName;
        albumNameSpan.className = 'album-name';
        artistAndAlbumDiv.appendChild(albumNameSpan);

        // Ajout de l'élément <div> avec la classe "element-info" au paragraphe
        paragraph.appendChild(artistAndAlbumDiv);

        queryDiv.appendChild(paragraph);
    }
}
function displayArtist(tracks: Tracks, query: string) {
    const queryDiv = document.getElementById(query);
    console.log("queryDiv : ", queryDiv);

    for (let i = 0; i < tracks.length; i++) {
        const albumName = tracks[i].album.name;
        const artistName = tracks[i].album.artists[0].name;
        const sonName = tracks[i].name;
        const artistSpotifyLink = tracks[i].album.artists[0].external_urls.spotify;
        const sonSpotifyLink = tracks[i].external_urls.spotify;
        const imageSrc = tracks[i].album.images[0].url;

        // Création d'un élément <div> pour chaque élément avec la classe "element"
        const paragraph = document.createElement('div');
        paragraph.className = 'element';

        const trackNumberSpan = document.createElement('span');
        trackNumberSpan.innerText = `${i + 1}`;
        trackNumberSpan.className = 'track-number';
        paragraph.appendChild(trackNumberSpan);

        // Création d'un élément <a> pour le nom du son
        const sonNameLink = document.createElement('a');
        sonNameLink.href = sonSpotifyLink;
        sonNameLink.target = '_blank';
        sonNameLink.innerText = sonName;
        sonNameLink.className = 'son-name';
        paragraph.appendChild(sonNameLink);

        // Création d'un élément <a> pour l'image et le nom de l'artiste
        const artistLink = document.createElement('a');
        artistLink.href = artistSpotifyLink;
        artistLink.target = '_blank';
        artistLink.className = 'artist-link';

        // Ajout de l'élément <img> pour l'image
        const image = document.createElement('img');
        image.src = imageSrc;
        image.alt = sonName;
        image.className = 'track-image';
        artistLink.appendChild(image);

        // Ajout de l'élément <span> pour le nom de l'artiste
        const artistNameSpan = document.createElement('span');
        artistNameSpan.innerText = artistName;
        artistNameSpan.className = 'artist-name';
        artistLink.appendChild(artistNameSpan);

        // Ajout de l'élément <a> au paragraphe
        paragraph.appendChild(artistLink);

        queryDiv.appendChild(paragraph);
    }
}



