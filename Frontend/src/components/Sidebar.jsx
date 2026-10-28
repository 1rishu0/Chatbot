function Sidebar({conversations, activeId, onSelect, onNew, onDelete}) {
    return (
        <>
        <div className="sidebar">
            <button className="new-chat-btn" onClick={onNew}>
                + New Chat
            </button>

            <div className="conversation-list">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        className={`conversation-item ${conv.id=== activeId ? "active" : ""}`}
                        onClick={()=> onSelect(conv.id)}
                    >
                        <span className="conversation-title">
                            {conv.title}
                        </span>
                        <button
                            className="delete-btn"
                            onClick={(e)=> {
                                e.stopPropagation();
                                onDelete(conv.id);
                            }}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}

export default Sidebar;