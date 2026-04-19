import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-2xl',
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
}) => {
  return (
    <div
      className={[
        'rounded-full bg-surface flex items-center justify-center overflow-hidden',
        sizeClasses[size],
        className,
      ].join(' ')}
      aria-label={alt}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-text font-medium">
          {fallback || alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default Avatar;