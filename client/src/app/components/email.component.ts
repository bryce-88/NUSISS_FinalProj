import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../services/crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  form!: FormGroup;
  attachmentFile!: File;

  constructor(private fb: FormBuilder,
              private crud: CrudService,
              private router: Router) {}

  ngOnInit(): void {
      this.form = this.emailForm();
  }

  emailForm() {
    return this.fb.group({
      recipient: this.fb.control<string>('', [ Validators.required, Validators.email ]),
      msgBody: this.fb.control<string>('', [ Validators.required ]),
      subject: this.fb.control<string>('', [ Validators.required ])
     })
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.attachmentFile = fileList[0];
    }
  }

  sendEmail() {
    const formVal = this.form.value;
    this.crud.sendEmailWithAttachment(formVal, this.attachmentFile);
  }

  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }

}
