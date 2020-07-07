'use strict'
var mymap = L.map('mapid').setView([4.6139628, -74.1907816], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
}).addTo(mymap);

L.polygon([
    [4.6087653, -74.1863059],
    [4.6148339, -74.1892292],
    [4.6235807, -74.1877524]
]).addTo(mymap);

L.marker([4.6087653, -74.1863059]).addTo(mymap);
L.marker([4.6148339, -74.1892292]).addTo(mymap);
L.marker([4.6235807, -74.1877524]).addTo(mymap);

$.ajax({
    type: "get",
    url: "api",
    dataType: "json",
    headers: {"x-acces-token": "Bearer asdfasf"},
    success: function (response) {
        console.log(response);
        response.bicicletas.forEach(element => {
            L.marker(element.ubicacion, {title: element.id}).addTo(mymap);
        });
    }
});