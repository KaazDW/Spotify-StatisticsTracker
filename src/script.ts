// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId = "4d47f7f7b6234523bba1a4aa4824f505";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

console.log(window.location.search);
console.log(params);
console.log(code);
if (!code) {
    redirectToAuthCodeFlow(clientId);
    console.log(code);
} else {
    const accessToken = await getAccessToken(clientId, code);
    console.log(accessToken);
    const profile = await fetchProfile(accessToken);
    const tracks = await fetchTopTrack(accessToken);
    populateUI(profile);
}

async function fetchProfile(code: string): Promise<UserProfile> {
    console.log(code);
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



async function fetchTopTrack(code: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${code}`
        }
    });

    const data = await result.json();
    console.log(data);
    return data;
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

