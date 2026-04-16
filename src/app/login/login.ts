import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen px-4 py-10 flex flex-col items-center justify-center" style="background-color: #090e0b">
      <!-- Ambient glow -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
             style="background: radial-gradient(circle, #10b981 0%, transparent 70%)"></div>
      </div>

      <div class="relative w-full max-w-sm">
        <div class="glass-panel rounded-2xl p-6 flex flex-col gap-5">
          <h1 class="text-lg font-semibold text-white text-center">Zaloguj się</h1>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-white/80">Email</label>
            <input
              type="email"
              autocomplete="email"
              [value]="email()"
              (input)="email.set($any($event.target).value)"
              (keydown.enter)="submit()"
              placeholder="email@example.com"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-white/80">Hasło</label>
            <input
              type="password"
              autocomplete="current-password"
              [value]="password()"
              (input)="password.set($any($event.target).value)"
              (keydown.enter)="submit()"
              placeholder="••••••••"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          @if (error()) {
            <p class="text-sm text-red-400 text-center">{{ error() }}</p>
          }

          <button
            (click)="submit()"
            [disabled]="submitting()"
            class="w-full py-3 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all cursor-pointer"
          >
            {{ submitting() ? 'Logowanie…' : 'Zaloguj' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .glass-panel {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);

  readonly email = signal('');
  readonly password = signal('');
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);

  async submit() {
    if (this.submitting()) return;
    if (!this.email() || !this.password()) {
      this.error.set('Podaj email i hasło.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    try {
      await this.auth.signIn(this.email(), this.password());
    } catch (err) {
      console.error(err);
      this.error.set('Nieprawidłowy email lub hasło.');
    } finally {
      this.submitting.set(false);
    }
  }
}
