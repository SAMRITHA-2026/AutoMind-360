import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Bot, User, Loader2, Phone, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage, Vehicle } from "@shared/schema";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  vehicle?: Vehicle;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isCallActive?: boolean;
  onStartCall?: () => void;
  onEndCall?: () => void;
}

export function ChatInterface({
  messages,
  vehicle,
  onSendMessage,
  isLoading = false,
  isCallActive = false,
  onStartCall,
  onEndCall,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <Card className="h-full flex flex-col" data-testid="chat-interface">
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 space-y-0 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Customer Engagement Agent</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {isCallActive ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={onEndCall}
              data-testid="button-end-call"
            >
              <PhoneOff className="w-4 h-4 mr-1" />
              End Call
            </Button>
          ) : (
            <Button
              size="sm"
              variant="default"
              onClick={onStartCall}
              data-testid="button-start-call"
            >
              <Phone className="w-4 h-4 mr-1" />
              Start Call
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {vehicle && (
          <div className="p-3 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </p>
                <p className="text-xs text-muted-foreground">
                  Owner: {vehicle.ownerName} | {vehicle.ownerPhone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Health Score</p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    vehicle.healthScore >= 80
                      ? "text-green-500"
                      : vehicle.healthScore >= 60
                      ? "text-yellow-500"
                      : "text-red-500"
                  )}
                >
                  {vehicle.healthScore.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <Bot className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Ready to assist</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start a conversation with the customer
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                  data-testid={`chat-message-${message.id}`}
                >
                  {message.role !== "user" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        message.role === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-muted">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            data-testid="input-chat-message"
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
