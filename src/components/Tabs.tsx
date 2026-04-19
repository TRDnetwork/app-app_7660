import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultActiveId?: string;
  onTabChange?: (id: string) => void;
  variant?: 'default' | 'underline';
  fullWidth?: boolean;
}

export const Tabs = ({ 
  tabs, 
  defaultActiveId, 
  onTabChange, 
  variant = 'default',
  fullWidth = false 
}: TabsProps) => {
  const [activeId, setActiveId] = useState(defaultActiveId || tabs[0].id);

  const handleTabClick = (id: string) => {
    setActiveId(id);
    onTabChange?.(id);
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div 
        className={`
          flex border-b border-surface mb-4
          ${variant === 'underline' ? 'pb-2' : ''}
          ${fullWidth ? 'w-full' : ''}
        `}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              px-4 py-2 font-medium text-text-dim border-b-2 transition-colors duration-200
              ${variant === 'underline' 
                ? 'hover:text-text' 
                : 'rounded-t-md hover:bg-surface'}
              ${activeId === tab.id 
                ? `${variant === 'underline' ? 'border-accent text-text' : 'bg-surface border-surface text-text'}` 
                : 'border-transparent hover:border-surface'}
            `}
            onClick={() => handleTabClick(tab.id)}
            role="tab"
            aria-selected={activeId === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`tab-panel-${activeId}`}>
        {tabs.find(tab => tab.id === activeId)?.content}
      </div>
    </div>
  );
};

export default Tabs;
---