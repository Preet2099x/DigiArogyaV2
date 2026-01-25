import { useState, useEffect, useRef } from 'react';
import { messageApi } from '../../services/messageService';
import authService from '../../services/authService';

const Messages = () => {
  const user = authService.getUser();
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load contacts and conversations
  useEffect(() => {
    loadContactsAndConversations();
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages when a conversation is selected
  useEffect(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    if (selectedContact) {
      pollIntervalRef.current = setInterval(() => {
        loadMessages(selectedContact.otherUserId, true);
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [selectedContact]);

  const loadContactsAndConversations = async () => {
    try {
      setLoading(true);
      const [contactsData, conversationsData] = await Promise.all([
        messageApi.getContacts(),
        messageApi.getConversations(),
      ]);
      setContacts(contactsData);
      setConversations(conversationsData);

      // Merge conversations with contacts to show unread counts
      const contactsWithConversations = contactsData.map(contact => {
        const conv = conversationsData.find(c => c.otherUserId === contact.otherUserId);
        return {
          ...contact,
          lastMessage: conv?.lastMessage || null,
          lastMessageAt: conv?.lastMessageAt || null,
          unreadCount: conv?.unreadCount || 0,
        };
      });

      // Sort by last message time (most recent first)
      contactsWithConversations.sort((a, b) => {
        if (!a.lastMessageAt && !b.lastMessageAt) return 0;
        if (!a.lastMessageAt) return 1;
        if (!b.lastMessageAt) return -1;
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      });

      setContacts(contactsWithConversations);
    } catch (err) {
      setError('Failed to load contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const messagesData = await messageApi.getConversation(otherUserId);
      setMessages(messagesData);
      
      // Update unread count for this contact
      setContacts(prev => prev.map(c => 
        c.otherUserId === otherUserId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err) {
      if (!silent) setError('Failed to load messages');
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setMessages([]);
    loadMessages(contact.otherUserId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact || sendingMessage) return;

    try {
      setSendingMessage(true);
      const sentMessage = await messageApi.sendMessage(selectedContact.otherUserId, newMessage.trim());
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Update last message in contacts
      setContacts(prev => prev.map(c => 
        c.otherUserId === selectedContact.otherUserId 
          ? { ...c, lastMessage: newMessage.trim(), lastMessageAt: sentMessage.sentAt }
          : c
      ));
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="text-red-500 text-sm underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex h-full">
          {/* Contacts/Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                {user?.role === 'DOCTOR' ? 'Patients' : 'Doctors'}
              </h2>
              <p className="text-sm text-gray-500">
                {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} with active access
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No contacts available</p>
                  <p className="text-xs mt-1">
                    {user?.role === 'DOCTOR' 
                      ? 'Patients who grant you access will appear here' 
                      : 'Grant access to a doctor to start messaging'}
                  </p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <button
                    key={contact.otherUserId}
                    onClick={() => handleSelectContact(contact)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedContact?.otherUserId === contact.otherUserId ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-600 font-semibold">
                          {contact.otherUserName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">{contact.otherUserName}</p>
                          {contact.lastMessageAt && (
                            <span className="text-xs text-gray-400">{formatTime(contact.lastMessageAt)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">
                            {contact.lastMessage || (
                              <span className="italic">No messages yet</span>
                            )}
                          </p>
                          {contact.unreadCount > 0 && (
                            <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">
                        {selectedContact.otherUserName?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedContact.otherUserName}</h3>
                      <p className="text-sm text-gray-500 capitalize">{selectedContact.otherUserRole?.toLowerCase()}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.senderId === user?.userId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-emerald-500 text-white rounded-br-md'
                                : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-200'
                            }`}
                          >
                            <p className="break-words">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-emerald-100' : 'text-gray-400'}`}>
                              {formatMessageTime(message.sentAt)}
                              {isOwnMessage && message.isRead && (
                                <span className="ml-1">✓✓</span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendingMessage}
                      className="px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {sendingMessage ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a contact from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
