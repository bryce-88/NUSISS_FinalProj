import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapDirectionsService } from '@angular/google-maps';
import { PlaceSearchResult } from '../model';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit{

  @ViewChild('map', { static: true })
  map!: GoogleMap;

  @Input()
  from: PlaceSearchResult | undefined;

  @Input()
  to: PlaceSearchResult | undefined;

  markerPositions: google.maps.LatLng[] = [];

  errorMessage = '';

  distance: number = 0;

  time: number = 0;

  zoom = 6;

  directionsResult$ = new BehaviorSubject<google.maps.DirectionsResult | undefined> (undefined);

  constructor(private directionsService: MapDirectionsService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    const fromLocation = this.from?.location;
    const toLocation = this.to?.location;

    if (fromLocation && toLocation) {
      this.getDirections(fromLocation, toLocation);
    } else if (fromLocation) {
      this.gotoLocation(fromLocation);
    } else if (toLocation) {
      this.gotoLocation(toLocation);
    }
  }

  gotoLocation(location: google.maps.LatLng) {
    this.markerPositions = [location];
    this.map.panTo(location);
    this.zoom = 17;
    this.directionsResult$.next(undefined);
  }

  getDirections(fromLocation: google.maps.LatLng, toLocation: google.maps.LatLng) {
    const request: google.maps.DirectionsRequest = {
      destination: toLocation,
      origin: fromLocation,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(Date.now()),
        trafficModel: google.maps.TrafficModel.BEST_GUESS
      },
      unitSystem: google.maps.UnitSystem.METRIC
    };

    // this.directionsService
    // .route(request)
    // .pipe(map((response) => response.result))
    // .subscribe((res) => {
    //   this.directionsResult$.next(res);
    //   const firstRoute = res!.routes[0];
    //   const firstLeg = firstRoute.legs[0];
    //   this.distance = firstLeg.distance!.value / 1000; // Distance in kilometers
    //   this.distance = Math.round(this.distance);
    //   this.time = firstLeg.duration!.value / 60; // Duration in minutes
    //   this.time = Math.round(this.time);
    //   this.markerPositions = [];
    //   // console.info(">> Duration + Distance: " + this.time + '   ' + this.distance);
    // });
    this.directionsService
    .route(request)
    .pipe(map((response) => response.result))
    .subscribe({
      next: (res) => {
          this.directionsResult$.next(res);
          if (res!.routes[0] != undefined) {
            const firstRoute = res!.routes[0];
            console.info(">>res route : " + res!.routes[0])
            const firstLeg = firstRoute.legs[0];
            this.distance = firstLeg.distance!.value / 1000; // Distance in kilometers
            this.distance = Math.round(this.distance);
            this.time = firstLeg.duration!.value / 60; // Duration in minutes
            this.time = Math.round(this.time);
            this.markerPositions = [];
          } else {
            const errorMessage = "Please enter another location viable by land"
            alert(errorMessage);
          }
    }
  });
}

}