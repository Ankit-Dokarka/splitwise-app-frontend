import type { CreateExpensePayload } from "../../types/expence";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const expenseAPI = {
  async getExpenses() {
    const response = await fetch(`${BASE_URL}/api/expenses`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  },

  async createExpense(payload: CreateExpensePayload) {
    const response = await fetch(`${BASE_URL}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  },
};
