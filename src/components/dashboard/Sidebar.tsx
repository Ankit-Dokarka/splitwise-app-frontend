import { useState } from "react";
import { FiChevronsLeft, FiChevronsRight, FiUserPlus } from "react-icons/fi";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import AddMemberModal from "../../modals/AddMembersModal";
import { sidebarNavItems } from "../../constants/navigation";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside
        className={`hidden md:flex flex-col bg-(--color-surface) border-r border-(--color-border) transition-[width] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width] relative z-30 shadow-sm ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="h-16 flex items-center border-b border-(--color-border) px-6 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Fixed dimensions for logo to prevent stretching */}
            <Logo className="w-9 h-9 shrink-0" />
            {/* Staggered opacity transition for smooth fade in/out */}
            <span
              className={`text-lg font-bold tracking-tight text-(--color-text) whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? "opacity-0 delay-0" : "opacity-100 delay-300"
              }`}
            >
              Splitwise
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1.5 pt-6 overflow-y-auto overflow-x-hidden">
          {sidebarNavItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className="p-3 border-t border-(--color-border)">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`group relative flex items-center gap-3 px-4 py-3 w-full rounded-(--btn-radius) transition-[padding,background-color] duration-300 text-sm font-medium whitespace-nowrap text-(--color-primary) bg-(--color-primary)/5 hover:bg-(--color-primary)/10 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <FiUserPlus
              size={18}
              className="shrink-0 transition-transform duration-200 group-hover:scale-110"
            />

            {/* Conditionally render text so it doesn't take up space when collapsed */}
            {!isCollapsed && <span>Add Member</span>}

            {isCollapsed && (
              <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-(--color-text) text-(--color-surface) text-xs font-medium rounded-(--btn-radius) opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Add Member
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-8 -right-4 -translate-y-1/2 z-40 w-8 h-8 flex items-center justify-center rounded-full bg-(--color-surface) border border-(--color-border) shadow-md text-(--color-text-muted) hover:text-(--color-primary) hover:border-(--color-primary)/30 hover:shadow-lg transition-all duration-200"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <FiChevronsRight size={18} className="shrink-0" />
          ) : (
            <FiChevronsLeft size={18} className="shrink-0" />
          )}
        </button>
      </aside>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
