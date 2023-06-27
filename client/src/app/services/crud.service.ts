import { ElementRef, Injectable } from '@angular/core';
import { SERVER_URL } from '../constants';
import { Itineraries, ItineraryDetails } from '../model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog.component';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  status!: number;
  emailStatus!: string;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) { }

  getItinerary(login: string): Observable<any> {
    const queryParams = new HttpParams().set("login", login);
    return this.http.get<Itineraries[]>(SERVER_URL + '/getitinerary', { params: queryParams });
  }

  deleteItinerary(login: string, title: string): Promise<any> {
    return lastValueFrom(this.http.delete<string>(SERVER_URL + '/delete/' + login + '/' + title));
  }

  //this is for view2
  postItinerary (form: any) {
    const titleForm = new FormData();

    titleForm.set('login', form['login']);
    titleForm.set('title', form['title']);
    const login = titleForm.get('login');
    const title = titleForm.get('title');
    // console.info('service login and title: ' + login + ' and ' + title);
    const httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };

    this.http.post<number>(SERVER_URL + '/post/' + login + '/' + title, titleForm, httpHeader).subscribe({
      next: v => {
        this.status = v.valueOf();
        console.log(">>v: " + this.status)
        if (this.status === 1) {
          this.router.navigate(['/view3'])
        }
      },
      error: (err) => {
        const errorMessage = 'You already have that itinerary! Please choose another name for your title.';
        alert(errorMessage);
      } 
    })
  }

  //this is for view3
  postItineraryDetails(form: any, file: ElementRef) {
    const detailsForm = new FormData();

    // console.log(">> crud service file name: " + file.nativeElement.files[0].name)
    // console.log(">> crud service file size: " + file.nativeElement.files[0].size)

    detailsForm.set('login', form['login']);
    detailsForm.set('title', form['title']);
    detailsForm.set('activitydate', form['activitydate']);
    detailsForm.set('time', form['time']);
    detailsForm.set('location', form['location']);
    detailsForm.set('activity', form['activity']);
    detailsForm.set('comments', form['comments']);
    detailsForm.set('file', file.nativeElement.files[0]);

    console.info("test for empty file: " + detailsForm.get('file'));

    this.http.post<number>(SERVER_URL + '/post/activity', detailsForm).subscribe({
      next: v => {
        this.status = v.valueOf();
        console.log(">>v: " + this.status)

        if (this.status === 1) {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '300px',
            panelClass: 'custom-panel-success',
            data: { message: 'Activity added!' }
          });
    
          dialogRef.afterClosed().subscribe(result => {
            console.log('Activity add acknowledged');
            //TODO: view3 to include a refresh to display the itinerary below
            this.redirectTo('/view3');
          });
        }
      },
      error: (err) => {
        const errorMessage = 'Activity not added';
        alert(errorMessage);
      } 
    })
  }

  //this is for view3 and view4
  getItineraryDetails(login: string, title: string): Observable<any> {
    const queryParams = new HttpParams().set("login", login)
                                        .set("title", title);
    return this.http.get<ItineraryDetails[]>(SERVER_URL + '/add', { params: queryParams });
  }

  getItineraryDetailsForDisplay(login: string, title: string): Observable<any> {
    const queryParams = new HttpParams().set("login", login)
                                        .set("title", title);
    return this.http.get<string>(SERVER_URL + '/getdisplay', { params: queryParams });
  }


  deleteSingleItineraryDetail(count: number): Promise<any> {
    return lastValueFrom(this.http.delete<string>(SERVER_URL + '/delete/' + count))
  }


  getSingleItineraryDetail(count: number) {
    return this.http.get<ItineraryDetails>(SERVER_URL + '/getedit/' + count);
  }


  updateItineraryActivity(count: number, form: any, file: ElementRef) {
    const detailsForm = new FormData();

    // console.log(">> crud service file name: " + file.nativeElement.files[0].name)
    // console.log(">> crud service file size: " + file.nativeElement.files[0].size)

    detailsForm.set('login', form['login']);
    detailsForm.set('title', form['title']);
    detailsForm.set('activitydate', form['activitydate']);
    detailsForm.set('time', form['time']);
    detailsForm.set('location', form['location']);
    detailsForm.set('activity', form['activity']);
    detailsForm.set('comments', form['comments']);
    detailsForm.set('file', file.nativeElement.files[0]);

    // console.info("detailForm values: " + detailsForm.get('file') + ' ' + detailsForm.get('title') + ' ' + count)

    this.http.put<number>(SERVER_URL + '/update/' + count, detailsForm).subscribe({
      next: v => {
        this.status = v.valueOf();
        console.log(">>v: " + this.status)

        if (this.status === 1) {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '300px',
            panelClass: 'custom-panel-success',
            data: { message: 'Activity updated!' }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('Activity update acknowledged');
            this.redirectTo('/view4');
          });
        }
      },
      error: (err) => {
        const errorMessage = 'Activity not updated';
        alert(errorMessage);
      } 
    })
  }


  sendEmailWithAttachment(form: any, attachment: File) {
    const email = new FormData();

    email.set('recipient', form['recipient']);
    email.set('msgBody', form['msgBody']);
    email.set('subject', form['subject']);
    email.set('attachment', attachment);

    this.http.post<string>(SERVER_URL + '/senditinerary', email).subscribe({
      next: (resp: any) => {
        this.emailStatus = resp['Status'];
        console.log(">>resp: " + this.emailStatus);

        if (this.emailStatus === "Success") {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '300px',
            panelClass: 'custom-panel-success',
            data: { message: 'Email sent' }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('Email sent acknowledged');
            this.redirectTo('/view5');
          });
        } else if (this.emailStatus === "Failed") {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '300px',
            panelClass: 'custom-panel-failure',
            data: { message: 'Email cannot be sent' }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('Email not sent acknowledged');
          });
        }
      },
      error: (err) => {
        const errorMessage = "Exception Error: Email not sent"
        alert(errorMessage);
      }
    })
  }


  userLogin(form: any): Observable<string> {

    const loginForm = new FormData();

    loginForm.set('login', form['login']);
    loginForm.set('password', form['password']);

    return this.http.post<string>(SERVER_URL + '/user', loginForm);
  }

  
  newUser(form: any): Observable<string> {

    const createForm = new FormData();

    createForm.set('login', form['login']);
    createForm.set('password', form['password']);

    return this.http.post<string>(SERVER_URL + '/create', createForm);
  }


  redirectTo(uri: string) {
    this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() =>
    this.router.navigate([uri]));
  }

}
