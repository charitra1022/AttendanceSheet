// returns fetched response from API
async function fetchData(url, options = {}) {
  let response = await fetch(url, options);
  return response.json();
}
