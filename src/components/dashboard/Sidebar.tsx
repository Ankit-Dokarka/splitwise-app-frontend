import { useState } from "react";

import {
  FiChevronsLeft,
  FiChevronsRight,

} from "react-icons/fi";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import AddGroupModal from "../../modals/AddGroupModal";
import { sidebarNavItems } from "../../constants/navigation";


export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGroups, setShowGroups] = useState(true);

 


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
                
              </button>

              {showGroups && (
                <div className="flex flex-col gap-1 mt-2 max-h-40 overflow-y-auto pr-1">
                 

                  

                  
                </div>
              )}
            </div>
          )}

      
          {isCollapsed && (
            <div className="mt-4 pt-4 border-t border-(--color-border) flex flex-col items-center gap-3">
          
            </div>
          )}
        </nav>

    

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
