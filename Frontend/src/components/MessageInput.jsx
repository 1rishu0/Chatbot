import { useState } from "react";

function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message Your assistant...."
        disabled={disabled}
     />
     <button
        type="submit"
        disabled={disabled || !text.trim()}
     >
        Send
     </button>
    </form>
  );
}

export default MessageInput;
