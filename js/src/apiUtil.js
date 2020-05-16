export function fetchFromAPI(url) {
  return fetch(url, {
    method: 'GET',
    mode: 'cors'
  })
  .then(response => {
    if (!response.ok) {
      return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
    } else {
      return response.json();
    }
  });
}
