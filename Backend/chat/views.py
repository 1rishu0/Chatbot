from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import Conversation, Message
from .serializers import ConversationSerializer, ConversationListSerializer, MessageSerializer

from .agent.runner import run_agent, AgentError


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"})


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return ConversationListSerializer
        return ConversationSerializer

    @action(detail=True, methods=["post"])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        content = request.data.get("content","").strip()

        if not content:
            return Response(
                {
                    "error": "content is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        history = list(conversation.messages.all())

        user_message = Message.objects.create(
            conversation=conversation, 
            role=Message.Role.USER, 
            content=content
        )

        if conversation.title == "New Chat" and conversation.messages.count() == 1:
            conversation.title = content[:50] + ("..." if len(content) > 50 else "")

        try:
            assistant_reply_text = run_agent(history, content)
        except AgentError as e:
            return Response(
                {"error": str(e)},
                status = status.HTTP_502_BAD_GATEWAY,
            )
        
        assistant_message = Message.objects.create(
            conversation=conversation, 
            role=Message.Role.ASSISTANT,
            content=assistant_reply_text,
        )

        conversation.save()

        return Response(
            {
                "user_message": MessageSerializer(user_message).data,
                "assistant_message": MessageSerializer(assistant_message).data
            },
            status=status.HTTP_201_CREATED,
        )