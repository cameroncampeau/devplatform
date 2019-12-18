module.exports = {
    load: function() {
        var route = require("./app"),
            DefaultServer = require("../../DefaultServer");
        DefaultServer.addRoute("/", route);
    }
}