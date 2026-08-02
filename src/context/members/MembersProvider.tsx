import { useEffect, useState, useCallback, type ReactNode } from "react";
import { MembersContext } from "./MembersContext";
import type { Member } from "../../types/member";
import useAuth from "../../hooks/useAuth";
import { memberAPI } from "../../api/members/api";

type MembersProviderProps = {
  children: ReactNode;
};

export function MembersProvider({ children }: MembersProviderProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!user) return;
    try {
      const data = await memberAPI.getMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const searchUser = async (query: string): Promise<Member[]> => {
    try {
      return await memberAPI.searchUsers(query);
    } catch (error) {
      console.error("Failed to search users:", error);
      return [];
    }
  };

  // NEW: Real API call to add a member
  const addMember = async (memberId: string): Promise<Member> => {
    const newMember = await memberAPI.addMember(memberId);
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  return (
    <MembersContext.Provider
      value={{ members, setMembers, searchUser, addMember, isLoading }}
    >
      {children}
    </MembersContext.Provider>
  );
}
