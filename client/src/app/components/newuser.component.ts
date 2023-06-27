import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewuserComponent implements OnInit {

  form!: FormGroup;
  $createStatusSub!: Subscription;
  createStatus!: string;
  error?: string;
  success?: string;

  constructor(private fb: FormBuilder, private crud: CrudService, private router: Router) {}

  ngOnInit(): void {
    this.form! = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      login: this.fb.control<string>('', [ Validators.required, Validators.email, Validators.maxLength(50) ]),
      password: this.fb.control<string>('', [ Validators.required, Validators.minLength(6), Validators.maxLength(20) ])
    })
  }

  create() {
    this.error = '';
    this.success = '';
    if (this.form.valid && this.form) {
      const formData = this.form.value;
      this.$createStatusSub = this.crud.newUser(formData).subscribe(
        (status: any) => {
          this.createStatus = status['Status'];
          console.info(">> createStatus: " + this.createStatus)
          if (this.createStatus === 'Created') {
            this.success = "Account created! Click 'Back' to login"
            // this.router.navigate(['/view0']);
          } else if (this.createStatus === 'Invalid') {
            this.error = "E-mail exists. Please choose another e-mail."
          } else if (this.createStatus === 'Failed') {
            this.error = "Could not create account. Please contact administrator."
          }
        },
        error => {
          console.log(">>Login Error");
          this.error = "Could not create account. Please contact administrator."
        }
      )
    }
  }


}
