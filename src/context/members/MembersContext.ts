import { createContext, useContext } from "react";
import type { Member } from "../../types/member";
import type { Dispatch, SetStateAction } from "react";

type MembersContextType = {
  members: Member[];
  setMembers: Dispatch<SetStateAction<Member[]>>;
  searchUser: (query: string) => Promise<{ email: string }[]>;
  addMember: (member: Member) => void;
};

export const MembersContext = createContext<MembersContextType | null>(null);

export function useMembers() {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error("useMembers must be used within an AuthProvider");
  }
  return context;
}
