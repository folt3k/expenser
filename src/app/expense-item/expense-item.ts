import { Component, ElementRef, ViewChild, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Expense } from '../models/expense.model';

@Component({
  selector: 'app-expense-item',
  imports: [DecimalPipe],
  template: `
    <div
      class="flex items-center gap-3 glass-card rounded-xl px-4 py-3 transition-all"
      [class.opacity-40]="expense().completed && !editing()"
    >
      <span class="text-white/40 text-sm w-5">{{ index() + 1 }}.</span>

      @if (editing()) {
        <input
          #editNameInput
          type="text"
          [value]="editName"
          (input)="editName = $any($event.target).value"
          (keydown.enter)="confirm()"
          (keydown.escape)="cancelEdit()"
          placeholder="Nazwa..."
          class="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
        />
        <div class="relative">
          <input
            type="number"
            [value]="editAmount || ''"
            (input)="editAmount = +($any($event.target).value) || 0"
            (keydown.enter)="confirm()"
            (keydown.escape)="cancelEdit()"
            placeholder="Kwota..."
            min="0"
            class="w-28 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 pr-8 text-white text-sm placeholder:text-white/30 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 text-xs">zł</span>
        </div>
        <button
          (click)="confirm()"
          class="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all"
          title="Zapisz"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button
          (click)="cancelEdit()"
          class="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          title="Anuluj"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      } @else {
        <div class="flex-1 flex flex-col">
          @if (expense().name) {
            <span class="text-white/70 text-sm flex items-center gap-1.5" [class.line-through]="expense().completed">
              {{ expense().name }}
              @if (expense().completed) {
                <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 no-underline" title="Zrealizowany">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              }
            </span>
          }
          <span class="text-white text-sm font-semibold flex items-center gap-1.5" [class.line-through]="expense().completed">
            {{ expense().amount | number: '1.2-2' }} zł
            @if (expense().completed && !expense().name) {
              <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 no-underline" title="Zrealizowany">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            }
          </span>
        </div>

        <button
          (click)="startEdit()"
          class="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
          title="Edytuj wydatek"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487zm0 0L19.5 7.125" />
          </svg>
        </button>

        <button
          (click)="toggleCompleted.emit(expense().id)"
          class="p-1.5 rounded-lg transition-all"
          [class.text-emerald-400]="expense().completed"
          [class.hover:text-emerald-300]="expense().completed"
          [class.hover:bg-emerald-500/10]="expense().completed"
          [class.text-white/40]="!expense().completed"
          [class.hover:text-emerald-400]="!expense().completed"
          [class.hover:bg-white/10]="!expense().completed"
          [title]="expense().completed ? 'Oznacz jako niezrealizowany' : 'Oznacz jako zrealizowany'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <button
          (click)="remove.emit(expense().id)"
          class="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Usuń wydatek"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  `,
  styles: `
    .glass-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  `,
})
export class ExpenseItemComponent {
  @ViewChild('editNameInput') editNameInput!: ElementRef<HTMLInputElement>;

  expense = input.required<Expense>();
  index = input.required<number>();
  toggleCompleted = output<string>();
  remove = output<string>();
  edit = output<{ id: string; amount: number; name?: string }>();

  editing = signal(false);
  editName = '';
  editAmount = 0;

  startEdit() {
    this.editName = this.expense().name ?? '';
    this.editAmount = this.expense().amount;
    this.editing.set(true);
    setTimeout(() => this.editNameInput.nativeElement.focus());
  }

  confirm() {
    if (this.editAmount > 0) {
      this.edit.emit({
        id: this.expense().id,
        amount: this.editAmount,
        name: this.editName || undefined,
      });
      this.editing.set(false);
    }
  }

  cancelEdit() {
    this.editing.set(false);
  }
}
