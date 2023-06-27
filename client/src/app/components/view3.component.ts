import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { ItineraryDetails } from '../model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view3',
  templateUrl: './view3.component.html',
  styleUrls: ['./view3.component.css']
})
export class View3Component implements OnInit, OnDestroy {

  detailsform!: FormGroup;
  login!: any;
  title!: any;
  @ViewChild('file')
  file!: ElementRef;
  $itineraryDetailsSub!: Subscription;
  itineraryDetailsList!: ItineraryDetails[];

  //for mat =-table
  displayedColumns: string[] = ['date', 'time', 'location', 'activity', 'comments'];
  // dataSource!: MatTableDataSource<ItineraryDetails>;


  constructor(private fb: FormBuilder, 
              private router: Router, 
              private crud: CrudService) {
                // this.dataSource = new MatTableDataSource(this.itineraryDetailsList);
              }

  ngOnInit(): void {
    this.detailsform = this.detailsForm();
    this.login = localStorage.getItem('login');
    this.title = localStorage.getItem("title");
    this.$itineraryDetailsSub = this.crud.getItineraryDetails(this.login, this.title).subscribe(
      (list: ItineraryDetails[]) => {
        if (list && list.length > 0) {
          console.info(list);
          this.itineraryDetailsList = list;
        } else {
          console.info(">>Can't fetch list of itinerary details..")
        }
      },
    );
  }

  ngOnDestroy(): void {
      if (this.$itineraryDetailsSub) {
        this.$itineraryDetailsSub.unsubscribe();
      }
      this.detailsform.reset();
  }
  
  private detailsForm(): FormGroup {
    this.login = localStorage.getItem('login');
    this.title = localStorage.getItem("title");
    return this.fb.group({
      login: this.fb.control<string>(this.login),
      title: this.fb.control<string>(this.title),
      activitydate: this.fb.control<string>('', [ Validators.required ]),
      time: this.fb.control<string>('', [ Validators.required, Validators.max(2359) ]),
      location: this.fb.control<string>('', [ Validators.maxLength(100) ]),
      activity: this.fb.control<string>('', [ Validators.required, Validators.maxLength(100) ]),
      comments: this.fb.control<string>('', [ Validators.maxLength(300)])
    })
  }

  //this adds activity to the SQL
  //also, this will show the newly added activity below once added
  addActivity() {
    const formVal = this.detailsform.value;
    //postItineraryDetails will redirect, hence OnDestroy will happen and form resets
    if (this.file && this.file.nativeElement.files.length > 0) {
      if (this.file.nativeElement.files[0].size < 2000 * 1024) {
        this.crud.postItineraryDetails(formVal, this.file);
        this.crud.redirectTo('/view3');
      } else {
        alert("Please select only file size < 2MB");
      } 
    } else {
      this.crud.postItineraryDetails(formVal, this.file);
      this.crud.redirectTo('/view3');
    }
  }

  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }

}