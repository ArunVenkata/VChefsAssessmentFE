import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input'
import { FormsModule } from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AiRecipeModalComponent } from '../ai-recipe-modal/ai-recipe-modal.component';
import { MyModalService } from '../services/mymodal.service';
import { BaseComponent } from '../base-component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzInputModule, NzAutocompleteModule, NzCardModule, NzModalModule, NzNotificationModule, NzToolTipModule, NzIconModule],
  providers: [NzModalService, MyModalService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {
  searchQuery: string = '';
  suggestions: any[] = [];
  recipes: any[] = [];
  selectedRecipes: any[] = []; // added for multi-recipe selection
  private searchSubject = new Subject<string>();

  constructor(
    private recipeService: RecipeService,
    private modal: NzModalService,
    private nzNotificationService: NzNotificationService,
    private myModalService: MyModalService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(query => {
        if (query) {
          this.recipeService.searchRecipes({ name: query }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {

            if (!res.success) {
              this.nzNotificationService.error("Something went Wrong", "Please try again later!");
              return;
            }
            this.suggestions = res.recipes.slice(0, 5);
          });
        } else {
          this.suggestions = [];
        }
      });
  }

  onSearchInputChange(value: string): void {
    this.searchSubject.next(value);
  }

  triggerSearch(event: Event): void {
    event.stopPropagation();
    if (this.searchQuery) {
      this.recipeService.searchRecipes({ name: this.searchQuery }).subscribe(res => {
        if (!res.success) {
          this.nzNotificationService.error("Something went Wrong", "Please try again later!");
          return;
        }
        this.recipes = res.recipes;
      });
    }
  }

  onSelectSuggestion(recipe: any): void {
    this.searchQuery = recipe.name;
    const res = this.addSelectedRecipe(recipe)
    if (!res)
      this.nzNotificationService.error("Selection Limit", "You can only select up to 4 recipes.");
    this.clearSearch();

  }

  addSelectedRecipe(recipe: any) {
    if (!this.selectedRecipes.find(r => r.name === recipe.name)) {
      if (this.selectedRecipes.length < 4) {
        this.selectedRecipes.push(recipe);
        return true;

      }
    }
    return false
  }

  showRecipeModal(recipe: any): void {
    let ingredientHtml = '';
    if (recipe.ingredients && recipe.ingredients.length) {
      ingredientHtml = `<h4>Ingredients:</h4><ul>` +
        recipe.ingredients.map((ing: any) => `<li>${ing.name}: ${ing.quantity || 1} ${ing.unit || ''}</li>`).join('') +
        `</ul>`;
    }
    this.modal.create({
      nzTitle: recipe.name,
      nzContent: `
        <div>
          <p>${recipe.description || 'Recipe details here...'}</p>
          ${ingredientHtml}
        </div>
      `,
      nzFooter: null
    });
  }

  toggleRecipeSelection(recipe: any): void {
    const exists = this.selectedRecipes.find(r => r.name === recipe.name);
    if (exists) {
      this.selectedRecipes = this.selectedRecipes.filter(r => r.name !== recipe.name);
    } else {
      if (this.selectedRecipes.length < 4) {
        this.selectedRecipes.push(recipe);
      } else {
        this.nzNotificationService.error("Selection Limit", "You can only select up to 4 recipes.");
      }
    }
  }

  showGroceryChecklist(): void {
    const consolidated: { [key: string]: number } = {};
    const consolidatedUnits: { [key: string]: number } = {};
    this.selectedRecipes.forEach(recipe => {
      if (recipe.ingredients && recipe.ingredients.length) {
        recipe.ingredients.forEach((ing: any) => {
          if (ing.unit && !consolidatedUnits.hasOwnProperty(ing.unit)) {
            consolidatedUnits[ing.name] = ing.unit
          }
          if (consolidated[ing.name]) {
            consolidated[ing.name] += ing.quantity;
          } else {
            consolidated[ing.name] = ing.quantity;
          }
        });
      }
    });
    const listHtml = `<ul>` + Object.keys(consolidated)
      .map(key => `<li>${key}: ${consolidated[key] || 1}  ${consolidatedUnits[key] || ''}</li>`)
      .join('') + `</ul>`;
    this.modal.create({
      nzTitle: 'Consolidated Checklist',
      nzContent: listHtml,
      nzFooter: null,
      nzWidth: 900
    });
  }

  clearSearch(): void {
    this.searchQuery = "";
    this.suggestions = [];

  }

  removeRecipe(recipe: any): void {
    this.selectedRecipes = this.selectedRecipes.filter(r => r.name !== recipe.name);
  }

  openAIModal(): void {
    console.log("HERE OPEN");
    const modal = this.myModalService.createModal({
      contentComponent: AiRecipeModalComponent,
      modalTitle: "Generate AI Recipe",
      primaryButtonText: "Confirm",
      componentInputParams: {

      }
    });

    modal.afterClose.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res) => {
      console.log("HERE recipe", res)
      if(res && res.name){
        this.addSelectedRecipe(res);

      }
    });
  }

  onLogout(){
    this.authService.removeAccessToken();
    this.router.navigate(["/login"])
  }
}