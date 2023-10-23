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
    const tracks = await fetchTopTrack(accessToken, 0, "long_term");
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



async function fetchTopTrack(code: string, offset: integer, time: string): Promise<UserProfile> {
    let allTopTracks = [];
    let iteration = 1;
    while(iteration <= 5){
        const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=20&offset=" + offset + "&time_range=" + time, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${code}`
            }
        });
        const data = await result.json();
        allTopTracks = allTopTracks.concat(data.items);
        console.log("offset : " + offset + "; it : " + iteration);
        console.log(allTopTracks);
        offset += 20;
        iteration++;
    }
    console.log(allTopTracks);
    return allTopTracks;
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



