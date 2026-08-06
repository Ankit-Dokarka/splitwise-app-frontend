import { FiHome, } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import type { IconType } from "react-icons";

export type NavItem = {
  to: string;
  icon: IconType;
  label: string;
};

export const sidebarNavItems: NavItem[] = [
  { to: "/dashboard", icon: FiHome, label: "Dashboard" },
  { to: "/dashboard", icon: MdGroupAdd, label: "Groups" },
];

export const bottomNavItems: NavItem[] = [
  { to: "/dashboard", icon: FiHome, label: "Home" },
  { to: "/dashboard", icon: MdGroupAdd, label: "Groups" },
];
