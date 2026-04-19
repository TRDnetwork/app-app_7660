import React, { useState } from 'react';

interface TabProps {
  label: string;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
  defaultIndex?: number;
}

const Tabs: React.FC<TabsProps> = ({ children, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="w-full">
      <div className="border-b border-surface flex">
        {children.map((child, index) => (
          <button
            key={index}
            className={[
              'py-2 px-4 font-medium text-text-dim border-b-2 -mb-px',
              activeIndex === index
                ? 'border-accent text-text'
                : 'border-transparent hover:text-text',
            ].join(' ')}
            onClick={() => setActiveIndex(index)}
            role="tab"
            aria-selected={activeIndex === index}
            tabIndex={activeIndex === index ? 0 : -1}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {children[activeIndex]}
      </div>
    </div>
  );
};

const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;

Tabs.Tab = Tab;
export default Tabs;