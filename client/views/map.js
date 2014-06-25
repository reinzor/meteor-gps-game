/* * * * * ** * * * * * POINT TEMPLATE UPDATES * * * * * * * * * * * * */

Template.point.p = function () {
    if (Session.get('current_point')) {
        var current_point = Points.find({"name":Session.get('current_point')}).fetch();
        return current_point[0];
    }
}   

/* * * * * ** * * * * * MAP TEMPLATE UPDATES * * * * * * * * * * * * * */

Template.map.rendered = function() {
    if (! Session.get('google_maps_initialized'))
        gmaps.initialize();
 
    Deps.autorun(function() {
        var points = Points.find().fetch();
 
        _.each(points, function(point) {
            if (typeof point.location !== 'undefined' &&
                typeof point.location.latitude !== 'undefined' &&
                typeof point.location.longitude !== 'undefined') {
 
                var objMarker = {
                    id: point._id,
                    lat: point.location.latitude,
                    lng: point.location.longitude,
                    title: point.name
                };
 
                // check if marker already exists
                if (!gmaps.markerExists('id', objMarker.id))
                    gmaps.addMarker(objMarker);
 
            } else {
            	console.log("Point " + point._id + " has no location")
            }
        });

        gmaps.calcBounds();
    });
}
 
Template.map.destroyed = function() {
    Session.set('map', false);
}

// * * * * * * * * * * * * * GEO TRACKER * * * * * * * * * * * * * * * 

// Used for debugging
geoSuccessManual = function(lat,long) {
    var position = { "coords" : {"latitude":lat,"longitude":long} }
    geoSuccess(position);
}

function geoSuccess(position) {
    if (Session.get('google_maps_initialized'))  {
        gmaps.updateGeoPosition(position.coords.latitude,position.coords.longitude);
        checkIfUserIsNearPoint();
    }
}

var geoOptions = {
  enableHighAccuracy: true, 
  maximumAge        : 30000, 
  timeout           : 27000
};

function geoError() {
  console.log("Sorry, no position available.");
}

// Initialize the geoTracker when google maps is initialized
var interval = setInterval(function() {
    if (Session.get('google_maps_initialized')) {
        var geoTracker = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
        clearInterval(interval);
    }
}, 1000);

// * * * * * * * * * * * * SETUP THE LOCATIONS * * * * * * * * * * * * *

clearLocations = function() {
    var points = Points.find().fetch();
 
    _.each(points, function(point) {
        Points.remove(point._id);
    });
}

