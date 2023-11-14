// fetchWithAuth.js

/**
 * A wrapper around the native `fetch` function that adds the JWT from localStorage
 * to the request headers.
 * 
 * @param {string} url The URL to send the request to.
 * @param {RequestInit} options The options for the fetch request.
 * @returns {Promise<Response>} The response from the fetch request.
 */
async function fetchWithAuth(url, options = {}) {
    // Retrieve the access token from local storage
    const token = localStorage.getItem('accessToken');
  
    // If there is a token, add it to the headers
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  
    // Make the fetch request with the original URL and the enhanced options
    const response = await fetch(url, options);
  
    // Handle the response (e.g., automatically refresh token, redirect on 401, etc.)
    if (response.status === 401) {
      // You might want to handle token expiration, redirect to login, etc.
      // ...
    }
  
    return response;
  }
  
  export default fetchWithAuth;
  