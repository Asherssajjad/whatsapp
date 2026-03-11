'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import socket from '../../services/socket';
import { getContacts, getMessages } from '../../services/api';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [activeContact, setActiveContact] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await getContacts();
                setContacts(response.data);
            } catch (err) {
                console.error('Failed to fetch contacts:', err);
            }
        };
        fetchContacts();

        socket.on('new_message', (data) => {
            setContacts((prev) => {
                const contactIndex = prev.findIndex((c) => c.phone_number === data.message.phone_number);
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
                            : (updatedContacts[contactIndex].unread_count || 0) + 1
                    };
                    const contact = updatedContacts.splice(contactIndex, 1)[0];
                    return [contact, ...updatedContacts];
                }
                return prev;
            });

            if (activeContact?.phone_number === data.message.phone_number) {
                setMessages((prev) => [...prev, data.message]);
            }
        });

        return () => {
            socket.off('new_message');
        };
    }, [activeContact]);

    useEffect(() => {
        if (activeContact) {
            const fetchMessages = async () => {
                try {
                    const response = await getMessages(activeContact.phone_number);
                    setMessages(response.data);
                    setContacts((prev) => prev.map((c) =>
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
        setMessages((prev) => [...prev, msg]);
    };

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden font-outfit" data-theme="dark">
            <motion.div 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full z-10"
            >
                <Sidebar
                    contacts={contacts}
                    activeContact={activeContact}
                    onSelectContact={setActiveContact}
                />
            </motion.div>
            
            <motion.div 
                className="flex-1 h-full relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <ChatWindow
                    activeContact={activeContact}
                    messages={messages}
                    addMessage={addMessage}
                />
            </motion.div>
        </div>
    );
}
