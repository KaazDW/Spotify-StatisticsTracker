// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId = "4d47f7f7b6234523bba1a4aa4824f505";

export async function initializeApp(): Promise<any> {
    const clientId = "4d47f7f7b6234523bba1a4aa4824f505";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log('fetchdata')

    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        const tracks_long = await fetchTopTrack(accessToken, "long_term");
        // const tracks_medium = await fetchTopTrack(accessToken, "medium_term");
        // const tracks_short = await fetchTopTrack(accessToken, "short_term");
        // const artists_long = await fetchTopArtist(accessToken, "long_term");
        // const artists_medium = await fetchTopArtist(accessToken, "medium_term");
        // const artists_short = await fetchTopArtist(accessToken, "short_term");
        displayProfile(profile);
        displayTracks(tracks_long);

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
     
    for(let i=0; i<4; i++){
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


// function populateUI(profile: UserProfile) {
//     document.getElementById("displayName")!.innerText = profile.display_name ;
//     document.getElementById("avatar")!.setAttribute("src", profile.images[0].url)
//     document.getElementById("id")!.innerText = profile.id ;
//     document.getElementById("email")!.innerText = profile. email ;
//     document.getElementById("uri")!.innerText = profile.uri ;
//     document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify) ;
//     document.getElementById("url")!.innerText = profile.href ;
//     document.getElementById("url")!.setAttribute("href", profile.href) ;
//     document.getElementById("imgUrl")!.innerText = profile.images[0].url;
// }

function displayProfile(profile: UserProfile) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("avatar")!.setAttribute("src", profile.images[0].url);
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("imgUrl")!.innerText = profile.images[0].url;
}
function displayTracks(tracks: Tracks) {
    const longSection = document.getElementById("long");

    for (let i = 0; i < tracks.length; i++) {
        const albumName = tracks[i].album.name;
        const artistName = tracks[i].album.artists[0].name;
        const sonName = tracks[i].name;
        const artistSpotifyLink = tracks[i].album.artists[0].external_urls.spotify;
        const sonSpotifyLink = tracks[i].external_urls.spotify;
        const imageSrc = tracks[i].album.images[0].url;

        const paragraph = document.createElement('div');

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
        sonNameLink.target = '_blank'; // Pour ouvrir dans un nouvel onglet
        sonNameLink.innerText = sonName;
        sonNameLink.className = 'son-name';
        paragraph.appendChild(sonNameLink);

        const artistNameLink = document.createElement('a');
        artistNameLink.href = artistSpotifyLink;
        artistNameLink.target = '_blank'; // Pour ouvrir dans un nouvel onglet
        artistNameLink.innerText = artistName;
        artistNameLink.className = 'artist-name';
        paragraph.appendChild(artistNameLink);

        const albumNameSpan = document.createElement('span');
        albumNameSpan.innerText = albumName;
        albumNameSpan.className = 'album-name';
        paragraph.appendChild(albumNameSpan);

        longSection.appendChild(paragraph);
    }
}





