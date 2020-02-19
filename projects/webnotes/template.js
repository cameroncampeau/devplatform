module.exports.get = module.exports.build = markdown => `<html>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<meta charset="UTF-8">

<link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
/>
<link
    href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    rel="stylesheet"
    integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
    crossorigin="anonymous"
/>
<body>
    <div id="markdown" class="my-md-5 container p-4 border rounded"></div>
    <code id="text" style="display:none">${markdown}</code>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.8.0/marked.min.js"
        integrity="sha256-fIsvyYkI1qQV1tu1PdlM4FF43kW76YCnCcl/xJCD3Fc="
        crossorigin="anonymous"
    ></script>
    <script>
    window.onload = function() {
        var $container = document.querySelector("#markdown");
    
        $container.innerHTML = marked(document.querySelector("#text").innerText);
    }
    </script>
    </body>
    </html>
`;
