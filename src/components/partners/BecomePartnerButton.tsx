import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface BecomePartnerButtonProps {
  className?: string;
}

export const BecomePartnerButton: React.FC<BecomePartnerButtonProps> = ({ className = '' }) => {
  return (
    <Button 
      asChild
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
    >
      <Link to="/parceiros">
        <Users className="h-4 w-4" />
        Seja um Parceiro
      </Link>
    </Button>
  );
}; 