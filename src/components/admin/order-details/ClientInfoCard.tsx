
import React from 'react';

type ClientInfoProps = {
  fullName: string | null;
  email: string;
  phone: string | null;
};

export const ClientInfoCard: React.FC<ClientInfoProps> = ({ 
  fullName, 
  email, 
  phone 
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Informações do Cliente</h3>
      <div className="space-y-1">
        <p><span className="font-medium">Nome:</span> {fullName || 'N/A'}</p>
        <p><span className="font-medium">Email:</span> {email}</p>
        <p><span className="font-medium">Telefone:</span> {phone || 'N/A'}</p>
      </div>
    </div>
  );
};
