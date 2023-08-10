import { Component, OnInit } from '@angular/core';
import { WeatherDataService } from './services/weather-data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'WeatherApp';
  Today = new Date();
  pipe = new DatePipe('en-US');
  unit = "°C";
  celcius = true;
  ChangedFormat = this.pipe.transform(this.Today, 'd MMMM YYYY');
  city = 'Cúcuta';
  citySearch='';
  searchMode=false;
  longitude='';
  mainTemp:any;
  mainWeather='';
  forecast:any=[];

  constructor(private WeatherDataService: WeatherDataService) {}
  
  ngOnInit(): void {
    
    this.getLocation().then((el:any)=>{
      this.citySelected.lat = el.lat;
      this.citySelected.lon = el.lng;
      this.loadWeatherToday();
      this.loadForecastToday();
    });
  }

  loadForecastToday(){
    this.getForecast().then((ele:any)=>{
      this.forecast=ele;
      this.daysWeatheer.forEach((el:any) => {
        let date = this.Today.setDate(this.Today.getDate() + 1); 
        let dateToValidate = this.pipe.transform(this.Today, 'YYYY-MM-dd');
        let dataForecast = this.forecast.list.filter((p:any)=>p.dt_txt.split(" ")[0]==dateToValidate);
        let min:any = 0;
        let max:any = 0; 
        el.icon='assets/img/'+ dataForecast[0].weather[0].main + '.png';
        dataForecast.forEach((el:any)=>{
          min = parseFloat(min + el.main.temp_min) ;
          max = parseFloat(max + el.main.temp_max);
        });
        el.min= (min/parseFloat(dataForecast.length)) - 273.15;
        el.max= (max/parseFloat(dataForecast.length)) - 273.15;
        if(el.day=='')
        el.day = this.dayOfWeek.find((el:any)=> el.id == this.Today.getDay()).dia; 
        el.date=this.pipe.transform(date, 'd MMMM');
      });
    });
  }

  loadWeatherToday(){
    this.loadWeather(this.citySelected.lat, this.citySelected.lon).then((ele:any)=>{
      console.log(ele)
      this.citySelected.name=ele.name;
      var wind = this.hightLights.find((p:any)=>p.id==1);
      wind.dataValue=ele.wind.speed;
      wind.deg = ele.wind.deg;
      var humidity = this.hightLights.find((p:any)=>p.id==2);
      humidity.dataValue=ele.main.humidity;
      var visibility = this.hightLights.find((p:any)=>p.id==3);
      visibility.dataValue=parseFloat(ele.visibility)/1609;
      var preassure = this.hightLights.find((p:any)=>p.id==4);
      preassure.dataValue=ele.main.pressure;
      this.mainTemp=parseFloat(ele.main.temp) - 273.15 ;
      this.mainWeather = ele.weather[0].main ;
      this.citySelected.icon = 'assets/img/' + ele.weather[0].main + '.png';
    });
  }

  getForecast(){
    return new Promise<any>((resolve, reject)=>{
      this.loadForecast(this.citySelected.lat, this.citySelected.lon).then((el:any)=>{
        resolve(el);
      });
    })
  }

  loadForecast(lat:number, lon:number){
    return new Promise<any>((resolve, reject)=>{
      this.WeatherDataService.getForecastData(lat, lon).subscribe((r:any) => resolve(r))
    })
  }

  changeUnit(val:boolean){
    this.celcius=val;
    if(val){
      if(!(this.unit=="°C")){
        this.unit="°C";
        this.daysWeatheer.forEach((el:any) => {
          el.min = (parseFloat(el.min) * 9/5) + 32;
          el.max = (parseFloat(el.max) * 9/5) + 32;
        });
        this.mainTemp =(parseFloat(this.mainTemp) * 9/5) + 32;
      }
    }else{
      if(!(this.unit=="°F")){
        this.unit="°F";
        this.daysWeatheer.forEach((el:any) => {
          el.min = (parseFloat(el.min) - 32) * 5/9;
          el.max = (parseFloat(el.max) - 32) * 5/9;
        });
        this.mainTemp =(parseFloat(this.mainTemp) - 32) * 5/9;
      }
    }
  }

  cargarCiudad(el:string){
    return new Promise<any>((resolve, reject) => {
      this.WeatherDataService.getCity(el).subscribe((r: any) => resolve(r));
    })
  }

  loadWeather(lat:number, lon:number){
    return new Promise<any>((resolve, reject)=>{
      this.WeatherDataService.getWeather(lat, lon).subscribe((r:any) => resolve(r))
    })
  }

  searchModeChange(validate:boolean){
    this.searchMode=validate;
    if(validate){
      this.citiesFound=[];
      this.citySearch = '';
    }
  }

  searchCity(){
    this.cargarCiudad(this.citySearch).then((el: any) =>
      setTimeout(() => {
        this.citiesFound=el;
      }, 1000)
    );
  }

  selectCity(name:string, lat:number, lon:number){
    this.citySelected.name = name;
    this.citySelected.lat = lat;
    this.citySelected.lon = lon;
    this.loadWeatherToday();
    this.Today=new Date();
    this.loadForecastToday();
    this.citiesFound=[];
    this.citySearch = '';
    this.searchMode = false;
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resp => {
                resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
            },
            err => {
                reject(err);
          });
    });
  }

  getLocation() {
    return new Promise<any>((resolve, reject)=>{
      this.getPosition().then(pos => {
        resolve(pos);
      });
    })
}

  citiesFound : any = []

  citySelected:any={
    'name':'',
    'lat':'',
    'lon':'',
    'icon':''
  }

  dayOfWeek:any=[
    {'id':0,'dia':'Domingo'},{'id':1,'dia':'Lunes'},{'id':2,'dia':'Martes'},{'id':3,'dia':'Miercoles'},{'id':4,'dia':'Jueves'},{'id':5,'dia':'Viernes'},{'id':6,'dia':'Sabado'}
  ]

  daysWeatheer : any = [
    {
      'day':'Tomorrow',
      'date':'',
      'icon':'assets/img/ModSleetSwrsDay.png',
      'min':'1',
      'max':'2'
    },
    {
      'day':'',
      'date':'',
      'icon':'assets/img/ModSleetSwrsDay.png',
      'min':'1',
      'max':'2'
    },
    {
      'day':'',
      'date':'',
      'icon':'assets/img/ModSleetSwrsDay.png',
      'min':'1',
      'max':'2'
    },
    {
      'day':'',
      'date':'',
      'icon':'assets/img/ModSleetSwrsDay.png',
      'min':'1',
      'max':'2'
    },
    {
      'day':'',
      'date':'',
      'icon':'assets/img/ModSleetSwrsDay.png',
      'min':'1',
      'max':'2'
    }
  ]

  hightLights : any = [
    {
      'id':1,
      'dataType': 'Wind status',
      'dataValue':20,
      'unit': 'mph',
      'deg':''
    },
    {
      'id':2,
      'dataType': 'Humidity',
      'dataValue':20,
      'unit': '%'
    },
    {
      'id':3,
      'dataType': 'Visibility',
      'dataValue':20,
      'unit': 'miles'
    },
    {
      'id':4,
      'dataType': 'Air Pressure',
      'dataValue':20,
      'unit': 'mb'
    },
  ]

}
