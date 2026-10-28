import client from "./client";

export const listConversations = () => 
    client.get("/conversations/").then((res)=> res.data);

export const getConversation = (id) => 
    client.get(`/conversations/${id}/`).then((res)=> res.data);

export const createConversation = () =>
    client.post("/conversations/", {}).then((res) => res.data);

export const deleteConversation = (id) =>
    client.delete(`/conversations/${id}/`).then((res) => res.data);

export const sendMessage = (conversationId, content) => 
    client
        .post(`/conversations/${conversationId}/send_message/`, {content})
        .then((res) => res.data);

export const checkHealth = () => 
    client.get("/health/").then((res) => res.data);