setupLocations = function() {
    Points.insert({
        "name":"Speeltuintje Kuiper",
        "location":{
            "latitude": 51.412034,
            "longitude": 6.032487
        },
        "content" : "<ul>
        <li>Gefeliciteerd, je bent aangekomen op je eerste punt!<li>
        <li>CODE: (Z)</li>
        </ul>",
        "img" : "https://lh3.googleusercontent.com/-JY9qJhQeLFc/AAAAAAAAAAI/AAAAAAAAAA0/QEUzphMhs8g/photo.jpg"

    });

    Points.insert({
        "name":"Metieske",
        "location":{
            "latitude":51.412484,
            "longitude":6.035975
        },
        "content" : "<ul>
        <li>Foto: Maak een foto waarbij door de groep en eventueel door figuranten, uitgebeeld wordt dat het nederlands elftal in de 93e minuut van de titel 'Wereldkampioen' beroofd wordt.</li>
        <li>Foto: Maak een foto waarin uitgebeeld wordt dat Nederland in de 93e minuut van de finale wereldkampioen wordt.</li>
        <li>CODE: (O)</li>
        </ul>",
        "img" : "https://lh3.googleusercontent.com/-JY9qJhQeLFc/AAAAAAAAAAI/AAAAAAAAAA0/QEUzphMhs8g/photo.jpg"

    });

    Points.insert({
        "name":"Bijen",
        "location":{
            "latitude":51.416472,
            "longitude":6.038467
        },
        "content" : "<ul>
        <li>TODO: In het begin van de vorige eeuw werd het haar van jonge dames vaak verfraaid met een bloemenkrans. Gebruik je fantasie en maak een prachtige haardecoratie met hetgeen de natuur in het blakterbeekpark je te bieden heeft. De decoratie dient tijdens de tocht door een van de groepsleden gedragen te worden. De decoratie wordt aansluitend aan de organisatie aangeboden.</li>
        <li>Foto: Maak een foto van ludieke foto waarbij iemand deze mooie bloemenkrans draagt!</li>
        <li>Vraag: Achterhaal wat voor bijensoort vliegt op het Blakterbeekpark en welk schapensoort er rondloopt</li>
        <li>CODE: (NN)</li>
        </ul>",
        "img" : "http://www.depoortpijnacker.nl/wp-content/gallery/divers_1/bijen.jpg"
    });

    Points.insert({
        "name":"Molenberg",
        "location":{
            "latitude":51.415214,
            "longitude":6.031944
        },
        "content" : "<ul>
        <li>TODO: Rondje om de tafel: Welk team houdt het langste de bal in het spel?? Meeste aantal slagen heeft gewonnen.</li>
        <li>CODE: (19)</li>
        </ul>",
        "img" : "http://www.startpagina.nl/athene/dochters/tafeltennis/images/tafeltennis.jpg"
    });

    Points.insert({
        "name":"The Final!",
        "location":{
            "latitude":51.408566,
            "longitude":6.040307
        },
        "content" : "<ul>
        <li>TODO: Bel aan op nummertje 19!</li>
        </ul>",
        "img" : "http://www.allvectors.com/wp-content/uploads/2012/02/puzzle-vector.jpg" 
    });

    Points.insert({
        "name":"Luttel speeltuin",
        "location":{
            "latitude":51.40716,
            "longitude":6.035769
        },
        "content" : "<ul>
        <li>Raadsel: Het heeft een been, maar het kan niet lopen. Het heeft twee vleugels, maar het kan niet vliegen. Het draagt een bril, maar het kan niet zien. Het heeft haar, maar het kan niet gekamd worden?</li>
        <li>CODE: (E)</li>
        </ul>",
        "img" : "http://www.animaatjes.nl/plaatjes/d/dombo/dombo10.gif"
    });

    Points.insert({
        "name":"Vlaggenpunt",
        "location":{
            "latitude":51.408663,
            "longitude":6.02909
        },
        "content" : "<ul>
        <li>Foto: Maak een foto van een zo groot mogelijke menselijke piramide!</li>
        <li>CODE: (D)</li>
        </ul>"
    });

    Points.insert({
        "name":"Ooienvaar",
        "location":{
            "latitude":51.416756,
            "longitude":6.028275
        },
        "content" : "<ul>
        <li>TODO: Maak en schrijf op: De opsomming van geboortedata van opa, oma, kinderen en kleinkinderen Appeldoorn, op leeftijd van groot naar klein. (kalde kant laten we even buiten beschouwing)</li>
        <li>CODE: (AU)</li>
        </ul>",
        "img" : "http://www.jandurkspolder.nl/ooievaar%20JDP.JPG"
    });

    Points.insert({
        "name":"Bejaarden",
        "location":{
            "latitude":51.409452,
            "longitude":6.036267
        },
        "content" : "<ul>
        <li>Vraag: Welk gebouw stond er vroeger op de plek waar nu 'ut Valdere' is. In welk jaar werd dit gebouw gesloopt en wie zat er boven op het dak om het gebouw voor sloop te behoeden.</li>
        <li>CODE: (W)</li>
        </ul>",
        "img" : "http://1.nieuwsbladcdn.be/Assets/Images_Upload/2012/08/29/A2_GOJ3U1KBC010A2_bejaarden01.jpg.h380.jpg"
    });
}

// * * * * * * * * Application Behavior * * * * * ** * * ** 

DISTANCE_THRESHOLD = 10;

function checkIfUserIsNearPoint() {
    var lat = gmaps.geoPosition.position.k;
    var long = gmaps.geoPosition.position.A;

    // Get all Points 
    var points = Points.find().fetch();

    // Loop over all points and check euclidean distance
    Session.set('current_point',false);
    points.forEach(function(point) {
        var d = getDistanceInMeter(point.location.latitude,point.location.longitude,lat,long);
        if (d < DISTANCE_THRESHOLD) {
            Session.set('current_point',point.name);
        } 
    });
}

// * * * * * * * * HELPER FUNCTIONS * * * * * ** * * ** 

function getDistanceInMeter(lat1,lon1,lat2,lon2) {
  var R = 6371000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
