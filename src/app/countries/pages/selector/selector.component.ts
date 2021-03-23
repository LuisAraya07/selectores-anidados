import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { CountrySmall } from '../../interfaces/countries.interface';
import { switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    country : ['', Validators.required],
    border  : ['', Validators.required]
  });

  // Llenar selectores

  continentes: string[] = [];
  countries: CountrySmall[] = [];
  //borders: string[] = [];

  borders: CountrySmall[] = [];

  // UI
  cargando : boolean = false;







  constructor( private fb: FormBuilder, private countriesService: CountriesService ) { }

  ngOnInit(): void {
    this.continentes = this.countriesService.continentes;

    // Cuando cambie la region
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.myForm.get('country')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.countriesService.getCountriesByRegion(region))
      )
      // tslint:disable-next-line: deprecation
      .subscribe( countries => {
        this.countries = countries;
        this.cargando = false;
      });


      // Cuando cambie el pais
    this.myForm.get('country')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.myForm.get('border')?.reset('');
        this.borders = [];
        this.cargando = true;
      }),
      // Recibimos el pais como tal
      switchMap( code => this.countriesService.getBordersByCode(code)),
      // Recibimos el arreglo de paises que son fronteras al de arriba
      switchMap( country => this.countriesService.getCountriesByCode( country?.borders! ))
    )
    // tslint:disable-next-line: deprecation
    .subscribe( countries => {
      //this.borders = country?.borders || [];
      this.borders = countries;
      this.cargando = false;
    });
  }


  save(){ 

  }

}
