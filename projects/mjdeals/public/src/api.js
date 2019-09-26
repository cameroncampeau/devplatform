window.api = (function() {
  var API_ENDPOINT = "/api/";

  function DELETE(url) {
    return request(API_ENDPOINT + url, { method: "delete" });
  }

  function get(url) {
    return request(API_ENDPOINT + url, {});
  }

  function post(url, body, headers) {
    if (!headers) headers = {};
    if (body) headers["content-type"] = "application/json";

    return request(API_ENDPOINT + url, {
      body: JSON.stringify(body),
      headers,
      method: "post"
    });
  }

  function patch(url, body, headers) {
    if (!headers) headers = {};
    if (body) headers["content-type"] = "application/json";

    return request(API_ENDPOINT + url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body)
    });
  }

  function request(url, opts) {
    return fetch(url, opts)
      .then(d => d.text())
      .then(t => JSON.parse(t));
  }

  return { get, post, patch, DELETE };
})();
