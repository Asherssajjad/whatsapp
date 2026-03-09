'use client';

import React from 'react';
import { format } from 'date-fns';

const Sidebar = ({ contacts, activeContact, onSelectContact }) => {
    return (
        <div className="w-1/4 h-full border-r bg-white dark:bg-gray-900 flex flex-col">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <h1 className="text-xl font-bold">Chats</h1>
                <div className="flex space-x-2">
                    {/* Add Search Icon Or Other Actions */}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => (
                    <div
                        key={contact.phone_number}
                        onClick={() => onSelectContact(contact)}
                        className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${activeContact?.phone_number === contact.phone_number
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                                : ''
                            }`}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold mr-3 overflow-hidden">
                            {contact.avatar ? <img src={contact.avatar} alt="avatar" /> : contact.name[0]}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold block truncate">{contact.name || contact.phone_number}</span>
                                <span className="text-xs text-gray-500">
                                    {contact.last_message_time ? format(new Date(contact.last_message_time), 'HH:mm') : ''}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{contact.last_message}</p>
                        </div>
                        {contact.unread_count > 0 && (
                            <span className="ml-2 bg-green-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                {contact.unread_count}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
