const socket = io('http://localhost:4000', {
  transports: ['websocket'],
});

let map;
let userMarker;
let mk2; 
var routingControl;
var latitude = 0;
var longitude = 0;
let idClient2;
  
//function initMap() {
  map = L.map('map').setView([41.1555079, -8.627924], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  //const pin = document.getElementById("share");
  //pin.addEventListener(L.marker([lats, long], 13).addTo(map));
  const locationButton = document.getElementById("share");
  //map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
      var longitude = document.getElementById('display1').textContent;
      var latitude = document.getElementById('display').textContent;
      var idClient = document.getElementById('code').textContent;
      idClient2 = document.getElementById('cliId').textContent;
      //emmit the location to the socket
      socket.emit('setId', idClient);

      var long = parseFloat(longitude);
      var lats = parseFloat(latitude);

      const randomString = "";

      const posA = {
        id: randomString,
        lat: lats,
        lng: long
      }

      var cliLon = document.getElementById('cliLon').textContent;
      var cliLat = document.getElementById('cliLat').textContent;

      var Flat = parseFloat(cliLat);
      var Flon = parseFloat(cliLon);

      const posB = {
        lat: Flat,
        lng: Flon
      };

      function initializeRoutingControl(userLocation) {
        // Initialize the routing control with the initial waypoints
        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation.lat, userLocation.lng),
                L.latLng(Flat, Flon)
            ],
            //routeWhileDragging: true
        }).addTo(map);
      }

      // The markers for PositionA and PositionB
      //var mk1 = L.marker([lats, long], 13).addTo(map);
      function onLocationFound(e) {
        var radius = e.accuracy / 2;

        // Check if the marker already exists
        if (userMarker) {
          // Update marker position
          userMarker.setLatLng(e.latlng);
          //console.log("User marker", userMarker);
          // Update the routing control waypoints
          routingControl.setWaypoints([
              L.latLng(e.latlng.lat, e.latlng.lng),
              L.latLng(Flat, Flon)
          ]);
  
        } else {
            // Create a new marker
            userMarker = L.marker(e.latlng).addTo(map);
            // Initialize routing control with initial waypoints
            initializeRoutingControl(e.latlng);
        }

        userMarker.bindPopup("You are within " + radius + " meters from this point").openPopup();
        //L.circle(e.latlng, radius).addTo(map);
        socket.emit('updateLocation', {idClient: idClient, latitude: e.latlng.lat, longitude: e.latlng.lng });
        // Send the client 2 ID to the server     
        socket.emit('requestLocation',  idClient2 );
      } 

      map.on('locationfound', onLocationFound);
      //map.locate({setView: true, watch: true, maxZoom: 8});
      map.locate({ watch: true, enableHighAccuracy: true });

      // The markers for PositionA and PositionB
      //var mk1 = L.marker([lats, long], 13).addTo(map);
      //mk1.bindPopup('<b>I am here</b><br>', posA).openPopup();
      //let mk2 = L.marker(posB).addTo(map);
      //mk2.bindPopup('<b>Estamos bem perto</b><br>', posB).openPopup();
      
      
      socket.on('locationUpdate', (data) => {
        console.log('Received location update for client B:', data);

        var longitude = document.getElementById('display1').textContent;
        var latitude = document.getElementById('display').textContent;
        // Update UI or perform any necessary actions based on the received location data
        if (data.idClient === idClient2) {
          // Check if the marker already exists
          if (mk2) {
            // Update marker position
            mk2.setLatLng([data.latitude, data.longitude]);
            //console.log("User marker", userMarker);
            // Update the routing control waypoints
            routingControl.setWaypoints([
                L.latLng(latitude, longitude),
                L.latLng([data.latitude, data.longitude])
            ]);
    
          } else {
              // Create a new marker
              mk2 = L.marker([data.latitude, data.longitude]).addTo(map);
          }
        }
      });


      // var polygon = L.polygon([posA, posB]).addTo(map);
      // polygon.bindPopup("Estamos bem perto!");
    
      // Calculate and display the distance between markers
      var distance = haversine_distance(mk1, mk2);
      document.getElementById('msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " mi.";

    },
    () => {
      handleLocationError(true, infoWindow, map.getCenter());
    }
  );
//}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation ?
    "Error: The Geolocation service failed." :
    "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
