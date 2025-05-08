import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

const API_KEY: string = import.meta.env.VITE_APP_OPENAI_API_KEY;

interface MessageObject {
  message: string;
  direction?: string;
  sender: string;
  sentTime?: string;
}

const ChatBoxAI: React.FC = () => {
  const [messages, setMessages] = useState<MessageObject[]>([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: 'just now',
      sender: 'ChatGPT',
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendRequest = async (message: string) => {
    const newMessage: MessageObject = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse: MessageObject = {
          message: content,
          sender: 'ChatGPT',
          direction: 'incoming',
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages: MessageObject[]) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === 'ChatGPT' ? 'assistant' : 'user';
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  return (
    <div className="" style={{ width: '100%' }}>
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        <MainContainer
          style={{
            paddingLeft: '10%',
            paddingRight: '10%',
          }}
        >
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="ChatGPT is typing 123" />
                ) : null
              }
            >
              {messages.map((message, i) => (
                <Message
                  key={i}
                  model={{
                    message: message.message,
                    sentTime: message.sentTime,
                    sender: message.sender,
                    direction:
                      message.sender === 'ChatGPT' ? 'incoming' : 'outgoing',
                    position:
                      message.sender === 'ChatGPT' ? 'normal' : 'single',
                  }}
                />
              ))}
            </MessageList>
            <MessageInput
              className="custom-message-input"
              placeholder="Send a Message"
              onSend={handleSendRequest}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};
export default ChatBoxAI;
