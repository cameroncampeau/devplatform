window.api = (function() {
  var API_ENDPOINT = "/api/";

  function get(url) {
    return fetch(API_ENDPOINT + url)
      .then(d => d.text())
      .then(t => JSON.parse(t));
  }
  function post(url, body, headers) {
    if (!headers) headers = {};
    if (body) headers["content-type"] = "application/json";

    return fetch(API_ENDPOINT + url, {
      body: JSON.stringify(body),
      headers,
      method: "post"
    })
      .then(d => d.text())
      .then(t => JSON.parse(t));
  }

  return { get, post };
})();
