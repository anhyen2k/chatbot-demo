
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"
import { useState } from 'react';

const API_KEY = "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"
const systemMessage = { "role": "system", "content": "Hãy giải thích những điều giống như bạn đang nói chuyện với một sinh viên công nghệ thông tin mới ra trường."}


function App() {
  const [typing, setTyping] =useState(false);
  const [messages,setMessages] = useState([
    {
      message: "Xin chào, tôi là ChatGPT",
      sender: "ChatGPT"
    }
  ])

  const handleSen = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
    const newMessages = [...messages, newMessage] // messages cũ + message mới

    // update trạng thái message
    setMessages(newMessages);

    // Xử lý khi chatbot nhập
    setTyping(true)

    await processMessage(newMessages)

    async function processMessage(chatMessages) { 
      
  
      let apiMessages = chatMessages.map((messageObject) => {
        let role = "";
        if (messageObject.sender === "ChatGPT") {
          role = "assistant";
        } else {
          role = "user";
        }
        return { role: role, content: messageObject.message}
      });
  
  
       
      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          systemMessage,  
          ...apiMessages
        ]
      }
  
      await fetch("https://api.openai.com/v1/chat/completions", 
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json()
      }).then((data) => {
        console.log(data)
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]);
        // 
        setTyping(false);
      });
    }
  }


  return (
    <div className="App" style={{background: "linear-gradient(320deg, #eb92be, #ffef78, #63c9b4)"}}>
      <div style={{ position: "relative",margin: "auto" , height: 720, width: 700}}>
        <MainContainer style={{borderRadius: 15}}>
        <ChatContainer>
          <MessageList
          typingIndicator={typing ? <TypingIndicator  content="ChatGPT đang nhập"/>: null}>
            {messages.map((message, index) => {
              return <Message key={index} model={message}/>
            })}
          </MessageList>
            <MessageInput placeholder='Nhập câu hỏi của bạn!' onSend={handleSen}/>
        </ChatContainer>
        </MainContainer>
      </div>      
    </div>
  );
}

export default App;
