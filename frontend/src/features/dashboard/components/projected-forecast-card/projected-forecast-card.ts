import { Component,Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';




@Component({
  selector: 'app-projected-forecast-card',
  imports: [MatIconModule],
  templateUrl: './projected-forecast-card.html',
  styleUrl: './projected-forecast-card.scss',
})
export class ProjectedForecastCard implements OnChanges{

  @Input() predictedAmount:number=0;
  @Input() totalSpent:number=0;
  @Input() totalBudget:number=0;

  spentPercent:number =0;
  overPercent:number=0;
  netDiff:string ='';



  ngOnChanges(changes:SimpleChanges){

    if(changes['totalSpent'] || changes['totalBudget'] || changes['predictedAmount']){
      this.updateProgress();
    }
    this.calculateWidths();
    
  }
  

  updateProgress(){
    if(this.totalSpent <= this.totalBudget){
      this.spentPercent=(this.totalSpent /this.totalBudget)*100;
      this.overPercent=0;
    } else {
      this.spentPercent = 100;
      this.overPercent = ((this.totalSpent-this.totalBudget)/this.totalBudget)*100;
    }

    var netDiff = this.predictedAmount-this.totalBudget;
    if(netDiff >= 0) this.netDiff = netDiff+" Over ";
    else this.netDiff = -netDiff+" Under ";

    

  }

  budgetLinePosition:string="";
  safeWidth:string = '';
  overspendWidth:string ='';
  projectedOverWidth:string='';
  projectedStartLeft:string='';

  calculateWidths() {
  const spent = this.totalSpent || 0;
  const projected = this.predictedAmount || 0;
  const budget = this.totalBudget || 0;

  // 1. Determine Scale (Max value on the bar)
  // It's the largest of: Budget, Actual Spend, or Projection.
  // Add 10% buffer so the bar doesn't hit the absolute edge.
  const maxValue = Math.max(spent, projected, budget) * 1.1;
  
  if (maxValue === 0) return; // Avoid divide by zero

  // 2. Budget Line Position
  // Everything to the LEFT is safe. Everything to the RIGHT is over budget.
  this.budgetLinePosition = (budget / maxValue) * 100 + '%';

  // 3. Segment 1: Safe Spend (Black)
  // This is the spending UP TO the budget limit.
  const safeSpendAmount = Math.min(spent, budget);
  this.safeWidth = (safeSpendAmount / maxValue) * 100 + '%';

  // 4. Segment 2: Overspend (Solid Red)
  // This is actual spending that EXCEEDS the budget.
  const overSpendAmount = Math.max(0, spent - budget);
  this.overspendWidth = (overSpendAmount / maxValue) * 100 + '%';

  // 5. Segment 3: Projected Overspend (Striped Red)
  // This is the *future* predicted spending beyond what we've already spent.
  // We only care about projection if it's higher than actual spent.
  const projectedAmount = Math.max(0, projected - spent);
  this.projectedOverWidth = (projectedAmount / maxValue) * 100 + '%';
  
  // Start position for the projected bar (starts where actual spending ends)
  const totalSpentSoFar = safeSpendAmount + overSpendAmount;
  this.projectedStartLeft = (totalSpentSoFar / maxValue) * 100 + '%';
}





}
