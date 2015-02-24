var net = require('net');

var srvr = net.createServer();
var clientList = [];

srvr.on('connection', function(client) {
  client.name = client.remoteAddress + ':' + client.remotePort;
  client.write('Welcome, ' + client.name + '\n');
  clientList.push(client);

  client.on('data', function(data) {
    var dataArray = String(data).replace(/(\r\n|\n|\r)/gm,"").split(" ");
    if (dataArray[0] == "\\rename") {
      client.name = dataArray[1];
    }
    else if (dataArray[0] == "\\list") {
      for (var j in clientList) {
        if (clientList[j].name == client.name) {
          client.write("* " + clientList[j].name + "\n");
        }
        else {
          client.write("- " + clientList[j].name + "\n");
        }
      }
    }
    else if (dataArray[0] == "\\private") {
      var message = "";
      for (var j = 2; j < dataArray.length; j++) {
        message += dataArray[j] + " ";
      }
      for (var i in clientList) {
        if (clientList[i].name == dataArray[1]) {
          clientList[i].write("Whisper from " + client.name + ": " + message + "\n");
        }
      }
    }
    else broadcast(data, client);
  });
});

function broadcast(data, client) {
  for (var i in clientList) {
    if (client !== clientList[i]) {
      clientList[i].write(client.name + " says " + data);
    }
  }
}

function setClientName(newName, thisClient) {
    thisClient.name = newName;
}

srvr.listen(9000);


