import { Component, ElementRef, ViewChild, output, signal } from '@angular/core';

@Component({
  selector: 'app-add-expense',
  imports: [],
  template: `
    <div class="flex flex-col gap-3">
      @if (showInput()) {
        <div class="flex gap-2">
          <input
            #nameInput
            type="text"
            [value]="name"
            (input)="name = $any($event.target).value"
            (keydown.enter)="confirm()"
            (keydown.escape)="cancel()"
            placeholder="Nazwa..."
            class="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          <div class="relative">
            <input
              #amountInput
              type="number"
              [value]="amount || ''"
              (input)="amount = +($any($event.target).value) || 0"
              (keydown.enter)="confirm()"
              (keydown.escape)="cancel()"
              placeholder="Kwota..."
              min="0"
              class="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-9 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">zł</span>
          </div>
          <button
            (click)="cancel()"
            class="px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            Anuluj
          </button>
        </div>
      } @else {
        <button
          #addButton
          (click)="open()"
          class="w-full py-3 cursor-pointer rounded-xl border border-dashed border-white/20 text-white/50 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Dodaj wydatek
        </button>
      }
    </div>
  `
})
export class AddExpenseComponent {
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('amountInput') amountInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addButton') addButton!: ElementRef<HTMLButtonElement>;

  add = output<{ amount: number; name?: string }>();

  showInput = signal(false);
  amount = 0;
  name = '';

  open() {
    this.showInput.set(true);
    setTimeout(() => this.nameInput.nativeElement.focus());
  }

  confirm() {
    if (this.amount > 0) {
      this.add.emit({ amount: this.amount, name: this.name || undefined });
      this.amount = 0;
      this.name = '';
      this.showInput.set(false);
      setTimeout(() => this.addButton.nativeElement.focus());
    }
  }

  cancel() {
    this.amount = 0;
    this.name = '';
    this.showInput.set(false);
    setTimeout(() => this.addButton.nativeElement.focus());
  }
}
