$("#askFriend").keyup(function (event) {
  if (event.keyCode === 13) {
    $("#get").click();
  }
});

const randomId = generateRandomString(5);
//display my client info
var z = document.getElementById("code");
//Global display my client info
var x = document.getElementById("display");
var y = document.getElementById("display1");
const feedDisplay = document.querySelector("#data-output");
const feedDisplay1 = document.querySelector("#data-output1");
var ask = document.getElementById("askFriend");
var idInput = document.getElementById("get");
const postBtn = document.getElementById('partilha');
postBtn.addEventListener('click', postInfo);
const getBtn = document.getElementById('askFriend');
getBtn.addEventListener('click', getInfo);

function postInfo(e) {
  //prevent to refesh the page
  e.preventDefault();
  var z = document.getElementById("code").textContent;
  var x = document.getElementById("display").textContent;
  var y = document.getElementById("display1").textContent;

  fetch('http://127.0.0.1:4000/loc', {
      method: "POST",
      body: JSON.stringify({
        id: z,
        lat: x,
        lon: y
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err));


  //Schedule the next update (adjust the interval as needed)
  setTimeout(postInfo, 1000); // Update every 5 seconds, for example

}


function getInfo() {
  var id = idInput.value;

  fetch('http://127.0.0.1:4000/get/' + id)
    .then(response => {
      return response.json()
    })
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
    navigator.geolocation.watchPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  z.innerHTML = randomId;
  x.innerHTML = position.coords.latitude.toString();
  y.innerHTML = position.coords.longitude.toString();
}


function generateCodeShare() {
  spinWheel();
  getLocation();
  generateRandomString(5);
  postInfo();
}


function spinWheel() {
  // Hide the result and show the spinner
  document.getElementById('display').style.display = 'none';
  document.getElementById('display1').style.display = 'none';
  document.getElementById('spinner').style.display = 'block';
  setTimeout(() => {
    // Stop the spinner
    document.getElementById('spinner').style.display = 'none';
    toggleButtons('demo');
  }, 3000); // Change the timeout
}
