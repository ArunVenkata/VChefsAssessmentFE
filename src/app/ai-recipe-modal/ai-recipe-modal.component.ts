import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RecipeService } from '../services/recipe.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from '../base-component';
import { takeUntil } from 'rxjs';
import { MyModalService } from '../services/mymodal.service';

@Component({
  selector: 'app-ai-recipe-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule, NzTableModule, NzNotificationModule],
  templateUrl: './ai-recipe-modal.component.html',
  styleUrls: ['./ai-recipe-modal.component.scss']
})
export class AiRecipeModalComponent extends BaseComponent implements OnInit {
  recipeName: string = '';
  loading: boolean = false;
  recipeData: any = null;
  errorMessage: string = '';

  constructor(
    private recipeService: RecipeService,
    private modalRef: NzModalRef<AiRecipeModalComponent>,
    private nzNotificationService: NzNotificationService,
    private myModalService: MyModalService
  ) {
    super();
  }
  
  ngOnInit(): void {
    this.myModalService.getPrimaryBtnClickEvent().pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      if (!this.recipeData){
        this.nzNotificationService.error("Please generate a valid recipe to add", "");
        return 
      }
      if (this.recipeData && this.recipeData.ingredients) {
        this.recipeData.ingredients = this.recipeData.ingredients.map((ingredient: any) => ({
          ...ingredient,
          quantity: parseInt(ingredient.quantity, 10) || 1
        }));
      }
      this.recipeService.addRecipe(this.recipeData).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res) => {
        if (!res.success) {
          this.nzNotificationService.error(res.message || "Recipe wasn't added", "Please try again.");
          return;
        }
        this.nzNotificationService.success("Recipe added successfully!", "");
        this.modalRef.close(this.recipeData);

      });
    });
  }
  generateRecipe(): void {
    if (!this.recipeName) {
      this.nzNotificationService.warning('Please enter a recipe name',"");
      return;
    }
    this.loading = true;
    this.recipeService.generateAIRecipe(this.recipeName).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.recipeData = res.data;
        console.log("RECIPE DATA ASSIGNED HERE", this.recipeData)
      } else {
        this.recipeData = null;
        this.nzNotificationService.error(res?.message || "Failed to generate recipe. Please try again", "");
        return;
      }
    }, err => {
      this.loading = false;
      console.log(err);
      this.nzNotificationService.error(err.error?.message || "An error occurred. Please try again.", "");
    });
  }
}
