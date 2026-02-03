const URL = "/api/player";

/**
 * Post a player to create it.
 * 
 * @param {string} baseUrl The base URL of the API
 * @param {string} id The ID of the new player
 */
export default async function postPlayer(baseUrl: string, id: string): Promise<Response> {
  const response = await fetch(baseUrl + URL, {
    method: "POST",
    body: JSON.stringify({
      id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Log l'erreur si elle existe
  if (!response.ok) {
    console.error(`Error ${response.status}:`, await response.json());
  }

  return response;
}