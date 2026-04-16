import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly destroyRef = inject(DestroyRef);

  readonly session = signal<Session | null>(null);
  readonly loading = signal(true);
  readonly user = computed<User | null>(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  constructor() {
    this.supabase.client.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
      this.loading.set(false);
    });

    const { data } = this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
    });

    this.destroyRef.onDestroy(() => {
      data.subscription.unsubscribe();
    });
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }

  async signOut() {
    const { error } = await this.supabase.client.auth.signOut();
    if (error) {
      throw error;
    }
  }
}
