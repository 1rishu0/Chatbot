import ReactMarkdown from 'react-markdown';


function MessageBubble({role, content}) {
    return (
        <div className={`message-bubble ${role}`}>
            <div className="bubble-content">
                {
                    role === 'assistant' ? (
                        <ReactMarkdown>{content}</ReactMarkdown>
                    ) : (
                        content
                    )
                }
            </div>
        </div>
    )
}

export default MessageBubble;