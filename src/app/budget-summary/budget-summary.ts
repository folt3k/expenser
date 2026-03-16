import { Component, input, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-budget-summary',
  imports: [DecimalPipe],
  template: `
    <div class="grid grid-cols-2 gap-3">
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-xs text-white/50 mb-1 uppercase tracking-wide">Zostało</p>
        <p
          class="text-xl font-bold"
          [class]="remaining() >= 0 ? 'text-emerald-400' : 'text-red-400'"
        >
          {{ remaining() | number: '1.2-2' }}
          <span class="text-sm font-normal text-white/50">zł</span>
        </p>
      </div>
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-xs text-white/50 mb-1 uppercase tracking-wide">Wydano</p>
        <p class="text-xl font-bold text-red-400">
          {{ spent() | number: '1.2-2' }} <span class="text-sm font-normal text-white/50">zł</span>
        </p>
      </div>
    </div>
  `,
  styles: `
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  `,
})
export class BudgetSummaryComponent {
  budget = input.required<number>();
  spent = input.required<number>();
  remaining = computed(() => this.budget() - this.spent());
}
