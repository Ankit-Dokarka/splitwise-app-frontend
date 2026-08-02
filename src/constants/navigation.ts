import { FiHome, FiActivity, FiCreditCard } from "react-icons/fi";
import type { IconType } from "react-icons";

export type NavItem = {
  to: string;
  icon: IconType;
  label: string;
};

export const sidebarNavItems: NavItem[] = [
  { to: "/dashboard", icon: FiHome, label: "Dashboard" },
  { to: "/dashboard/recent", icon: FiActivity, label: "Recent Activities" },
  { to: "/dashboard/expenses", icon: FiCreditCard, label: "All Expenses" },
];

export const bottomNavItems: NavItem[] = [
  { to: "/dashboard", icon: FiHome, label: "Home" },
  { to: "/dashboard/recent", icon: FiActivity, label: "Recent" },
  { to: "/dashboard/expenses", icon: FiCreditCard, label: "Expenses" },
];
