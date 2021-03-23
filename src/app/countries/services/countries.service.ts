import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountrySmall, Country } from '../interfaces/countries.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _baseUrl : string = 'https://restcountries.eu/rest/v2';
  private _continentes : string[] = ['Africa', 'Americas', 'Europe', 'Oceania'];


  get continentes(): string[]{
    return [...this._continentes];
  }
  constructor( private http: HttpClient) { }



  getCountriesByRegion( region: string ): Observable<CountrySmall[]>{
    const url: string = `${ this._baseUrl }/region/${region}?fields=alpha3Code;name`;

    return this.http.get<CountrySmall[]>(url);
  }
  getBordersByCode( code: string ): Observable< Country | null >{
    if ( !code ){
      return of(null);
    }
    const url: string = `${ this._baseUrl }/alpha/${code}`;
    return this.http.get<Country>(url);
  }


  getBordersByCodeSmall( code: string ): Observable<CountrySmall>{
    const url: string = `${ this._baseUrl }/alpha/${code}?fields=alpha3Code;name`;
    return this.http.get<CountrySmall>(url);
  }


  getCountriesByCode( borders: string[] ): Observable<CountrySmall[]>{
    if ( !borders ){
      return of([]);
    }

    const peticiones: Observable<CountrySmall>[] = [];

    borders.forEach( code => {
      // Aqui hago la peticion pero nunca disparo el observable, solo lo almaceno
      const peticion = this.getBordersByCodeSmall(code);
      peticiones.push(peticion);
    });
    // CombineLatest ejecuta todos los observables
    return combineLatest(peticiones);



  }
}
