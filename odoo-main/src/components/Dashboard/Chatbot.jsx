import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I\'m your AI travel assistant. Where would you like to go next?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            if (!import.meta.env.VITE_GEMINI_API_KEY) {
                throw new Error("Missing VITE_GEMINI_API_KEY in .env");
            }

            // Try 1.5-flash first, fallback to pro
            let modelName = "gemini-1.5-flash";
            let model = genAI.getGenerativeModel({ model: modelName });

            try {
                const result = await model.generateContent(userMsg);
                const response = await result.response;
                const text = response.text();
                setMessages(prev => [...prev, { role: 'assistant', text: text }]);
            } catch (firstError) {
                console.warn(`Failed with ${modelName}, trying gemini-pro...`, firstError);
                // Fallback
                modelName = "gemini-pro";
                model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(userMsg);
                const response = await result.response;
                const text = response.text();
                setMessages(prev => [...prev, { role: 'assistant', text: text }]);
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: `Error: ${error.message || "Something went wrong"}. Please check your API key.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 sm:w-96"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 bg-brand-500 p-4 text-white dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <Bot size={20} />
                                <span className="font-semibold">Plan with AI (Gemini)</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 hover:bg-white/20"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                            ? 'bg-brand-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-none bg-white px-4 py-2 shadow-sm dark:bg-gray-800">
                                        <Loader2 size={16} className="animate-spin text-brand-500" />
                                        <span className="text-xs text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="border-t border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about a destination..."
                                    className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition-shadow hover:shadow-xl hover:shadow-brand-600/40"
            >
                <MessageSquare size={24} />
            </motion.button>
        </>
    );
};

export default Chatbot;
