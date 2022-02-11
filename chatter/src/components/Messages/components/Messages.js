import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import io from "socket.io-client";
// import useSound from "use-sound";
import config from "../../../config";
import LatestMessagesContext from "../../../contexts/LatestMessages/LatestMessages";
import TypingMessage from "./TypingMessage";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import "../styles/_messages.scss";

import initialBottyMessage from "../../../common/constants/initialBottyMessage";

const socket = io(config.BOT_SERVER_ENDPOINT, {
  transports: ["websocket", "polling", "flashsocket"],
});

function Messages() {
  const { setLatestMessage } = useContext(LatestMessagesContext);
  const [messages, setMessages] = useState([
    { user: "bot", message: initialBottyMessage },
  ]);
  const [botIsTyping, setBotIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const onChangeMessage = useCallback(({ target }) => {
    setMessage(target.value);
  }, []);

  const sendMessage = useCallback(() => {
    setMessages((messages) => [...messages, { user: "me", message }]);
    socket.emit("user-message", message);
    setMessage("");
  }, [message]);

  useEffect(() => {
    socket.on("bot-typing", () => {
      setBotIsTyping(true);
    });

    socket.on("bot-message", (message) => {
      setBotIsTyping(false);
      setMessages((messages) => [...messages, { user: "bot", message }]);
    });
  }, []);

  useEffect(() => {
    const lastPos = messages.length - 1;
    const lastMessage = messages[lastPos];
    setLatestMessage("bot", lastMessage.message);
    scrollToBottom();
  }, [messages, setLatestMessage, scrollToBottom]);

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {messages.map((message, id) => {
          return (
            <Message
              key={id}
              botTyping={botIsTyping}
              message={{ ...message, id }}
            />
          );
        })}
        {botIsTyping && <TypingMessage />}
        <div ref={messagesEndRef} />
      </div>
      <Footer
        message={message}
        sendMessage={sendMessage}
        onChangeMessage={onChangeMessage}
      />
    </div>
  );
}

export default Messages;
