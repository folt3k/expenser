import { Injectable, inject } from '@angular/core';
import { Expense } from '../models/expense.model';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

interface ExpenseRow {
  id: string;
  amount: number;
  name: string | null;
  hidden: boolean;
}

function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    amount: Number(row.amount),
    name: row.name ?? undefined,
    hidden: row.hidden,
  };
}

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  async listExpenses(): Promise<Expense[]> {
    const userId = this.auth.user()?.id;
    if (!userId) return [];

    const { data, error } = await this.supabase.client
      .from('expenses')
      .select('id, amount, name, hidden')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toExpense);
  }

  async addExpense(input: { amount: number; name?: string }): Promise<Expense> {
    const userId = this.auth.user()?.id;
    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await this.supabase.client
      .from('expenses')
      .insert({
        user_id: userId,
        amount: input.amount,
        name: input.name ?? null,
      })
      .select('id, amount, name, hidden')
      .single();

    if (error) throw error;
    return toExpense(data);
  }

  async updateExpense(
    id: string,
    changes: { amount?: number; name?: string },
  ): Promise<Expense> {
    const patch: Record<string, unknown> = {};
    if (changes.amount !== undefined) patch['amount'] = changes.amount;
    if (changes.name !== undefined) patch['name'] = changes.name ?? null;

    const { data, error } = await this.supabase.client
      .from('expenses')
      .update(patch)
      .eq('id', id)
      .select('id, amount, name, hidden')
      .single();

    if (error) throw error;
    return toExpense(data);
  }

  async toggleHidden(id: string, hidden: boolean): Promise<void> {
    const { error } = await this.supabase.client
      .from('expenses')
      .update({ hidden })
      .eq('id', id);

    if (error) throw error;
  }

  async removeExpense(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
