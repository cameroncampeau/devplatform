var ports = {};
var avail_ports = [];

for (var i = 3000; i < 3020; i++) {
  avail_ports.push(i);
}

function getUsedPorts() {
  return ports;
}

function claimAvailablePort(appName) {
  if (avail_ports.length == 0) return -1;
  var port = avail_ports.pop();
  ports[port] = { app: appName };
  return port;
}

function releasePort(portNum) {
  if (!(portNum in ports)) return;
  avail_ports.push(portNum);
}
module.exports = { getUsedPorts, claimAvailablePort, releasePort };
