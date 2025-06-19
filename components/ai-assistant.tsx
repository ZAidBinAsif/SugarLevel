"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your blood sugar assistant. I can help answer questions about your readings, suggest meal ideas, or provide general diabetes management tips. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simple AI responses (in a real app, this would connect to an AI service)
    setTimeout(() => {
      let response = "I understand your question. "

      if (input.toLowerCase().includes("high") || input.toLowerCase().includes("spike")) {
        response =
          "High blood sugar can be caused by various factors like meals high in carbs, stress, illness, or missed medications. Try drinking water, taking a short walk, and monitor closely. If consistently high, contact your healthcare provider."
      } else if (input.toLowerCase().includes("low")) {
        response =
          "For low blood sugar, immediately consume 15g of fast-acting carbs like glucose tablets, juice, or candy. Wait 15 minutes and retest. If still low, repeat treatment and consider calling your doctor."
      } else if (input.toLowerCase().includes("food") || input.toLowerCase().includes("eat")) {
        response =
          "For stable blood sugar, focus on balanced meals with lean protein, non-starchy vegetables, and complex carbs. Avoid sugary drinks and processed foods. Consider portion control and eating at regular times."
      } else if (input.toLowerCase().includes("exercise")) {
        response =
          "Exercise can help lower blood sugar! Start with light activities like walking. Check your blood sugar before and after exercise. If taking insulin, you may need to adjust doses - consult your doctor first."
      } else {
        response =
          "That's a great question! For specific medical advice, always consult with your healthcare provider. I can help with general information about blood sugar management, meal planning, and lifestyle tips."
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)

    setInput("")
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span>AI Assistant</span>
        </CardTitle>
        <CardDescription>Ask questions about blood sugar management</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-3">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "assistant" && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
                {message.type === "user" && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about blood sugar, food, exercise..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
