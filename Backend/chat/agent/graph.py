from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END, add_messages
from langchain_core.messages import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()

LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'OLLAMA')

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]


def get_llm():
    if LLM_PROVIDER == "groq":
        from langchain_groq import ChatGroq
        return ChatGroq(
            model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
            temperature=0.7,
            api_key=os.getenv("GROQ_API_KEY"),
        )
    else:
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model = os.getenv("OLLAMA_MODEL", "llama3.1"),
            base_url = os.getenv('OLLAMA_BASE_URL', "http://localhost:11434"),
            temperature=0.7,
        )

llm = get_llm()

SYSTEM_PROMPT = "You are a helpful, consise AI assistant."


def call_model(state:AgentState) -> AgentState:
    messages = state["messages"]
    response = llm.invoke([SystemMessage(content=SYSTEM_PROMPT),*messages])

    return {"messages": [response]}


def build_graph():
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", call_model)
    workflow.set_entry_point("agent")
    workflow.add_edge("agent", END)
    return workflow.compile()


agent_graph = build_graph()
