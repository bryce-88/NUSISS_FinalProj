import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '../constants';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(city: string) {

    const queryParams = new HttpParams().set("city", city);

    return lastValueFrom(this.http.get<any>(SERVER_URL + '/weather', { params: queryParams }))
  }


}