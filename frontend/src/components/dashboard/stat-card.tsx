'use client';

import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
}

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  color,
  borderColor,
}: StatCardProps) {
  return (
    <div
      className={`bg-card border ${borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 group`}
    >
      <div className='flex items-start justify-between mb-4'>
        <div
          className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}
        >
          <Icon size={24} />
        </div>
        <TrendingUp size={16} className='text-foreground/40' />
      </div>
      <h3 className='text-3xl font-bold text-foreground mb-1'>{value}</h3>
      <p className='text-sm text-foreground/60 mb-3'>{label}</p>
      <p className='text-xs text-foreground/50'>{trend}</p>
    </div>
  );
}
