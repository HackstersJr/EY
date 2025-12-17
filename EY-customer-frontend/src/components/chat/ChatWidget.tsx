import { useState, useRef, useEffect } from 'react';
import { sendCustomerChatMessage } from '@/lib/customerApi';
import type { ChatMessage } from '@/lib/types';
import { MessageCircle, X, Send, Loader2, Sparkles, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWidgetProps {
  title?: string;
  vehicleId?: string;
  issueId?: string;
}

export const ChatWidget = ({ title = 'AI Assistant', vehicleId, issueId }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const messageText = inputText.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setCurrentSuggestions([]);

    try {
      const response = await sendCustomerChatMessage({
        message: messageText,
        vehicleId: vehicleId || '',
      });
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        text: response.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (response.suggestedActions && response.suggestedActions.length > 0) {
        setCurrentSuggestions(response.suggestedActions);
      }
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
    'Check my vehicle health',
    'Schedule a service',
    'Recent diagnostics',
    'Maintenance tips',
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl shadow-glow flex items-center justify-center transition-all hover:scale-110 z-50"
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
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/20 to-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-xs text-text-muted">AI-powered vehicle assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-text-muted hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
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
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-white font-medium mb-1">How can I help?</p>
                    <p className="text-text-muted text-sm mb-6">
                      Ask about your vehicle, service, or maintenance
                    </p>

                    {/* Suggested Queries */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedQueries.map((query) => (
                        <button
                          key={query}
                          onClick={() => {
                            setInputText(query);
                          }}
                          className="px-3 py-1.5 text-xs bg-light-gray hover:bg-border text-text-secondary hover:text-white rounded-lg transition-all"
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
                        ? 'bg-gradient-to-br from-primary to-secondary text-white'
                        : 'bg-light-gray text-white'
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
                    <div className="bg-light-gray rounded-2xl px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-sm text-text-muted">Analyzing...</span>
                    </div>
                  </motion.div>
                )}

                {currentSuggestions.length > 0 && !isTyping && (
                  <div className="flex flex-wrap gap-2 justify-start ml-2 mt-2">
                    {currentSuggestions.map((query, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setInputText(query)}
                        className="px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-all"
                      >
                        {query}
                      </motion.button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-dark-gray/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-medium-gray text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm placeholder-text-muted"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:from-light-gray disabled:to-light-gray disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all"
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
