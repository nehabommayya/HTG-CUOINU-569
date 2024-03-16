import ChatInput from '@/components/ChatInput';
import React from 'react';

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-200">
        {/* Placeholder for messages */}
        {/* This is where your messages will be mapped */}
        <div className="flex flex-col space-y-2">
          {/* Example of an outgoing message */}
          <div className="ml-auto bg-blue-500 text-white max-w-xs rounded-lg p-2">
            This is a message I sent.
          </div>
          {/* Example of an incoming message */}
          <div className="mr-auto bg-white text-gray-700 max-w-xs rounded-lg p-2">
            This is a reply I received.
          </div>
          {/* Add more placeholders as needed */}
        </div>
      </div>

      {/* Input area simulating a keyboard */}
      <div className="flex-none p-4 bg-gray-100">
        <ChatInput/>
      </div>
    </div>
  );
};

export default ChatPage;
