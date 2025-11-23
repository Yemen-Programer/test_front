'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Users, Utensils, Palette, Landmark, HelpCircle, Heart } from 'lucide-react';
import './page.css';
import Header from '../components/header';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! أنا دليلة، مساعدتك الذكية للتعرف على التراث السعودي. كيف يمكنني مساعدتك اليوم؟',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🚀 إرسال الرسالة إلى API المحلي بدل OpenAI مباشرة
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const systemPrompt = `أنت "دليلة" - مساعد ذكي متخصص في التراث السعودي. 

مهمتك: تقديم معلومات دقيقة وشاملة عن التراث السعودي بما في ذلك:

🏔️ **المناطق الخمس:**
- المنطقة الشمالية
- المنطقة الوسطى
- المنطقة الجنوبية
- المنطقة الغربية
- المنطقة الشرقية

📚 **المحتوى المتاح:**
- الأماكن التراثية
- الأزياء
- الأكلات الشعبية
- الفنون
- العادات والتقاليد

🎯 تعليمات:
- تحدث بلغة عربية فصحى بلمسات محلية
- كن منظماً وواضحاً
- إذا لم تعرف، قل ذلك بصراحة`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: inputText,
          systemPrompt
        })
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("API Error:", error);

      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        text: 'عذراً، حدث خطأ في الاتصال بالخادم. حاول مرة أخرى.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) handleSendMessage();
    }
  };

  const quickReplies = [
    { text: 'أخبرني عن المنطقة الشمالية', icon: <MapPin size={16} /> },
    { text: 'ما هي الأزياء التقليدية في السعودية؟', icon: <Users size={16} /> },
    { text: 'ما أشهر الأكلات الشعبية السعودية؟', icon: <Utensils size={16} /> },
    { text: 'أخبرني عن الفنون الشعبية في المنطقة الوسطى', icon: <Palette size={16} /> },
    { text: 'ما هي المعالم التراثية في نجد؟', icon: <Landmark size={16} /> },
    { text: 'كيف يمكنك مساعدتي في التراث السعودي؟', icon: <HelpCircle size={16} /> },
    { text: 'أخبرني عن التراث في المنطقة الشرقية', icon: <MapPin size={16} /> },
    { text: 'ما هي العادات والتقاليد السعودية؟', icon: <Heart size={16} /> }
  ];

  return (
    <>
      <Header />
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>🏺 دليلة - التراث السعودي</h2>
            <p>مساعدتك الذكية لاكتشاف تراث المملكة</p>
          </div>

          <div className="sidebar-content">
            <div className="info-card">
              <h3><MapPin size={18} /> المناطق الخمس</h3>
              <ul>
                <li>🏔️ الشمالية</li>
                <li>❤️ الوسطى</li>
                <li>🏞️ الجنوبية</li>
                <li>🕋 الغربية</li>
                <li>🌊 الشرقية</li>
              </ul>
            </div>

            <div className="info-card">
              <h3><Palette size={18} /> مواضيع رئيسية</h3>
              <ul>
                <li>🏰 الأماكن التراثية</li>
                <li>👗 الأزياء التقليدية</li>
                <li>🍽️ الأكلات الشعبية</li>
                <li>🎭 الفنون الشعبية</li>
                <li>📜 العادات والتقاليد</li>
              </ul>
            </div>

            <div className="info-card">
              <h3><HelpCircle size={18} /> نصائح للبحث</h3>
              <p>• اسأل عن منطقة محددة</p>
              <p>• استفسر عن الأزياء</p>
              <p>• اكتشف الأكلات</p>
              <p>• تعرف على الفنون</p>
            </div>
          </div>
        </div>

        <div className="chat-main">
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                <div className="message-content">
                <div className="message-text">
                  {(message.text ?? "").split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>

                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => {
                  setInputText(reply.text);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                disabled={isLoading}
              >
                {reply.icon}
                {reply.text}
              </button>
            ))}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="اكتب رسالتك عن التراث السعودي..."
                className="message-input"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="send-button"
              >
                {isLoading ? '⏳' : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
