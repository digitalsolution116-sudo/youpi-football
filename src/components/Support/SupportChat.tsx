import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, User, Bot, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  type?: 'text' | 'quick_reply';
}

const quickReplies = [
  'Comment effectuer un dépôt ?',
  'Problème de retrait',
  'Comment fonctionne le remboursement ?',
  'Modifier mes informations',
  'Problème technique'
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
    sender: 'support',
    timestamp: new Date(Date.now() - 60000)
  }
];

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(text),
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAutoResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('dépôt') || message.includes('depot')) {
      return 'Pour effectuer un dépôt, allez dans "Mon Compte" > "Déposer". Nous acceptons Mobile Money, Orange Money et MTN Money. Le montant minimum est de 1000 FCFA.';
    }
    
    if (message.includes('retrait')) {
      return 'Les retraits sont traités sous 24h. Montant minimum : 5000 FCFA. Allez dans "Mon Compte" > "Retirer" pour faire une demande.';
    }
    
    if (message.includes('remboursement')) {
      return 'Notre système de paris inversé vous rembourse automatiquement 80% de vos paris perdus. Le remboursement est crédité immédiatement après la fin du match.';
    }
    
    if (message.includes('technique') || message.includes('bug')) {
      return 'Je vais transférer votre demande à notre équipe technique. Pouvez-vous décrire le problème plus précisément ?';
    }
    
    return 'Merci pour votre message. Un agent va vous répondre dans les plus brefs délais. En attendant, consultez notre FAQ ou appelez le +33 1 23 45 67 89.';
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Support Client</h3>
                    <p className="text-xs opacity-90">En ligne</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Questions fréquentes :</p>
                <div className="flex flex-wrap gap-1">
                  {quickReplies.slice(0, 3).map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Phone size={12} />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail size={12} />
                  <span>support@app.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};