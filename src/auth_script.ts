// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

export async function initializeApp() {
  const clientId = "4d47f7f7b6234523bba1a4aa4824f505";
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    redirectToAuthCodeFlow(clientId);
  } else {
    // const accessToken = await getAccessToken(clientId, code);
  }
}



