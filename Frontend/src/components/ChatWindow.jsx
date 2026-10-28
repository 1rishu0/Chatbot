import {useEffect, useRef} from "react"
import MessageBubble from "./MessageBubble"

function ChatWindow({messages, loading}){
    const bottomRef = useRef(null);

    useEffect(()=> {
        bottomRef.current?.scrollIntoView({behaviour:"smooth"});
    }, [messages, loading]);

    return (
        <>
        <div className="chat-window">
            {messages.length === 0 && !loading && (
                <div className="empty-state">Start a conversation below</div>
            )}

            {
                messages.map(
                    (msg) => (
                        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                    )
                )
            }

            {
                loading && (
                    <div className="message-bubble assistant">
                        <div className="bubble-content typing">
                            Thinking....
                        </div>
                    </div>
                )
            }

            <div ref={bottomRef}></div>
        </div>
        </>
    )
}

export default ChatWindow;