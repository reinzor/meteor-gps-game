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
        "name":"metieske",
        "location":{
            "latitude":51.412484,
            "longitude":6.035975
        },
        "content" : "Welkom op de website van Cafe Metieske en Café Croes Moeke. Twee gezellige uitgaansgelegenheden in het centrum van Sevenum. Voor een gezellig avondje op stap of een zomeravond borrelen op het terras ben je bij ons aan het goede adres. Ook voor een verjaardagsfeest, barbecue of bedrijfsborrel bieden we vele mogelijkheden. Heb je net een leuk feestje gehad, kijk dan bij de foto’s of jouw partyshot erbij staat! Kijk snel verder voor meer informatie, het laatste nieuws, feestagenda’s en openingstijden"
    });

    Points.insert({
        "name":"bijen",
        "location":{
            "latitude":51.416472,
            "longitude":6.038467
        },
        "content" : "De superfamilie van de bijen (Apoidea) zijn insecten die behoren tot de orde van de vliesvleugeligen (Hymenoptera). Bijen zijn vooral bekend om de honing die ze maken. Bijen verschillen van de meeste andere (vleesetende) vliesvleugeligen door het dieet van nectar en stuifmeel. Ook de larven leven hiervan. Biologisch gezien vormen de bijen echter géén aparte groep. Alle soorten bijen behoren tot de superfamilie Apoidea, waartoe ook alle graafwespen behoren."
    });

    Points.insert({
        "name":"molenberg",
        "location":{
            "latitude":51.415214,
            "longitude":6.031944
        },
        "content" : "Tot 1955 was er in de gemeente Delfzijl geen grote zaal met een podiumaccommodatie. In 1955 kocht de gemeente de voormalige gereformeerde kerk aan de Oude Schans. Deze kerk werd omgebouwd tot schouwburg en hier vonden tot 1973 de grotere culturele activiteiten plaats (zie foto)."
    });

    Points.insert({
        "name":"karlijn",
        "location":{
            "latitude":51.408566,
            "longitude":6.040307
        },
        "content" : "Hello everyone and welcome to my YouTube channel My name is Karlijn Verhagen and I am a 17 year old singer/songwriter from near Rotterdam in the"
    });

    Points.insert({
        "name":"luttel",
        "location":{
            "latitude":51.40716,
            "longitude":6.035769
        },
        "content" : "gering, weinig"
    });

    Points.insert({
        "name":"vlaggenpunt",
        "location":{
            "latitude":51.408663,
            "longitude":6.02909
        },
        "content" : "Houten vlaggetjes Foto Verjaardag, geboorte, bruiloft...of gewoon voor de leuk... Je kunt naar hartenlust je eigen vlaggenlijn samenstellen. Afmeting vlaggenpunt 12x15 cm. Prijs per vlaggenpunt €1,00 plus eenmalig maakkosten a €0,95. Ook verkrijgbaar in XL maat 16x18 cm. Prijs per vlaggenpunt €2,00 plus eenmalig maakkosten a €0,95."
    });

    Points.insert({
        "name":"ooienvaar",
        "location":{
            "latitude":51.416756,
            "longitude":6.028275
        },
        "content" : "De ooievaar (Ciconia ciconia) is een grote vogel uit de familie ooievaars (Ciconiidae) uit de orde van de ooievaarachtigen (Ciconiiformes)."
    });

    Points.insert({
        "name":"bejaarden",
        "location":{
            "latitude":51.409452,
            "longitude":6.036267
        },
        "content" : "Iemand van gevorderde leeftijd wordt wel een bejaarde genoemd. Wat die leeftijd is, is tamelijk subjectief. Vaak wordt iemand van boven de 65 als bejaard gezien, alhoewel velen het hier ook weer niet mee eens zijn."
    });
}

// * * * * * * * * Application Behavior * * * * * ** * * ** 

DISTANCE_THRESHOLD = 5;

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
    if (Session.get('current_point'))
	$("#point").show("modal");
    else
        $("#point").hide("modal");
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
