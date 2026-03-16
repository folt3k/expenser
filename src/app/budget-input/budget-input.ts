import { Component, model } from '@angular/core';

@Component({
  selector: 'app-budget-input',
  template: `
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">Budżet (zł)</label>
      <div class="relative">
        <input
          type="number"
          [value]="budget() || ''"
          (input)="budget.set(+($any($event.target).value) || 0)"
          placeholder="Wpisz kwotę budżetu..."
          class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
        />
        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">zł</span>
      </div>
    </div>
  `,
  styles: ``
})
export class BudgetInputComponent {
  budget = model.required<number>();
}
