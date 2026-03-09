'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import socket from '../../services/socket';
import { getContacts, getMessages } from '../../services/api';

export default function DashboardPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [activeContact, setActiveContact] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // Fetch initial contacts
        const fetchContacts = async () => {
            try {
                const response = await getContacts();
                setContacts(response.data);
            } catch (err) {
                console.error('Failed to fetch contacts:', err);
            }
        };
        fetchContacts();

        // Socket listeners
        socket.on('new_message', (data) => {
            // Update contacts list if it's a new contact or new message
            setContacts((prev: any[]) => {
                const contactIndex = prev.findIndex((c: any) => c.phone_number === data.message.phone_number);
                if (contactIndex === -1 && data.contact) {
                    return [data.contact, ...prev];
                } else if (contactIndex !== -1) {
                    const updatedContacts = [...prev];
                    updatedContacts[contactIndex] = {
                        ...updatedContacts[contactIndex],
                        last_message: data.message.message,
                        last_message_time: data.message.timestamp || new Date(),
                        unread_count: (activeContact?.phone_number === data.message.phone_number)
                            ? updatedContacts[contactIndex].unread_count
                            : updatedContacts[contactIndex].unread_count + 1
                    };
                    // Move to top
                    const contact = updatedContacts.splice(contactIndex, 1)[0];
                    return [contact, ...updatedContacts];
                }
                return prev;
            });

            // Update messages if conversation is active
            if (activeContact?.phone_number === data.message.phone_number) {
                setMessages((prev: any[]) => [...prev, data.message]);
            }
        });

        return () => {
            socket.off('new_message');
        };
    }, [activeContact]);

    useEffect(() => {
        // Fetch messages when a contact is selected
        if (activeContact) {
            const fetchMessages = async () => {
                try {
                    const response = await getMessages(activeContact.phone_number);
                    setMessages(response.data);

                    // Reset unread count locally
                    setContacts((prev: any[]) => prev.map((c: any) =>
                        c.phone_number === activeContact.phone_number ? { ...c, unread_count: 0 } : c
                    ));
                } catch (err) {
                    console.error('Failed to fetch messages:', err);
                }
            };
            fetchMessages();
        }
    }, [activeContact]);

    const addMessage = (msg: any) => {
        setMessages((prev: any[]) => [...prev, msg]);
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar
                contacts={contacts}
                activeContact={activeContact}
                onSelectContact={setActiveContact}
            />
            <ChatWindow
                activeContact={activeContact}
                messages={messages}
                addMessage={addMessage}
            />
        </div>
    );
}
