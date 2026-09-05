import React from 'react';

const Bone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

export const ProfileHeaderSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-card border border-border/50 overflow-hidden mb-6">
    <Bone className="h-44 rounded-none" />
    <div className="px-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10 mb-6">
        <Bone className="w-24 h-24 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-12 md:pt-0">
          <Bone className="h-6 w-48" />
          <Bone className="h-4 w-64" />
          <Bone className="h-3 w-40" />
        </div>
        <div className="flex gap-2">
          <Bone className="h-9 w-24 rounded-xl" />
          <Bone className="h-9 w-24 rounded-xl" />
        </div>
      </div>
      <div className="flex gap-2 border-t border-border pt-4">
        {[1,2,3,4,5].map(i => <Bone key={i} className="h-8 w-20 rounded-lg" />)}
      </div>
    </div>
  </div>
);

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6 space-y-4">
    <Bone className="h-5 w-32" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <Bone className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Bone className="h-4 w-3/4" />
          <Bone className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const SidebarSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1,2,3].map(i => (
      <div key={i} className="bg-white rounded-2xl shadow-card border border-border/50 p-5 space-y-3">
        <Bone className="h-4 w-28" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-4/5" />
        <Bone className="h-3 w-3/5" />
      </div>
    ))}
  </div>
);
