import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronDown,
  FiChevronRight,
  FiUsers,
} from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import AddGroupModal from "../../modals/AddGroupModal";
import { sidebarNavItems } from "../../constants/navigation";
import { useGroup } from "../../context/groups/GroupsContext";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGroups, setShowGroups] = useState(true);

  // Destructure groups and loading state from context
  const { groups, isLoadingGroups } = useGroup();

  return (
    <>
      <aside
        className={`hidden md:flex flex-col bg-(--color-surface) border-r border-(--color-border) transition-[width] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width] relative z-40 shadow-sm ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="h-16 flex items-center border-b border-(--color-border) px-6 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <Logo className="w-9 h-9 shrink-0" />
            <span
              className={`text-lg font-bold tracking-tight text-(--color-text) whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? "opacity-0 delay-0" : "opacity-100 delay-300"
              }`}
            >
              Splitwise
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1.5 pt-6">
          {sidebarNavItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}

          {/* Groups Section - Expanded View */}
          {!isCollapsed && (
            <div className="mt-4 pt-4 border-t border-(--color-border)">
              <button
                type="button"
                onClick={() => setShowGroups(!showGroups)}
                className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold uppercase text-(--color-text-muted) hover:text-(--color-text) transition-colors"
              >
                <span>Groups ({groups.length})</span>
                {showGroups ? (
                  <FiChevronDown size={14} />
                ) : (
                  <FiChevronRight size={14} />
                )}
              </button>

              {showGroups && (
                <div className="flex flex-col gap-1 mt-2 max-h-40 overflow-y-auto pr-1">
                  {isLoadingGroups && (
                    <div className="flex justify-center py-4">
                      <div className="w-5 h-5 border-2 border-(--color-border) border-t-(--color-primary) rounded-full animate-spin"></div>
                    </div>
                  )}

                  {!isLoadingGroups && groups.length === 0 && (
                    <p className="px-4 py-2 text-xs text-(--color-text-muted)">
                      No groups added yet.
                    </p>
                  )}

                  {!isLoadingGroups &&
                    groups.map((group) => (
                      <Link
                        to={`/dashboard/groups/${group._id}`} // Or wherever your group detail page is
                        key={group._id}
                        className="flex items-center gap-3 px-4 py-2 rounded-(--btn-radius) hover:bg-(--color-bg) transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center text-sm font-medium overflow-hidden shrink-0">
                          <FiUsers size={16} />
                        </div>
                        <span className="text-sm text-(--color-text) truncate">
                          {group.name}
                        </span>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Groups Section - Collapsed View */}
          {isCollapsed && (
            <div className="mt-4 pt-4 border-t border-(--color-border) flex flex-col items-center gap-3">
              {isLoadingGroups && (
                <div className="w-6 h-6 border-2 border-(--color-border) border-t-(--color-primary) rounded-full animate-spin"></div>
              )}

              {!isLoadingGroups &&
                groups.slice(0, 5).map((group) => (
                  <Link
                    to={`/dashboard/groups/${group._id}`}
                    key={group._id}
                    className="relative group w-9 h-9 rounded-full bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center text-sm font-medium shrink-0 cursor-pointer"
                  >
                    <FiUsers size={16} />
                    <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-(--color-text) text-(--color-surface) text-xs font-medium rounded-(--btn-radius) opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {group.name}
                    </span>
                  </Link>
                ))}
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-(--color-border)">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`group relative flex items-center gap-3 px-4 py-3 w-full rounded-(--btn-radius) transition-[padding,background-color] duration-300 text-sm font-medium whitespace-nowrap text-(--color-primary) bg-(--color-primary)/5 hover:bg-(--color-primary)/10 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <MdGroupAdd
              size={18}
              className="shrink-0 transition-transform duration-200 group-hover:scale-110"
            />

            {!isCollapsed && <span>Add Group</span>}

            {isCollapsed && (
              <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-(--color-text) text-(--color-surface) text-xs font-medium rounded-(--btn-radius) opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Add Group
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

      <AddGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
