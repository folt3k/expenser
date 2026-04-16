import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  async getBudget(): Promise<number> {
    const userId = this.auth.user()?.id;
    if (!userId) return 0;

    const { data, error } = await this.supabase.client
      .from('budgets')
      .select('amount')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.amount ?? 0;
  }

  async setBudget(amount: number): Promise<void> {
    const userId = this.auth.user()?.id;
    if (!userId) throw new Error('Not authenticated');

    const { error } = await this.supabase.client
      .from('budgets')
      .upsert(
        { user_id: userId, amount, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      );

    if (error) throw error;
  }
}
