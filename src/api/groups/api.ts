import type { User } from "../../types/user";

const BASE_URL = import.meta.env.VITE_API_URL;

export type CreateGroupPayload = {
  name: string;
  description: string;
  members: string[];
};

export const groupsAPI = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data.users as User[];
  },

  async createGroup(payload: CreateGroupPayload): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create group");
    }

    return data.group;
  },
};
