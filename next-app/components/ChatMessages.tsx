'use client'

import { MessagesContext } from '@/context/messages'
import { cn } from '@/lib/utils'
import React, { FC, HtmlHTMLAttributes, useContext } from 'react'
import MarkdownFormatting from './MarkdownFormatting'

interface ChatMessagesProps extends HtmlHTMLAttributes<HTMLDivElement> {}

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
  const { messages } = useContext(MessagesContext)
  const inverseMessages = [...messages].reverse()

  return (
    <div
      {...props}
      className={cn(
        'scrollbar-thumb-blue rounded-3xl h-4/6 mb-4 mx-4 py-6 px-4 bg-white scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-col-reverse gap-3 overflow-y-auto',
        className
      )}
    >
      <div className='flex-1 flex-grow py-60 ' />
      {inverseMessages.map((message) => {
        return (
          <div className='chat-message' key={`${message.id}-${message.id}`}>
            <div
              className={cn('flex items-end', {
                'justify-end': message.isUserMessage,
              })}
            >
              <div
                className={cn(
                  'mx-2 flex max-w-xs flex-col space-y-2 overflow-x-hidden text-sm',
                  {
                    'order-1 items-end': message.isUserMessage,
                    'order-2 items-start': !message.isUserMessage,
                  }
                )}
              >
                <p
                  className={cn('rounded-xl px-4 py-1', {
                    'bg-usermessage text-white': message.isUserMessage,
                    'bg-botmessage text-white': !message.isUserMessage,
                  })}
                >
                  <MarkdownFormatting text={message.text} />
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatMessages
