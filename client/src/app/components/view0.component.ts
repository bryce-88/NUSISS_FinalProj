import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../services/crud.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view0',
  templateUrl: './view0.component.html',
  styleUrls: ['./view0.component.css']
})
export class View0Component implements OnInit, OnDestroy {

  form!: FormGroup;
  $loginStatusSub!: Subscription;
  loginStatus!: string;
  error: string = '';

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

  submit() {
    this.error = '';
    if (this.form.valid && this.form) {
      const formData = this.form.value;
      this.$loginStatusSub = this.crud.userLogin(formData).subscribe(
        (status: any) => {

          this.loginStatus = status['Status'];
          console.info(">> loginStatus: " + this.loginStatus);
          if (this.loginStatus === 'Success') {
            console.info("Submit success")
            localStorage.setItem('login', this.form.value['login']);
            this.router.navigate(['/view1']);
          } else if (this.loginStatus === 'Invalid') {
            this.error = "Username or password invalid. Please try again."
          }
          
        },
        error => {
          console.log(">>Login Error");
          this.error = "Username or password invalid. Please try again."
        }
      )

    }
  }


  ngOnDestroy(): void {
    if (this.$loginStatusSub)
      this.$loginStatusSub.unsubscribe();
  }

}
