import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import {
  listConversations,
  getConversation,
  createConversation,
  deleteConversation,
  sendMessage,
} from "./api/conversations";
import "./App.css"
import { checkHealth } from "./api/conversations";

function App(){
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(()=>{
    const check = () => 
      checkHealth()
          .then(()=> setBackendOnline(true))
          .catch(() => setBackendOnline(false));

    check();
    const interval = setInterval(check, 10000); 
    return () => clearInterval(interval);
  },[]);

  const loadConversations = async () => {
    const data = await listConversations();
    setConversations(data);
    return data;
  }

  useEffect(() => {
    loadConversations()
        .then((data) => {
      if (data.length > 0) selectConversation(data[0].id);
    })
        .finally(()=> setInitialLoading(false))
  }, []);

  const selectConversation = async (id) => {
    setActiveId(id);
    const data = await getConversation(id);
    setMessages(data.messages);
  }

  const handleNew = async () => {
    const conv = await createConversation();
    await loadConversations();
    setActiveId(conv.id);
    setMessages([]);
  };

  const handleDelete = async (id) => {
    await deleteConversation(id);
    const data = await loadConversations();
    if (id === activeId) {
      if (data.length > 0) {
        selectConversation(data[0].id);
      } else {
        setActiveId(null);
        setMessages([]);
      }
    }
  };

  const handleSend = async (content) => {
    if (!activeId) return ;

    const tempUserMsg = {id : `temp-${Date.now()}`, role:"user", content};
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try{
      const result = await sendMessage(activeId, content);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        result.user_message,
        result.assistant_message,
      ]);
      await loadConversations();
    } catch(err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "Something went wrong talking to the agent.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="app-loading">Loading....</div>
    )
  }

  return (
    <>
    <div className="app">

      {!backendOnline && (
        <div className="offline-banner">
          Backend Unreachable - make sure Django is running.
        </div>
      )}

      <Sidebar 
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={handleNew}  
        onDelete={handleDelete}
      />

      <div className="main-panel">
        <ChatWindow
          messages={messages}
          loading={loading}
        ></ChatWindow>
        <MessageInput
          onSend={handleSend}
          disabled={!activeId || loading}
        ></MessageInput>
      </div>
    </div>
    </>
  )
}

export default App;