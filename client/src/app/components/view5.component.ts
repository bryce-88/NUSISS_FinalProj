import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { Subscription } from 'rxjs';
import { ItineraryDetails } from '../model';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'html2pdf.js';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view5',
  templateUrl: './view5.component.html',
  styleUrls: ['./view5.component.css']
})
export class View5Component {

  title!: any;
  $itineraryDetailsSub!: Subscription;
  itineraryDetailsList!: ItineraryDetails[];
  pdfDataUrl!: string;
  buffer!: string;
  login!: any;

  displayedColumns: string[] = ['date', 'time', 'location', 'activity', 'comments', 'file'];

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

  // tried to make pdf attachment in Itinerary clickable, but not working
  exportToPDF() {
    const doc = new jsPDF({
      orientation: 'landscape',
    });
  
    const fileName: string = this.title + '_itinerary.pdf';
  
    let htmlPage: any = document.getElementById('saveContent');
    let contentWidth = htmlPage.offsetWidth;
  
    // const tableElement = htmlPage.querySelector('table');
    // const fileCells = tableElement.querySelectorAll('td.mat-cell[matcell]');
  
    // fileCells.forEach((cell: any) => {
    //   const linkElement = cell.querySelector('a');
    //   if (linkElement) {
    //     const fileUrl = linkElement.getAttribute('href');
    //     const fileText = linkElement.innerText;
  
    //     cell.innerHTML = `<a href="${fileUrl}" target="_blank">${fileText}</a>`;
    //   }
    // });
  
    html2canvas(htmlPage, {
      useCORS: true,
      scale: 1, // Adjust the scale if needed
    }).then((canvas) => {
      const imgData = canvas.toDataURL('application/pdf');
  
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      doc.addImage(imgData, 'PDF', 0, 0, pdfWidth, pdfHeight);
      doc.save(fileName);
    });
  }
  

  email() {
    this.router.navigate(['/email']);
  }


  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }
  
}
