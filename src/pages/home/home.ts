import { BadsmellProvider } from './../../providers/badsmell/badsmell';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  start = 'chicago, il';
  end = 'chicago, il';

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  markers = [];
  mylocation: any;
 
  constructor(public navCtrl: NavController, private geolocation: Geolocation, private badsmell: BadsmellProvider) {

  }

  ionViewDidLoad(){
    this.initMap();
  }
// fucionnes de la clase 
  // inicia el mapa 
  initMap() {  
 //carga la poscion actual en el mapa current position  
 //  this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
   //   let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
   this.map = new google.maps.Map(this.mapElement.nativeElement, {
    zoom: 7,
    center: {lat: 41.85, lng: -87.65}
  });

// esta parte carga las posicones en el mapa
// hay que pasarlo a un servicio que se injecte al constructor 
//****************************************************************** */
//posiciones de interes cargados en el mapa ************!!!!
var locations = this.badsmell.getShitPositions();
var infowindow = new google.maps.InfoWindow();
var marker, i;

 for (i = 0; i < locations.length; i++)
{  
  marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[i][1], locations[i][2]),

    map: this.map
  });

  
  console.log(locations);

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(this.map, marker);
          }
        })(marker, i));
} 


  }

  //esta funcion muestra el div flotante donde saldra la tabla con la informacion en detalle del parque
// o de la fuente
  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
}
