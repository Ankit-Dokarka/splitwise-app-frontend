export const BASE_URL = import.meta.env.VITE_API_URL;

export type SearchedUser = {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
};

export const memberAPI = {
  async getMembers(): Promise<SearchedUser[]> {
    const response = await fetch(`${BASE_URL}/api/members`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.members;
  },

  async searchUsers(query: string): Promise<SearchedUser[]> {
    const response = await fetch(
      `${BASE_URL}/api/members/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.users;
  },

  async addMember(memberId: string): Promise<SearchedUser> {
    const response = await fetch(`${BASE_URL}/api/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ memberId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.member;
  },
};
