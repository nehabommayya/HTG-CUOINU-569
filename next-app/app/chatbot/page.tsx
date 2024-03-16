import ChatInput from '@/components/ChatInput';
import ChatMessages from '@/components/ChatMessages';
import React from 'react';

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-mydrbg">
      <div className='flex items-center justify-center py-12 mx-2 my-2'>
          <div className='bg-mydrlogocolour w-auto rounded-full px-6 py-1 text-center text-white text-4xl '>MyDr</div>
      </div>
        <ChatMessages className=""/>
        <ChatInput/>
    </div>
  );
};

export default ChatPage;
