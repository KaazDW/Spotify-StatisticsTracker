import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId  = "...";
export function checkAccessToken() {
    const cookies = document.cookie.split('; ');
    const accessTokenCookie = cookies.find(row => row.startsWith('access_token='));
    if (!accessTokenCookie) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const access_token = accessTokenCookie.split('=')[1];
        return access_token;
    }
}
export async function initializeApp(): Promise<any> {

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
        redirectToAuthCodeFlow(clientId);
        return;
    }

    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    displayProfile({profile: profile});
    const tracks_long = await fetchTopTrack(accessToken, "long_term");
    const artists_long = await fetchTopArtist(accessToken, "long_term");
    displayArtists({artists: artists_long, query: "longArtists"});
    displayTracks({tracks: tracks_long, query: "longSongs"});
    const tracks_medium = await fetchTopTrack(accessToken, "medium_term");
    const artists_medium = await fetchTopArtist(accessToken, "medium_term");
    displayArtists({artists: artists_medium, query: "mediumArtists"});
    displayTracks({tracks: tracks_medium, query: "mediumSongs"});
    const tracks_short = await fetchTopTrack(accessToken, "short_term");
    const artists_short = await fetchTopArtist(accessToken, "short_term");
    displayArtists({artists: artists_short, query: "shortArtists"});
    displayTracks({tracks: tracks_short, query: "shortSongs"});
    // console.log(JSON.stringify(artists_long, null, 2));
}

async function fetchProfile(code: string) {
    const result = await fetch("https://api.spotify.com/v1/me/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${code}`
        }
    });

    const data = await result.json();
    // console.log(data);
    return data;
}

async function fetchTopTrack(code: string, time: string) {
    let TopTracks: any[] = [];

    for (let i = 0; i < 2; i++) {
        const result = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&offset=${i * 50}&time_range=` + time, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${code}`
            }
        });
        const data = await result.json();
        TopTracks = TopTracks.concat(data.items);
    }
    // console.log("TopTracks : ", time, " : ", TopTracks);
    return TopTracks;
}

async function fetchTopArtist(code: string, time: string) {
    let TopArtists: any[] = [];

    const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=3&offset=0&time_range=" + time, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${code}`
        }
    });
    const data = await result.json();
    TopArtists = TopArtists.concat(data.items);

    // console.log("TopArtists : ", time, " : ", TopArtists);
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

    return data;
}

function displayProfile({profile}: { profile: any }) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    try {
        document.getElementById("profilePicture")!.setAttribute("src", profile.images[1].url);
    } catch (error) {
        console.error("An error occurred while setting the profile picture: ", error);
        redirectToAuthCodeFlow(clientId);
    }
    document.getElementById("email")!.innerText = profile.email;
}

function displayTracks({tracks, query}: { tracks: any, query: string }) {
    const queryDiv = document.getElementById(query);
    for (let i = 0; i < tracks.length; i++) {
        const albumName = tracks[i].album.name;
        const artistName = tracks[i].album.artists[0].name;
        const sonName = tracks[i].name;
        const artistSpotifyLink = tracks[i].album.artists[0].external_urls.spotify;
        const sonSpotifyLink = tracks[i].external_urls.spotify;
        const imageSrc = tracks[i].album.images[0].url;

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

        const sonNameLink = document.createElement('a');
        sonNameLink.href = sonSpotifyLink;
        sonNameLink.target = '_blank';
        sonNameLink.innerText = sonName;
        sonNameLink.className = 'son-name';
        paragraph.appendChild(sonNameLink);

        const artistNameLink = document.createElement('a');
        artistNameLink.href = artistSpotifyLink;
        artistNameLink.target = '_blank';
        artistNameLink.innerText = artistName;
        artistNameLink.className = 'artist-name';
        paragraph.appendChild(artistNameLink);

        const albumNameSpan = document.createElement('span');
        albumNameSpan.innerText = albumName;
        albumNameSpan.className = 'album-name dnone';
        paragraph.appendChild(albumNameSpan);

        // Create a link to the song's Spotify page with the Spotify logo as its content
        const spotifyLogoLink = document.createElement('a');
        spotifyLogoLink.href = sonSpotifyLink;
        spotifyLogoLink.target = '_blank';
        spotifyLogoLink.className = 'spotify-logo-link';

        const spotifyLogoImg = document.createElement('img');
        spotifyLogoImg.src = 'https://raw.githubusercontent.com/KaazDW/Spotify-Stats-Tracks/main/public/spotify.svg';
        spotifyLogoImg.alt = 'Spotify logo';
        spotifyLogoImg.className = 'spotify-logo dnone';

        spotifyLogoLink.appendChild(spotifyLogoImg);

        paragraph.appendChild(spotifyLogoLink);

        if(queryDiv) queryDiv.appendChild(paragraph);
    }
}

function displayArtists({artists, query}: { artists: any, query: string }) {
    const queryDiv = document.getElementById(query);
    for (let i = 0; i < artists.length; i++) {
        if (!artists[i] || !artists[i].external_urls || !artists[i].images || artists[i].images.length < 3 || !artists[i].name) {
            console.error(`Artiste invalide à l'indice ${i}`);
            continue;
        }

        const artistLink = document.createElement('a');
        artistLink.href = artists[i].external_urls.spotify;
        artistLink.target = '_blank';

        const artistImage = document.createElement('img');
        if (artists[i].images[2]) {
            artistImage.src = artists[i].images[2].url;
            artistImage.alt = artists[i].name;
        } else {
            console.error(`L'artiste ${artists[i].name} n'a pas d'image disponible.`);
        }

        const artistDiv = document.createElement('div');

        const spotifyLogoImg = document.createElement('img');
        spotifyLogoImg.src = 'https://raw.githubusercontent.com/KaazDW/Spotify-Stats-Tracks/main/public/spotify.svg';
        spotifyLogoImg.alt = 'Spotify logo';
        spotifyLogoImg.className = 'spotify-logo-artist';

        artistDiv.appendChild(spotifyLogoImg);
        const artistNumberSpan = document.createElement('span');
        artistNumberSpan.innerText = `${i + 1}. `;
        artistNumberSpan.className = 'artist-number';
        artistDiv.appendChild(artistNumberSpan);

        const artistNameSpan = document.createElement('span');
        artistNameSpan.textContent = artists[i].name;
        artistDiv.appendChild(artistNameSpan);

        artistLink.appendChild(artistImage);
        artistLink.appendChild(artistDiv);

        if(queryDiv) queryDiv.appendChild(artistLink);
    }
}
