// import { Directive, OnDestroy, OnInit } from '@angular/core';
// import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
// import { GoogleMap, Marker } from 'angular2-google-maps/core/services/google-maps-types';
// import { AppService } from '../../../services/index';
// import { Observable } from 'rxjs';

// declare const google;
// declare const MarkerClusterer;

// @Directive({
//   selector: 'custom-map'
// })
// export class CustomMapDirective implements OnInit, OnDestroy {

//   public map: GoogleMap;

//   constructor(public gmapsApi: GoogleMapsAPIWrapper, public appService: AppService) {
//   }

//   ngOnInit() {

//     this.gmapsApi.getNativeMap().then(map => {
//       this.map = map;

//       let shopMarker = {
//         url: "assets/img/marker_shop.svg", // url
//         scaledSize: new google.maps.Size(50, 50)
//       }
//       let loungeMarker = {
//         url: "assets/img/marker_lounge.svg", // url
//         scaledSize: new google.maps.Size(50, 50)
//       }

//       let markers = [];

//       let style = {
//         url: "/assets/img/marker.svg",
//         height: 50,
//         width: 50,
//         anchor: [-14, 0],
//         textColor: '#bd0b1d',
//         textSize: 11,
//         backgroundPosition: "center center"
//       };

//       var options = {
//         imagePath: "/assets/img/marker",
//         gridSize: 70,
//         styles: [style, style, style]
//       };

//       Observable
//         .interval(500)
//         .skipWhile((s) => this.appService.Shops == null || this.appService.Shops.length <= 0)
//         .take(1)
//         .subscribe(() => {
//           for (let shop of this.appService.Shops) {
//             var marker = new google.maps.Marker({
//               position: new google.maps.LatLng(shop.Latitude, shop.Longitude),
//               icon: shop.Lounge ? loungeMarker : shopMarker
//             });
//             google.maps.event.addListener(marker, 'click', () => {
//               this.appService.SelectedShop = shop;
//             });
//             markers.push(marker);

//           }

//           var markerCluster = new MarkerClusterer(map, markers, options);
//         })
//     });
//   }
// }