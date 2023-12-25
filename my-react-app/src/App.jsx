import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello I am ChatGPT!",
      sender: "ChatGPT",
    },
  ]);
  const hundleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage]; // all the old messages, + the new message

    // Update our message state
    setMessages(newMessages);

    // Set a typing indicator (ChatGPT is typing)
    setTyping(true);
    // Process massage to ChatGPT (send it and see the response)
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // chatMessages { sender: "user" or "ChatGPT", message: "the message content here"}
    // apiMessage {role: "user" or "assistant", content: "the message content here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // role: "user" -> a message from the user, "assistant" -> a response from chatGPT
    // "system" -> generally one initial message defining HOW we want chatGpt to talk

    const systemMessage = {
      role: "system",
      content: "Explain all cocepte like I am 10 years old.", // Speak like a pirate, Explain like I am a 10 year of experience softwere engineer
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages, //  {message1, message2, message3}
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        // console.log(data);
        // console.log(data.choices[0].message.content);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false)
      });
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "100vh", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={
                typing ? <TypingIndicator content="ChatGPT is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={hundleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
