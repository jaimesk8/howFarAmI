
let map, infoWindow;
var latitude = 0; 
var longitude = 0;
let panorama;


function haversine_distance(mk1, mk2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
  var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return d;
}



function initMap() {

      var id = "";
        map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 41.1555079, lng: -8.6279243 },
          zoom: 15,
          disableDefaultUI: true,
          //mapTypeId: "satellite",
          streetViewControl: false,
          mapId: "e9ec01ddb44aa407", //satellite
        });

        /*const panorama = new google.maps.StreetViewPanorama(
          document.getElementById("pano"),
          {
            position: fenway,
            pov: {
              heading: 34,
              pitch: 10,
            },
          },
        );*/
      
       // map.setStreetView(panorama);
        

        //const transitLayer = new google.maps.TransitLayer();

        //transitLayer.setMap(map);
        //document.getElementById("transit").addEventListener("click", transitLayer.setMap(map));
        
        document.getElementById("toggle").addEventListener("click", toggleStreetView);

        map.setTilt(100);
      
        infoWindow = new google.maps.InfoWindow();

      const locationButton = document.getElementById("share");

    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener("click", () => {      
                var longitude = document.getElementById('display1').textContent;
                var latitude = document.getElementById('display').textContent; 
                var long = parseFloat(longitude);
                var lats = parseFloat(latitude);
                
                const randomString = 0;
                
                const posA = {
                  id: randomString,
                  lat: lats,
                  lng: long
                }

                var cliLon = document.getElementById('cliLon').textContent;
                var cliLat = document.getElementById('cliLat').textContent;
      
                var Flat = parseFloat(cliLat);
                var Flon = parseFloat(cliLon);

                const posB = {lat: Flat, lng: Flon};
                
                // The markers for PositionA and PositionB
                var mk1 = new google.maps.Marker({position: posA, map: map});
                var mk2 = new google.maps.Marker({position: posB, map: map});

                document.getElementById("toggle").addEventListener("click", toggleStreetView);
                
                // Calculate and display the distance between markers
                var distance = haversine_distance(mk1, mk2);
                document.getElementById('msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " mi.";
                // Draw a line showing the straight distance between the markers
               // var line = new google.maps.Polyline({path: [pos, frick], map: map});
                let directionsService = new google.maps.DirectionsService();
                let directionsRenderer = new google.maps.DirectionsRenderer();
                directionsRenderer.setMap(map); // Existing map object displays directions
                // Create route from existing points used for markers
                const route = {
                    origin: posA,
                    destination: posB,
                    travelMode: 'DRIVING'
                }

                directionsService.route(route,
                  function(response, status) { // anonymous function to capture directions
                    if (status !== 'OK') {
                      window.alert('Directions request failed due to ' + status);
                      return;
                    } else {
                      directionsRenderer.setDirections(response); // Add route to the map
                      var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
                      if (!directionsData) {
                        window.alert('Directions request failed');
                        return;
                      }
                      else {
                        document.getElementById('msg').innerHTML += " Driving distance is " + directionsData.distance.text + " (" + directionsData.duration.text + ").";
                      }
                    }
                  });
                
                infoWindow.setPosition(pos);
                //infoWindow.setContent("Estou aqui.");
                infoWindow.open(map);
                map.setCenter(pos);
                // We get the map's default panorama and set up some defaults.
                // Note that we don't yet set it visible.
                panorama = map.getStreetView(); // TODO fix type
                panorama.setPosition(map);
                panorama.setPov(
                  /** @type {google.maps.StreetViewPov} */ {
                    heading: 265,
                    pitch: 0,
                  },
                );
                
            
        },
              () => {
                handleLocationError(true, infoWindow, map.getCenter());
              }
      );   
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}


function toggleStreetView() {
  const toggle = panorama.getVisible();

  if (toggle == false) {
    panorama.setVisible(true);
  } else {
    panorama.setVisible(false);
  }
}

window.initMap = initMap;