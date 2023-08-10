import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {

  constructor(private HttpClient:HttpClient) { }

  getCity(city:string):any{
    return this.HttpClient.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=188d638ee61da158148fb281dfe1c77d`);
  }

  getWeather(lat:number, lon:number):any{
    return this.HttpClient.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2433240723f75c5015acab719d4b500f`)
  }

  getForecastData(lat:number, lon:number):any{
    return this.HttpClient.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=2433240723f75c5015acab719d4b500f`)
  }

}
