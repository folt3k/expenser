import { Component, ElementRef, ViewChild, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Expense } from '../models/expense.model';

@Component({
  selector: 'app-expense-item',
  imports: [DecimalPipe],
  template: `
    <div
      class="flex items-center gap-3 glass-card rounded-xl px-4 py-3 transition-all"
      [class.opacity-40]="expense().hidden && !editing()"
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
        <div class="flex-1 flex flex-col" [class.line-through]="expense().hidden">
          @if (expense().name) {
            <span class="text-white/70 text-sm">{{ expense().name }}</span>
          }
          <span class="text-white text-sm font-semibold">{{ expense().amount | number: '1.2-2' }} zł</span>
        </div>

        <button
          (click)="startEdit()"
          class="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
          title="Edytuj wydatek"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" />
          </svg>
        </button>

        <button
          (click)="toggleHidden.emit(expense().id)"
          class="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          [title]="expense().hidden ? 'Pokaż wydatek' : 'Ukryj wydatek'"
        >
          @if (expense().hidden) {
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                   a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
                   M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29
                   M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
                   a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                   -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
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
  toggleHidden = output<number>();
  remove = output<number>();
  edit = output<{ id: number; amount: number; name?: string }>();

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
