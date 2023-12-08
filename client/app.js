
$("#askFriend").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#get").click();
    }
  });

// Establish a WebSocket connection
const socket = new WebSocket('ws://localhost:4000');

const randomId= generateRandomString(5);
// Event listener for when the WebSocket connection is opened
socket.addEventListener('open', (event) => {
  
  console.log(`WebSocket connection opened: ID:${ randomId } `);
  // Update the content of the div with the random ID
  document.getElementById('code').innerText = `${randomId}`;

});

//CHAT
// Event listener for when a message is received from the server
socket.addEventListener('message', (event) => {
  const chatLog = document.getElementById('chatLog');
  const li = document.createElement('li');
  li.textContent = event.data;
  chatLog.appendChild(li);

  const locationData = JSON.parse(event.data);
  console.log('Received location data:', locationData);

});

// Listen for the client ID message from the server
socket.addEventListener('client-id', (event) => {
  const clientIdContainer = document.getElementById('clientIdContainer');
  clientIdContainer.innerText = `Client ID: ${event.data}`;
});


// Event listener for when an error occurs
socket.addEventListener('error', (event) => {
  console.error('WebSocket error:', event);
});
  
//Global display my client info
var x = document.getElementById("display");
var y = document.getElementById("display1");

const feedDisplay = document.querySelector("#data-output");
const feedDisplay1 = document.querySelector("#data-output1");
  
var ask = document.getElementById("askFriend");
var idInput = document.getElementById("get");
  
//get element - fetch data to tables on client side 
const postBtn = document.getElementById('partilha');
postBtn.addEventListener('click', postInfo);
  
const getBtn = document.getElementById('askFriend');
getBtn.addEventListener('click', getInfo);  
  
function postInfo(e){
  
  //prevent to refesh the page
  e.preventDefault();
  var z = document.getElementById("code").textContent;
  var x =  document.getElementById("display").textContent;
  var y =  document.getElementById("display1").textContent;
  
      fetch('http://127.0.0.1:4000/loc', {
          method: "POST",
          body: JSON.stringify({
            //data: pos
            id: z,
            lat: x,
            lon: y
           }),
          headers: { "Content-Type": "application/json" }
      })
        .then(response =>{return response.json()}) 
        .catch(err => console.log(err));

   // Send continuous location updates to the server through the WebSocket connection
    socket.send(JSON.stringify(z));

    // Schedule the next update (adjust the interval as needed)
    setTimeout(postInfo, 1000); // Update every 5 seconds, for example

}
  
  
function getInfo(){
  var id = idInput.value;
  
    fetch('http://127.0.0.1:4000/get/' + id)
    .then(response => {return response.json()})
    .then(data => {
        // Process the data and display in HTML
        var html = '';
          html += '<p>' + 'Your friend info:' + '</p>';
          html += '<p id="cliId">' + data.id + '</p>';
          html += '<p id="cliLat">' + data.lat + '</p>';
          html += '<p id="cliLon">' + data.lon + '</p>';
        
      feedDisplay.innerHTML = html;
    })
    .catch(err => console.log(err));
}
  
  
  
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}
  
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else { 
    x = "Geolocation is not supported by this browser.";
    alert("Geolocation is not supported by this browser.");
  }
}
  
function showPosition(position) {
  x.innerHTML = position.coords.latitude;
  y.innerHTML = position.coords.longitude;
}

const handleError = error => {
  alert(`Unable to retrieve location: ${error.message}`);
};


function generateCodeShare() {
  getLocation();
  postInfo(); 
}

function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;

  // Send the message to the server
  socket.send(message);

  // Clear the input field
  messageInput.value = '';
}

