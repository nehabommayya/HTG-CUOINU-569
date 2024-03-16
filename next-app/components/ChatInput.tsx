"use client"

import React, { useContext, useRef, useState } from 'react'
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import TextareaAutosize from "react-textarea-autosize"
import { MessagesContext } from '@/context/messages';
import { useMutation } from 'react-query';
import { Message } from '@/lib/validators/message';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import { AiOutlineLoading3Quarters, AiOutlineEnter } from 'react-icons/ai'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}



const ChatInput: React.FC<ChatInputProps> = ({ className, ...props }) => {
    const textareaRef = useRef<null | HTMLTextAreaElement>(null)
    const [input, setInput] = useState<string>('')
    const {
        messages,
        addMessage,
        removeMessage,
        updateMessage,
        setIsMessageUpdating,
      } = useContext(MessagesContext)

      const { mutate: sendMessage, status } = useMutation({
        mutationKey: ['sendMessage'],
        mutationFn: async (_message: Message) => {
          const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
          })
    
          if (!response.ok) {
            throw new Error()
          }
          console.log(response)
    
          return response.body
        },
        onMutate(message) {
          addMessage(message)
        },
        onSuccess: async (stream) => {
          if (!stream) throw new Error('No stream found')
    
          //construting new message to add
          const id = nanoid()
          const responseMessage: Message = {
            id,
            isUserMessage: false,
            text: '',
          }
    
          addMessage(responseMessage)
    
          setIsMessageUpdating(true)
    
          const reader = stream.getReader()
          const decoder = new TextDecoder()
          let done = false
    
          while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading
            const chunkValue = decoder.decode(value)
            console.log(chunkValue)
            updateMessage(id, (prev: string) => prev + chunkValue)
          }
    
          setIsMessageUpdating(false)
          setInput('')
    
          setTimeout(() => {
            textareaRef.current?.focus()
          }, 10)
        },
        onError: (_, message) => {
          toast.error('Something went wrong. Please try again.')
          removeMessage(message.id)
          textareaRef.current?.focus()
        },
      })

      const sendMessageHandler = () => {
        if (input.trim() !== '') {
          // Prevent sending empty messages
          const message: Message = {
            id: nanoid(),
            isUserMessage: true,
            text: input,
          }
    
          sendMessage(message)
        }
      }


      return (
        <div {...props} className={`fixed inset-x-0 bottom-0 p-2 bg-white rounded-3xl py-4 px-4 my-4 mx-4 ${className}`}>
          <div className='relative flex items-center w-full'>
            <TextareaAutosize
              className='flex-1 rounded-lg bg-zinc-300 py-1.5 px-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none disabled:opacity-50'
              minRows={2}
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessageHandler();
                }
              }}
              autoFocus
              placeholder='Write a message...'
            />
            <div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
          <kbd className='inline-flex items-center rounded border border-gray-200 bg-lightpurple px-1 font-sans text-xs text-white'>
            {status == 'loading' ? (
              <AiOutlineLoading3Quarters className='h-3 w-3 animate-spin ' />
            ) : (
              <AiOutlineEnter
                className='h-3 w-3'
                onClick={sendMessageHandler}
              />
            )}
          </kbd>
        </div>
        <div
          aria-hidden='true'
          className='border-top absolute inset-x-0 bottom-0 border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600'
        />
          </div>
          
        </div>
    );;
}

export default ChatInput