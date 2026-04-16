import { Component, computed, effect, inject, signal } from '@angular/core';
import { Expense } from './models/expense.model';
import { BudgetInputComponent } from './budget-input/budget-input';
import { BudgetSummaryComponent } from './budget-summary/budget-summary';
import { ExpenseItemComponent } from './expense-item/expense-item';
import { AddExpenseComponent } from './add-expense/add-expense';
import { LoginComponent } from './login/login';
import { AuthService } from './services/auth.service';
import { BudgetService } from './services/budget.service';
import { ExpensesService } from './services/expenses.service';

@Component({
  selector: 'app-root',
  imports: [
    BudgetInputComponent,
    BudgetSummaryComponent,
    ExpenseItemComponent,
    AddExpenseComponent,
    LoginComponent,
  ],
  template: `
    @if (auth.loading()) {
      <div class="min-h-screen" style="background-color: #090e0b"></div>
    } @else if (!auth.isAuthenticated()) {
      <app-login />
    } @else {
      <div class="min-h-screen px-4 py-10 flex flex-col items-center justify-center" style="background-color: #090e0b">
        <!-- Ambient glow -->
        <div class="fixed inset-0 pointer-events-none overflow-hidden">
          <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
               style="background: radial-gradient(circle, #10b981 0%, transparent 70%)"></div>
        </div>

        <div class="relative w-full max-w-xl flex flex-col gap-6">
          <!-- Budget input -->
          <div class="glass-panel rounded-2xl p-5">
            <app-budget-input [budget]="budget()" (budgetChange)="onBudgetChange($event)" />
          </div>

          <!-- Summary -->
          @if (budget() > 0) {
            <app-budget-summary [budget]="budget()" [spent]="totalSpent()" />
          }

          <!-- Expenses -->
          <div class="glass-panel rounded-2xl p-5 flex flex-col gap-4">
            <h2 class="text-sm font-semibold text-white">Wydatki</h2>

            @if (expenses().length === 0) {
              <p class="text-white/30 text-sm text-center py-4">Brak wydatków</p>
            } @else {
              <div class="flex flex-col gap-2">
                @for (expense of expenses(); track expense.id; let i = $index) {
                  <app-expense-item
                    [expense]="expense"
                    [index]="i"
                    (toggleHidden)="toggleHidden($event)"
                    (remove)="removeExpense($event)"
                    (edit)="editExpense($event)"
                  />
                }
              </div>
            }

            <app-add-expense (add)="addExpense($event)" />
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .glass-panel {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  `,
})
export class AppComponent {
  readonly auth = inject(AuthService);
  private readonly budgetService = inject(BudgetService);
  private readonly expensesService = inject(ExpensesService);

  budget = signal(0);
  expenses = signal<Expense[]>([]);

  totalSpent = computed(() =>
    this.expenses()
      .filter(e => !e.hidden)
      .reduce((sum, e) => sum + e.amount, 0),
  );

  private budgetSaveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(async () => {
      const authed = this.auth.isAuthenticated();
      if (!authed) {
        this.budget.set(0);
        this.expenses.set([]);
        return;
      }
      try {
        const [amount, list] = await Promise.all([
          this.budgetService.getBudget(),
          this.expensesService.listExpenses(),
        ]);
        this.budget.set(amount);
        this.expenses.set(list);
      } catch (err) {
        console.error(err);
      }
    });
  }

  onBudgetChange(value: number) {
    this.budget.set(value);
    if (this.budgetSaveTimer !== null) {
      clearTimeout(this.budgetSaveTimer);
    }
    this.budgetSaveTimer = setTimeout(() => {
      this.budgetService.setBudget(value).catch(err => console.error(err));
      this.budgetSaveTimer = null;
    }, 400);
  }

  async addExpense(input: { amount: number; name?: string }) {
    try {
      const created = await this.expensesService.addExpense(input);
      this.expenses.update(list => [...list, created]);
    } catch (err) {
      console.error(err);
    }
  }

  async toggleHidden(id: string) {
    const current = this.expenses().find(e => e.id === id);
    if (!current) return;
    const newHidden = !current.hidden;
    try {
      await this.expensesService.toggleHidden(id, newHidden);
      this.expenses.update(list =>
        list.map(e => (e.id === id ? { ...e, hidden: newHidden } : e)),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async removeExpense(id: string) {
    try {
      await this.expensesService.removeExpense(id);
      this.expenses.update(list => list.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async editExpense({ id, amount, name }: { id: string; amount: number; name?: string }) {
    try {
      const updated = await this.expensesService.updateExpense(id, { amount, name });
      this.expenses.update(list => list.map(e => (e.id === id ? updated : e)));
    } catch (err) {
      console.error(err);
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
    } catch (err) {
      console.error(err);
    }
  }
}
