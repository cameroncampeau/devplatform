window.api = (function() {
  function post(url, body, headers) {
    if (!headers)
      headers = {
        "content-type": "application/json"
      };
    var opt = {
      body: JSON.stringify(body),
      headers,
      method: "POST"
    };
    return fetch(url, opt).then(t => t.text());
  }
  return { post };
})();
