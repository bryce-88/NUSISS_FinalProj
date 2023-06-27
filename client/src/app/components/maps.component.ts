import { Component } from '@angular/core';
import { PlaceSearchResult } from '../model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent {

  constructor(private router: Router) {}

  fromValue: PlaceSearchResult = { address: '' };
  toValue: PlaceSearchResult = { address: '' };


  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }

}
