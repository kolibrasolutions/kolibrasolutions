
import React from 'react';
import { Bot } from "lucide-react";
import KolibriChat from './KolibriChat';
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";

const WIDGET_AVATAR = "/lovable-uploads/a99a7ff6-4e2f-4da7-b458-9f64d60dcc9e.png";

const KolibriWidget: React.FC = () => {
  return (
    <ExpandableChat
      position="bottom-right"
      size="lg"
      icon={
        <img
          src={WIDGET_AVATAR}
          alt="Kolibri IA"
          className="w-full h-full object-contain rounded-full"
        />
      }
    >
      {/* O conteúdo da janela de chat */}
      <KolibriChat isWidget={true} />
    </ExpandableChat>
  );
};

export default KolibriWidget;
