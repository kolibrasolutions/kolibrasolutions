import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PartnerDashboardButtonProps {
  className?: string;
}

export const PartnerDashboardButton: React.FC<PartnerDashboardButtonProps> = ({ className = '' }) => {
  return (
    <Button 
      asChild
      variant="outline"
      className={`flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 ${className}`}
    >
      <Link to="/parceiro/dashboard">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        Painel de Parceiro
      </Link>
    </Button>
  );
}; 