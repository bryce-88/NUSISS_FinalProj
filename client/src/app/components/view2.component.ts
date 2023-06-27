import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-view2',
  templateUrl: './view2.component.html',
  styleUrls: ['./view2.component.css']
})
export class View2Component implements OnInit {

  titleform!: FormGroup;
  title!: string;
  login!: any;
  
  constructor(private fb: FormBuilder, 
              private router: Router, 
              private crud: CrudService) {}

  ngOnInit(): void {
      this.titleform = this.titleForm();
  }

  private titleForm(): FormGroup {
    this.login = localStorage.getItem('login');
    return this.fb.group({
      login: this.fb.control<string>(this.login),
      title: this.fb.control<string>('', [ Validators.required, Validators.minLength(1), Validators.maxLength(20) ])
    })
  }


  addActivities(): void {
    const formVal = this.titleform.value;
    // const formTitle = this.titleform.value['title'];
    // console.info(">>> formTitle: " + this.titleform.value['title']);
    // console.info(">>> login: " + this.titleform.value['login']);
    localStorage.setItem("title", this.titleform.value['title']);
    this.crud.postItinerary(formVal);
  }


  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }

}

