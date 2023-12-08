
$("#askFriend").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#get").click();
    }
  });
  
//display my client info
var z = document.getElementById("code");
var x = document.getElementById("display");
var y = document.getElementById("display1");

var s = document.getElementById("demo");
var k = document.getElementById("partilha");
var m = document.getElementById("ask");
var n = document.getElementById("share");


s.addEventListener("click", toggleButtons);
k.addEventListener("click", toggleButtons1);
m.addEventListener("click", toggleButtons2);
n.addEventListener("click", toggleButtons3);



function toggleButtons(){
  if (z.textContent.trim() !== "") {
    s.style.display = "none";
    k.style.display = "block";
    myDiv.removeEventListener("DOMSubtreeModified", toggleButtons);
}
}

function toggleButtons1(){
  if (z.textContent.trim() !== "") {
    k.style.display = "none";
    m.style.display = "block";
    myDiv.removeEventListener("DOMSubtreeModified", toggleButtons1);
}
}

function toggleButtons2(){
  if (z.textContent.trim() !== "") {
    m.style.display = "none";
    n.style.display = "block";
    myDiv.removeEventListener("DOMSubtreeModified", toggleButtons2);
}
}

function toggleButtons3(){
  if (z.textContent.trim() !== "") {
    n.style.display = "none";
    //m.style.display = "none";
    myDiv.removeEventListener("DOMSubtreeModified", toggleButtons3);
}
}

z.addEventListener("DOMSubtreeModified", toggleButtons);
k.addEventListener("DOMSubtreeModified", toggleButtons1);
m.addEventListener("DOMSubtreeModified", toggleButtons2);
n.addEventListener("DOMSubtreeModified", toggleButtons3);

const feedDisplay = document.querySelector("#data-output");
const feedDisplay1 = document.querySelector("#data-output1");
  
const randomString = generateRandomString(4);
  
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
  z.innerHTML = randomString;
  x.innerHTML = position.coords.latitude;
  y.innerHTML = position.coords.longitude;
}

const handleError = error => {
  alert(`Unable to retrieve location: ${error.message}`);
};

async function generateCodeShare() {
  
  const outputDiv = document.getElementById("code");

  getLocation();


  // Use a MutationObserver to wait for the content to change
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && outputDiv.textContent.trim() !== "") {
        observer.disconnect(); // Stop observing once content is not empty
        document.getElementById("code").disabled = false;
        anotherFunction();
      }
    });
  });

  observer.observe(outputDiv, { childList: true, subtree: true });

  postInfo(); 

}