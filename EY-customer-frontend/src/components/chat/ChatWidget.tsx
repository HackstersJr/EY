import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendCustomerChatMessage } from '@/lib/customerApi';
import type { ChatMessage } from '@/lib/types';
import { MessageCircle, X, Send, Loader2, Sparkles, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWidgetProps {
  title?: string;
  vehicleId?: string;
  issueId?: string;
  initialMessage?: string;
}

export const ChatWidget = ({ title = 'Vehicle Assistant', vehicleId, issueId, initialMessage }: ChatWidgetProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract context from URL if not provided
  const getVehicleId = () => {
    if (vehicleId) return vehicleId;
    const pathParts = location.pathname.split('/');
    if (pathParts.includes('vehicle') && pathParts.length > 2) {
      return pathParts[pathParts.indexOf('vehicle') + 1];
    }
    return 'veh-001';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send initial message when widget opens with a prefilled context
  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage);
    }
  }, [isOpen, initialMessage]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await sendCustomerChatMessage({
        vehicleId: getVehicleId(),
        message: messageText,
        issueId,
        conversationHistory: messages,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        text: response.message,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQueries = [
    'Vehicle health check',
    'Maintenance schedule',
    'Report an issue',
    'Recall information',
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-tesla-blue-600 to-violet-600 hover:from-tesla-blue-500 hover:to-violet-500 text-white rounded-2xl shadow-glow-blue flex items-center justify-center transition-all hover:scale-110 z-50"
            aria-label="Open chat"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[420px] glass-panel rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-customer-border bg-gradient-to-r from-tesla-blue-900/30 to-violet-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-tesla-blue-500 to-violet-500 rounded-xl flex items-center justify-center shadow-glow-blue">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{title}</h3>
                  <p className="text-xs text-customer-text-muted">AI-powered vehicle support</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-customer-text-muted hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-customer-text-muted hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-tesla-blue-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-tesla-blue-400" />
                      </div>
                      <p className="text-white font-medium mb-1">How can I help?</p>
                      <p className="text-customer-text-muted text-sm mb-6">
                        Ask about your vehicle, maintenance, or report issues
                      </p>

                      {/* Suggested Queries */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestedQueries.map((query) => (
                          <button
                            key={query}
                            onClick={() => {
                              setInputText(query);
                            }}
                            className="px-3 py-1.5 text-xs bg-customer-light-gray hover:bg-customer-border text-customer-text-secondary hover:text-white rounded-lg transition-all"
                          >
                            {query}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                          ? 'bg-gradient-to-br from-tesla-blue-600 to-violet-600 text-white'
                          : 'bg-customer-light-gray text-white'
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-customer-light-gray rounded-2xl px-4 py-3 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-tesla-blue-400 animate-spin" />
                        <span className="text-sm text-customer-text-muted">Analyzing...</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-customer-border bg-customer-dark-gray/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about your vehicle..."
                      className="flex-1 bg-customer-medium-gray text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-tesla-blue-500/50 text-sm placeholder-customer-text-muted"
                      disabled={isTyping}
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isTyping}
                      className="bg-gradient-to-br from-tesla-blue-600 to-violet-600 hover:from-tesla-blue-500 hover:to-violet-500 disabled:from-customer-light-gray disabled:to-customer-light-gray disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
