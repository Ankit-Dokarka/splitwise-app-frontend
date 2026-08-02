import { useEffect, useState, type ReactNode } from "react";
import { MembersContext } from "./MembersContext";
import type { Member } from "../../types/member";
import useAuth from "../../hooks/useAuth";
import type { User } from "../../types/user";

type MembersProviderProps = {
  children: ReactNode;
};

export function MembersProvider({ children }: MembersProviderProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!user) return;

    const allMembers = JSON.parse(localStorage.getItem("members") ?? "{}");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMembers(allMembers[user.email] ?? []);
  }, [user]);

  const searchUser = async (query: string): Promise<{ email: string }[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query || !user) return resolve([]);

        const users: Record<string, User> = JSON.parse(
          localStorage.getItem("users") ?? "{}",
        );
        const results = Object.values(users)
          .filter(
            (u) =>
              u.email.toLowerCase().includes(query.toLowerCase()) &&
              u.email !== user.email,
          )
          .map((u) => ({ email: u.email }));

        resolve(results);
      }, 1000);
    });
  };

  const addMember = (member: Member) => {
    if (!user) return;

    const updatedMembers = [...members, member];
    setMembers(updatedMembers);

    const allMembers = JSON.parse(localStorage.getItem("members") ?? "{}");

    allMembers[user.email] = updatedMembers;

    const friendMembers: Member[] = allMembers[member.email] ?? [];
    const isAlreadyFriend = friendMembers.some((m) => m.email === user.email);

    if (!isAlreadyFriend) {
      allMembers[member.email] = [
        ...friendMembers,
        {
          id: crypto.randomUUID(),
          email: user.email,
        },
      ];
    }

    localStorage.setItem("members", JSON.stringify(allMembers));
  };

  return (
    <MembersContext.Provider
      value={{ members, setMembers, searchUser, addMember }}
    >
      {children}
    </MembersContext.Provider>
  );
}
