import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId  = "4d47f7f7b6234523bba1a4aa4824f505";
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
    console.log("location : ", window.location.origin);

    !checkAccessToken()

    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const tracks_long = await fetchTopTrack(accessToken, "long_term");
    const tracks_medium = await fetchTopTrack(accessToken, "medium_term");
    const tracks_short = await fetchTopTrack(accessToken, "short_term");
    const artists_long = await fetchTopArtist(accessToken, "long_term");
    const artists_medium = await fetchTopArtist(accessToken, "medium_term");
    const artists_short = await fetchTopArtist(accessToken, "short_term");
    console.log(JSON.stringify(artists_long, null, 2));
    displayProfile({profile: profile});
    displayArtists({artists: artists_long, query: "longArtists"});
    displayArtists({artists: artists_medium, query: "mediumArtists"});
    displayArtists({artists: artists_short, query: "shortArtists"});
    displayTracks({tracks: tracks_long, query: "longSongs"});
    displayTracks({tracks: tracks_medium, query: "mediumSongs"});
    displayTracks({tracks: tracks_short, query: "shortSongs"});
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
    let TopTracks: any[] = [];
     
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
    let TopArtists: any[] = [];
     
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

        const artistAndAlbumDiv = document.createElement('div');
        artistAndAlbumDiv.className = 'element-info';

        const artistNameLink = document.createElement('a');
        artistNameLink.href = artistSpotifyLink;
        artistNameLink.target = '_blank';
        artistNameLink.innerText = artistName;
        artistNameLink.className = 'artist-name';
        artistAndAlbumDiv.appendChild(artistNameLink);

        const albumNameSpan = document.createElement('span');
        albumNameSpan.innerText = albumName;
        albumNameSpan.className = 'album-name';
        artistAndAlbumDiv.appendChild(albumNameSpan);

        // Create a link to the song's Spotify page with the Spotify logo as its content
        const spotifyLogoLink = document.createElement('a');
        spotifyLogoLink.href = sonSpotifyLink;
        spotifyLogoLink.target = '_blank';

        const spotifyLogoImg = document.createElement('img');
        spotifyLogoImg.src = 'public/spotify.svg'; // replace with the actual path to your Spotify logo SVG file
        spotifyLogoImg.alt = 'Spotify logo';
        spotifyLogoImg.className = 'spotify-logo';

        spotifyLogoLink.appendChild(spotifyLogoImg);

        paragraph.appendChild(artistAndAlbumDiv);
        paragraph.appendChild(spotifyLogoLink);

        if(queryDiv) queryDiv.appendChild(paragraph);
    }
}
function displayArtists({artists, query}: { artists: any, query: string }) {
    const queryDiv = document.getElementById(query);
    console.log("artists.length ", artists.length);
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

        const artistName = document.createElement('p');

        const artistNumberSpan = document.createElement('span');
        artistNumberSpan.innerText = `${i + 1}. `;
        artistNumberSpan.className = 'artist-number';
        artistName.appendChild(artistNumberSpan);

        artistName.textContent += artists[i].name;

        artistLink.appendChild(artistImage);
        artistLink.appendChild(artistName);

        if(queryDiv) queryDiv.appendChild(artistLink);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('test')
    const disconnectButton = document.getElementById("disconnect");
    if (disconnectButton) {
        disconnectButton.addEventListener("click", () => {
            document.cookie = `access_token=; path=/; max-age=0`;
            window.location.href = "/";
        });
    } else {
        console.error('Element with id "disconnect" not found');
    }
});
