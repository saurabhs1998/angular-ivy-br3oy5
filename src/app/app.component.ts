import { Component, OnInit } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';


@Component({
  selector: 'my-app',
  template:`
  <div>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <h2 style="text-decoration:none; font-size:30px;color: black;">
    Weather Application
    </h2>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
</nav>
  </div>
  
  
  <div style="text-align: center">
    <h2>CHECK WEATHER</h2>
    <input type="text" placeholder="Enter city" [formControl]="searchInput">
    <h3>{{weather}}</h3>
    </div>`
})
export class AppComponent implements OnInit {
  private baseWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
  private urlSuffix = "&units=metric&APPID=abe1eb51289c21c167c66ce790c2fac3";

  searchInput = new FormControl();
  weather: string;

  constructor(private http: HttpClient) { }


  ngOnInit() {

    this.searchInput.valueChanges
      .pipe(debounceTime(200),
        switchMap(city => this.getWeather(city)))
      .subscribe(
        res => {
          this.weather =
            `Current temperature is  ${res['main'].temp}C, ` +
            `humidity: ${res['main'].humidity}%`;
        },
        err => console.log(`Can't get weather. Error code: %s, URL: %s`,
          err.message, err.url)
      );
  }

  getWeather(city: string): Observable<any> {
    return this.http.get(this.baseWeatherURL + city + this.urlSuffix)
      .pipe(catchError(err => {
        if (err.status === 404) {
          console.log(`City ${city} not found`);
          return EMPTY
        }
      })
      );
  }
}
