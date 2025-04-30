
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, StarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Order } from '@/types/orders';

type OrderRatingProps = {
  order: Order;
  onRatingSubmit: () => void;
};

const OrderRating: React.FC<OrderRatingProps> = ({ order, onRatingSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleRatingSubmit = async () => {
    if (!rating) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('project_ratings')
        .insert({
          order_id: order.id,
          rating,
          comment: comment.trim() || null,
        });
      
      if (error) throw error;
      
      toast.success('Avaliação enviada com sucesso!');
      onRatingSubmit();
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast.error('Não foi possível enviar sua avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
      <h3 className="font-medium">Avalie nosso trabalho</h3>
      
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            {star <= rating ? (
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="h-6 w-6 text-gray-300" />
            )}
          </button>
        ))}
      </div>
      
      <Textarea
        placeholder="Deixe um comentário (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="resize-none"
        rows={3}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleRatingSubmit}
          disabled={submitting}
          className="bg-kolibra-orange hover:bg-amber-500"
        >
          {submitting ? 'Enviando...' : 'Enviar Avaliação'}
        </Button>
      </div>
    </div>
  );
};

export default OrderRating;
