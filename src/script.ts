// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId = "4d47f7f7b6234523bba1a4aa4824f505";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const tracks = await fetchTopTrack(accessToken, "long_term");
    const artists = await fetchTopArtist(accessToken, "long_term");
    populateUI(profile);
}

async function fetchProfile(code: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${code}`
        }
    });

    const data = await result.json();
    return data;
}

async function fetchTopTrack(code: string, time: string): Promise<UserProfile> {
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

async function fetchTopArtist(code: string, time: string): Promise<UserProfile> {
    let TopArtists = [];
     
    for(let i=0; i<1; i++){
        const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=" + time, {
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


function populateUI(profile: UserProfile) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("avatar")!.setAttribute("src", profile.images[0].url)
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0].url;
}



