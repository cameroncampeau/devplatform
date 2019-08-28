window.api = (function() {
    function post(url, body, headers) {
        if (!headers) headers = {};
        var options = {
            headers,
            body: body,
            method: "POST"
        }
        return fetch(url, options).then((r) => r.text());
    }
    return {post}
})()