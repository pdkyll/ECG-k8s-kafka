console.log("hello world");

// connection info
var connection = new Object();
connection.hostname = "192.168.1.101";
connection.port = 30831;
connection.topic = "paho/test/simple"
connection.client_id = "mqtt_js_client_test"

writeDefaultConnectionInfo(connection);

document.getElementById("connect_btn").addEventListener("click", OnconnectBtnClick);
document.getElementById("msg_log_btn").addEventListener("click", OnMsgLogBtnClick);

isConnected = false;
isLogMsg = true;

function OnconnectBtnClick() {
  getConnectionInfo();
  client = new Paho.MQTT.Client(connection.hostname, Number(connection.port), connection.client_id);
  if (isConnected == false)
    ConnectToServer(client, connection);
  else
    disConnect(client);
}

function OnMsgLogBtnClick() {
  btn_item = document.getElementById("msg_log_btn")
  if (isLogMsg == true) {
    btn_item.innerText = "disabled";
    btn_item.className = "label label-warning";
  } else {
    btn_item.innerText = "enabled"; 
    btn_item.className = "label label-success";
  }
  isLogMsg = !isLogMsg;
}
// connect to the server
function ConnectToServer(client, connection) {
  console.log("connect btn clicked");

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({onSuccess:onConnect});
}

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  updateStatus(true);
  client.subscribe(server.topic);
  message = new Paho.MQTT.Message("Hello");
  message.destinationName = server.topic;
  client.send(message);
  isConnected = true;
}

function disConnect(client) {
  console.log("disconnect");
  client.disconnect();
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  updateStatus(false);
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  isConnected = false;
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:" + message.payloadString);
  var msg = message.payloadString;
  if (isLogMsg)
     writeMessage(msg);
  // get ecg data
  ecg_data = msg.split(',')[1];
  updatePYval(ecg_data);

}

// write message to web page
function writeMessage(message) {
    list = document.getElementById("messageList");

    var item = document.createElement('li');

    item.appendChild(document.createTextNode(message));

    list.appendChild(item);

    list.scrollTop = list.scrollHeight;
}


function writeDefaultConnectionInfo(connection) {
  document.getElementById("server_host").value = connection.hostname;

  document.getElementById("server_port").value = connection.port;

  document.getElementById("server_topic").value = connection.topic;

  document.getElementById("client_id").value = connection.client_id;

}

function getConnectionInfo() {

  connection.hostname = document.getElementById("server_host").value;
  console.log("host:" + connection.hostname);

  connection.port = document.getElementById("server_port").value;

  connection.topic = document.getElementById("server_topic").value;

  connection.client_id = document.getElementById("client_id").value;

}

// update connection status
function updateStatus(status) {
  if (status == true) {
    msg = "Connected";
    clsname = "label label-success";
    document.getElementById("connect_btn").innerText = "Disconnect"
    document.getElementById("server_host").disabled = true;
    document.getElementById("server_port").disabled = true;
    document.getElementById("server_topic").disabled = true;
    document.getElementById("client_id").disabled = true;
  }
  else {
    msg = "Connection Lost";
    clsname = "label label-warning";
    document.getElementById("connect_btn").innerText = "Connect"
    document.getElementById("server_host").disabled = false;
    document.getElementById("server_port").disabled = false;
    document.getElementById("server_topic").disabled = false;
    document.getElementById("client_id").disabled = false;
  }

  el_status = document.getElementById("server_status");
  el_status.className = clsname;
  el_status.innerHTML = "status: " + msg;
}