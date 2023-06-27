import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-view1',
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.css']
})
export class View1Component implements OnInit, OnDestroy {

  $itinerarySub!: Subscription;
  itineraryList!: any[];
  login!: string;
  

  displayedColumns: string[] = ['title', 'actions'];

  constructor(private router: Router,
              private crud: CrudService) {
  }

  //call to server, server will call mysql based on login
  //if login has current itineraries, it will populate into an array of Itinerary[]
  //if empty, it will show "You have no Itineraries"
  ngOnInit() {
      const login = localStorage.getItem('login');
      this.$itinerarySub = this.crud.getItinerary(login!).subscribe(
        list => {
          this.itineraryList = list;
        },
        error => console.error('Error getting itineraries', error)
      );
  } 


  async delete(title: string) {
    const login = localStorage.getItem('login');
    const deleteStatus = await this.crud.deleteItinerary(login!, title);
    console.log('>>> Delete status: ' + deleteStatus['Status'])
    this.crud.redirectTo('/view1')
  }

  edit(login: string, title: string) {
    // localStorage.setItem('login', login);
    localStorage.setItem('title', title);
    this.router.navigate(['/view4']);
  }

  generateItinerary(login: string, title: string) {
    localStorage.setItem('title', title);
    // console.info(">> Login, Title: " + login + '  ' + title)
    this.router.navigate(['/view5']);
  }

  refresh() {
    this.crud.redirectTo('/view1')
  }

  ngOnDestroy(): void {
    if (this.$itinerarySub) {
      this.$itinerarySub.unsubscribe();
    }
  }


  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }

}
