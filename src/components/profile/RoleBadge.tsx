import React from 'react';
import type { UserRole } from '../../types/profile';

interface RoleConfig { label: string; bg: string; text: string; dot: string; }

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  alumni:         { label: 'Alumni',       bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  student:        { label: 'Student',      bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  teacher:        { label: 'Teacher',      bg: 'bg-purple-100',  text: 'text-purple-700',  dot: 'bg-purple-500'  },
  principal:      { label: 'Principal',    bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  staff:          { label: 'Staff',        bg: 'bg-slate-100',   text: 'text-slate-700',   dot: 'bg-slate-500'   },
  mentor:         { label: 'Mentor',       bg: 'bg-teal-100',    text: 'text-teal-700',    dot: 'bg-teal-500'    },
  recruiter:      { label: 'Recruiter',    bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-500'  },
  hr:             { label: 'Company HR',   bg: 'bg-pink-100',    text: 'text-pink-700',    dot: 'bg-pink-500'    },
  business_owner: { label: 'Business',     bg: 'bg-indigo-100',  text: 'text-indigo-700',  dot: 'bg-indigo-500'  },
  admin:          { label: 'Admin',        bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500'     },
  super_admin:    { label: 'Super Admin',  bg: 'bg-rose-100',    text: 'text-rose-700',    dot: 'bg-rose-500'    },
  guest:          { label: 'Guest',        bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
};

interface Props { role: UserRole; size?: 'sm' | 'md'; }

const RoleBadge: React.FC<Props> = ({ role, size = 'md' }) => {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.guest;
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${cfg.bg} ${cfg.text} ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export default RoleBadge;
