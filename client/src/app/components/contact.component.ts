import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  form!: FormGroup;
  submitted!: boolean;
  dummymessage = "We thank you for your valuable feedback!"

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.submitted = false;
      this.form = this.feedbackForm();
  }

  feedbackForm() {
    return this.fb.group({
      subject: this.fb.control<string>('', [ Validators.required ]),
      msgBody: this.fb.control<string>('', [ Validators.required ])
     })
  }

  submit() {
    this.submitted = true;
    if (this.submitted == true) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '300px',
        panelClass: 'custom-panel-success',
        data: { message: this.dummymessage }
      });
    }
  }

  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }

}



