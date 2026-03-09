'use client';

import React from 'react';
import { format } from 'date-fns';

const ChatBubble = ({ message }) => {
    const isBot = message.message_type === 'bot';

    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-2xl p-3 shadow-md transition-all ${isBot
                        ? 'bg-blue-600 text-white rounded-tl-none'
                        : 'bg-green-100 dark:bg-green-900/50 text-gray-800 dark:text-white rounded-tr-none'
                    }`}
            >
                <p className="text-sm font-medium">{message.message}</p>
                <div className={`flex justify-end items-center mt-1 space-x-1 ${isBot ? 'text-blue-100' : 'text-gray-500'}`}>
                    <span className="text-[10px] font-bold">
                        {message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : ''}
                    </span>
                    {!isBot && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
