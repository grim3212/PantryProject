import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Recipe } from '../models/recipe'

const apiKey = 'FBiqUe796amshHCRsuDjukypRhO4p1C7p0FjsnURXVaA5HhxLS';

@Injectable()
export class Search {

    constructor(private http: Http) {}

    recipeByIngredients(items: string, numItems: string, sort: string): Observable<Recipe[]> {
        let headers = new Headers();
        headers.append('X-Mashape-Key', apiKey);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json ');

        let reqOps = new RequestOptions({
            headers: headers
        });

        let ingrds= '?fillIngredients=false&ingredients=' + items;
        let numIngrds = '&limitLicense=false&number=' + numItems;
        let rank = '&ranking=' + sort;

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients'
            + ingrds + numIngrds + rank, reqOps).map(res => <Recipe[]>res.json())
    }
}
