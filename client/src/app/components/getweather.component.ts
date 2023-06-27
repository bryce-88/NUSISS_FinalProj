import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../services/weather.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Weather } from '../model';

@Component({
  selector: 'app-getweather',
  templateUrl: './getweather.component.html',
  styleUrls: ['./getweather.component.css']
})
export class GetweatherComponent implements OnInit {

  form!: FormGroup;
  params$!: Subscription;
  // weather: Weather = new Weather('', '', 0, 0, 0, 0, 0, '');
  weather!: Weather;
  error: string = '';
  showWeather: boolean = false;

  constructor(private router: Router, private weatherSvc: WeatherService, private fb: FormBuilder) {}

  ngOnInit(): void {
      this.form = this.weatherForm();
  }

  //this will be on ngSubmit
  getWeather() {
    this.error = '';
    const city = this.form.value['city'];
    this.weatherSvc.getWeather(city)
      .then( (result) => {
        console.log(result.toString());
        if (result['description'] !== 'null') {
          this.showWeather = true;
          this.weather = new Weather(
            city, 
            result['description'],
            result['temp'],
            result['tempMin'],
            result['tempMax'],
            result['feelsLike'],
            result['humidity'],
            result['icon']
          )
        if (!result) {
          this.showWeather = false;
          this.error = "Your 'City' name may not be valid. Please try again";
          this.form.reset();
        }
        };
        console.info(">> check: " + result);
      }).catch( (err) =>{
        console.log(err);
        this.showWeather = false;
        this.error = "Your 'City' name may not be valid. Please try again";
        this.form.reset();
      })
  }


  weatherForm(): FormGroup {
    return this.fb.group({
      city: this.fb.control<string>('', [ Validators.required ])
    })
  }

  logout() {
    localStorage.setItem('login', '');
    localStorage.setItem('password', '');
    this.router.navigate(['/view0'])
  }


}

/*
export interface Weather {
  city: string;
  description: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  feelsLike: number;
  humidity: number;
  icon: string;
}
*/