const DefaultServer = require("../../DefaultServer");
const express = require("express");
const projectYear = require("./app").projectYear;

module.exports = {
  load() {
    function objToHTMLTable(obj) {
      var html = `<html>`;
      for (key in obj) {
        html += `<strong>${key}</strong>: ${obj[key]}<br>`;
      }
      return html + "</html>";
    }
    var route = new express.Router();
    route.get("/", async (req, res) => {
      return res.end(objToHTMLTable(await projectYear()));
    });
    DefaultServer.addRoute("/payestimator", route);
  },
};
