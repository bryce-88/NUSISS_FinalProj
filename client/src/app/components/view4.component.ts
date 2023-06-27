import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItineraryDetails } from '../model';
import { CrudService } from '../services/crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view4',
  templateUrl: './view4.component.html',
  styleUrls: ['./view4.component.css']
})
export class View4Component implements OnInit {

  login!: any;
  title!: any;
  status!: string;
  $itineraryDetailsSub!: Subscription;
  itineraryDetailsList!: ItineraryDetails[];
  $itineraryEditSub!: Subscription;
  itineraryToEdit!: ItineraryDetails;
  toEditStatus: boolean = false;
  editForm!: FormGroup;
  pdfDataUrl!: string;
  buffer!: string;
  @ViewChild('file')
  file!: ElementRef;

  displayedColumns: string[] = ['date', 'time', 'location', 'activity', 'comments', 'file', 'actions'];

  constructor(private router: Router, private crud: CrudService, private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.title = localStorage.getItem('title');
    this.login = localStorage.getItem('login');
    this.$itineraryDetailsSub = this.crud.getItineraryDetailsForDisplay(this.login, this.title).subscribe(
      (response: any) => {
        if (response['activities']) {
          const activities = response.activities;
          // console.info(list);
          this.itineraryDetailsList = activities;

          for (let i = 0; i < this.itineraryDetailsList.length; i++) {
            if (this.itineraryDetailsList[i].file) {
              console.info(">>in the if loop")
              let attachment = this.itineraryDetailsList[i].file
              this.buffer = attachment.split(',')[1];
              this.pdfDataUrl = this.base64PDFToBlobUrl(this.buffer);
              this.itineraryDetailsList[i].file = this.pdfDataUrl;
              console.info(">>> converted base64pdfblobUrl " + this.itineraryDetailsList[i].file);
            } else {
              console.info(">> file " + this.itineraryDetailsList[i].file)
              this.itineraryDetailsList[i].file = "";
            }
          }
        } else if (!response['activities']) {
          console.info(">>No activities planned yet")
        }
      },
    );
  }

  // ngOnDestroy(): void {
  //     this.$itineraryDetailsSub.unsubscribe();
  // }


  async delete(count: number) {
    try {
      const deleteStatus = await this.crud.deleteSingleItineraryDetail(count);
      console.log(">> delete status: " + deleteStatus['Status']);
      this.crud.redirectTo('/view4')
    } catch (error) {
      console.error('Error deleting itinerary', error);
    }
  }


  editActivity(count: number) {

    let lineCount = count.toString()
    localStorage.setItem('count', lineCount);

    this.$itineraryEditSub = this.crud.getSingleItineraryDetail(count).subscribe(
      (activityLine) => {
        if (activityLine) {
          this.itineraryToEdit = activityLine;
          // console.info("Itinerary to Edit: " + JSON.stringify(this.itineraryToEdit));
          let login = this.itineraryToEdit['login'];
          let title = this.itineraryToEdit['title'];
          let activitydate = this.itineraryToEdit['activitydate'];
          let time = this.itineraryToEdit['time'];
          let location = this.itineraryToEdit['location'];
          let activity = this.itineraryToEdit['activity'];
          let comments = this.itineraryToEdit['comments'];
          let attachment = this.itineraryToEdit['file'];

          if (attachment) {
            // console.info("Attachment: " + attachment) //starts with "data:application/pdf;base64,.."
            this.buffer = attachment.split(',')[1];
            this.pdfDataUrl = this.base64PDFToBlobUrl(this.buffer);
            // console.info("Inside If Block PDF Data URL: " + this.pdfDataUrl)
          } else {
            this.pdfDataUrl = attachment; //resets attribue when editActivity is clicked on a row that has no attachment
          }

          this.toEditStatus = true;

          if (this.toEditStatus == true) {
            this.editForm = this.fb.group({
              login: this.fb.control<string>(login), //login and title are passed on anyways, don't need to include additional validators
              title: this.fb.control<string>(title),
              activitydate: this.fb.control<Date>(activitydate, [ Validators.required ]),
              time: this.fb.control<string>(time, [ Validators.required, Validators.max(2359) ]),
              location: this.fb.control<string>(location, [ Validators.maxLength(100) ]),
              activity: this.fb.control<string>(activity, [ Validators.required, Validators.maxLength(100) ]),
              comments: this.fb.control<string>(comments, [ Validators.maxLength(300)])
            })
          }
        }
      }
    )
  }

  update() {

    let count = Number(localStorage.getItem('count'));
    console.info("localStorage count: " + count)

    const formVal = this.editForm.value;
    if (this.file && this.file.nativeElement.files.length > 0) {
      if (this.file.nativeElement.files[0].size < 2000 * 1024) {
        this.crud.updateItineraryActivity(count, formVal, this.file);
      } else {
        alert("Please select only file size < 2MB");
      } 
    } else {
      this.crud.updateItineraryActivity(count, formVal, this.file);
    }

    this.toEditStatus = false;
    this.crud.redirectTo('/view4');
  }


  removeFile() {
    this.file.nativeElement.value = "";
    this.pdfDataUrl = "";
  }


  editStatus() {
    this.toEditStatus = false;
  }


  openPdfInNewTab(base64Pdf: string) {
    const pdfData = base64Pdf;
    window.open(pdfData, '_blank');
  }


  base64PDFToBlobUrl( base64: string ) {
    const binStr = atob( base64 );
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[ i ] = binStr.charCodeAt( i );
    }
    const blob =  new Blob( [ arr ], { type: 'application/pdf' } );
    const url = URL.createObjectURL( blob );
    // console.log("BlobUrl from base64: " + url)
    return url;
  }

  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }



}
