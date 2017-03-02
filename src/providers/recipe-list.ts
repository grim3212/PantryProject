import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Recipe } from '../models/recipe'
import { RecipeData } from '../models/recipe-data';
import { Platform } from 'ionic-angular';
import { PantryListService } from './pantry-list';
import { Item } from '../pages/products/item/item';

const apiKey = 'FBiqUe796amshHCRsuDjukypRhO4p1C7p0FjsnURXVaA5HhxLS';

@Injectable()
export class RecipeListService {

    private headers: Headers;
    private reqOps: RequestOptions;
    itemList: Item[];
    items: string;   //to return, string of item breadcrumbs

    constructor(private http: Http, private pantryService: PantryListService) {

        //Initialize headers and requestoptions for api calls
        this.headers = new Headers();
        this.headers.append('X-Mashape-Key', apiKey);
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json ');

        this.reqOps = new RequestOptions({
            headers: this.headers
        });

        this.itemList = pantryService.getPantryItems();
    }

    recipeByIngredients(items: string, numRecipes: string, sort: string): Observable<any[]> {
        let ingrds = '?fillIngredients=true&ingredients=' + items;
        let numIngrds = '&limitLicense=false&number=' + numRecipes;
        let rank = '&ranking=' + sort;

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients'
            + ingrds + numIngrds + rank, this.reqOps).map(res => <any[]>res.json())
    }

    recipeByName(numRec: string, keywords: string): Observable<any> {
        let ingrds = '?instructionsRequired=false&limitLicense=false';
        let numRecipes = '&number=' + numRec;
        let offset = '&offset=0';
        let query = '&query=' + keywords;

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search'
        + ingrds + numRecipes + offset + query, this.reqOps).map(res => <any>res.json());
    }

    recipeID(id: string): Observable<Recipe> {
        let headers = new Headers();
        headers.append('X-Mashape-Key', apiKey);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json ');

        let reqOps = new RequestOptions({
            headers: headers
        });

        let recipe = id + '/information?includeNutrition=false';

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'
            + recipe, reqOps).map(res => <Recipe>res.json())
    }

    //Return an item list as a string of breadcrumbs for string literal search
    getItemList() {
        //Reload the database before retrieving any updated pantry items
        this.pantryService.load();
        this.itemList = this.pantryService.getPantryItems();
        
        //Load pantry items and store as a string in "items"
        for (let item of this.itemList) {
            console.log(item.id);
            this.items = this.items + ', ' + item.info.breadcrumbs[0]; 
        }

        return this.items;
    }
}
