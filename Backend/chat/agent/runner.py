from langchain_core.messages import HumanMessage, AIMessage
from .graph import agent_graph
from ..models import Message


class AgentError(Exception):
    pass


def run_agent(conversation_history, new_user_message: str)-> str:
    lc_messages = []
    for msg in conversation_history:
        if msg.role == Message.Role.USER:
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role == Message.Role.ASSISTANT:
            lc_messages.append(AIMessage(content=msg.content))

    lc_messages.append(HumanMessage(content=new_user_message))

    try:
        result = agent_graph.invoke({"messages":lc_messages})
    except Exception as e:
        raise AgentError(
            "Could not reach the local model. Is 'ollama serve' running"
            "and has the model been pulled?"
            f"(detail: {e})"
        )
    
    final_message = result["messages"][-1]
    return final_message.content