import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface RecipeResponse {
  success: boolean,
  recipes: any[]
}
interface RecipeAIResponse {
  success: boolean,
  data?: any,
  message?: string
}


interface Recipe {
  name?: string,
  ingredient?: string,
  minServings?: number,
  maxServings?: number,
  limit?: number
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private API_URL = "http://localhost:3000";

  constructor(private httpClient: HttpClient) {
    this.API_URL = environment.API_URL;
  }

  searchRecipes(queryParams: Recipe = {}): Observable<RecipeResponse> {
    const url = `${this.API_URL}/recipe/`;
    let params = new HttpParams();

    if (queryParams.name) {
      params = params.set('name', queryParams.name);
    }
    if (queryParams.ingredient) {
      params = params.set('ingredient', queryParams.ingredient);
    }
    if (queryParams.minServings != null) {
      params = params.set('minServings', queryParams.minServings.toString());
    }
    if (queryParams.maxServings != null) {
      params = params.set('maxServings', queryParams.maxServings.toString());
    }
    if (queryParams.limit != null) {
      params = params.set('limit', queryParams.limit.toString());
    }
    return this.httpClient.get<RecipeResponse>(url, { params, withCredentials: true });
  }

  generateAIRecipe(recipeName: string): Observable<RecipeAIResponse> {
    return this.httpClient.post<RecipeAIResponse>(`${this.API_URL}/ai-recipe`, {
      recipeName
    }, { withCredentials: true })
  }

  addRecipe(data:Recipe = {}): Observable<RecipeAIResponse>{
    return this.httpClient.post<RecipeAIResponse>(`${this.API_URL}/recipe`, data, {withCredentials: true})
  }
}
