"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  MessageCircle,
  Search,
  Flag,
  AlertTriangle,
  User,
  ChevronRight,
  X,
} from "lucide-react"
import { chatService } from "@/lib/services/chat.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ChatConversation, ChatMessage } from "@/types"

export default function ChatsPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)

  useEffect(() => {
    chatService.getConversations().then((data) => {
      setConversations(data)
      setLoading(false)
    })
  }, [])

  const handleSelectChat = async (chat: ChatConversation) => {
    setSelectedChat(chat)
    setLoadingMessages(true)
    const msgs = await chatService.getMessages(chat.id)
    setMessages(msgs)
    setLoadingMessages(false)
  }

  const handleSearch = async (query: string) => {
    setSearch(query)
    if (query.trim()) {
      const results = await chatService.searchConversations(query)
      setConversations(results)
    } else {
      const data = await chatService.getConversations()
      setConversations(data)
    }
  }

  const filtered = showFlaggedOnly ? conversations.filter((c) => c.is_flagged) : conversations
  const flaggedCount = conversations.filter((c) => c.is_flagged).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chat Monitor</h1>
          <p className="text-sm text-muted-foreground">
            Monitor conversations between users ({conversations.length} total)
          </p>
        </div>
        <Button
          variant={showFlaggedOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
          className="gap-2"
        >
          <Flag className="size-4" />
          Flagged ({flaggedCount})
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3" style={{ height: "calc(100vh - 260px)" }}>
        {/* Conversation List */}
        <Card className="flex min-h-0 flex-col overflow-hidden border-none shadow-sm lg:col-span-1">
          <CardHeader className="shrink-0 border-b px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="mb-1 h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))
                : filtered.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className={`flex items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                        selectedChat?.id === chat.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="size-10 border">
                          <AvatarImage src={chat.participants[0]?.image} />
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {chat.participants[0]?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {chat.is_flagged && (
                          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive">
                            <AlertTriangle className="size-2.5 text-destructive-foreground" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-foreground">
                            {chat.participants.map((p) => p.name.split(" ")[0]).join(" & ")}
                          </span>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {new Date(chat.last_message_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{chat.last_message}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-[9px]">{chat.message_count} msgs</Badge>
                          {chat.is_flagged && (
                            <Badge variant="destructive" className="text-[9px]">{chat.flag_reason}</Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <MessageCircle className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No conversations found</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Chat Messages Panel */}
        <Card className="flex min-h-0 flex-col overflow-hidden border-none shadow-sm lg:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader className="shrink-0 border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {selectedChat.participants.map((p) => (
                        <Avatar key={p.id} className="size-8 border-2 border-card">
                          <AvatarImage src={p.image} />
                          <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                            {p.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div>
                      <CardTitle className="text-sm">
                        {selectedChat.participants.map((p) => p.name).join(" & ")}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {selectedChat.participants.map((p) => p.profile_type).join(" & ")} | {selectedChat.message_count} messages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedChat.is_flagged && (
                      <Badge variant="destructive" className="gap-1 text-[10px]">
                        <Flag className="size-3" /> {selectedChat.flag_reason}
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon-sm" onClick={() => setSelectedChat(null)} className="lg:hidden">
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {loadingMessages ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                        <Skeleton className="h-12 w-64 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {messages.map((msg, i) => {
                      const isLeft = i % 2 === 0
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
                        >
                          <div className={`flex max-w-[75%] items-start gap-2 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                            <Avatar className="size-7 shrink-0 border">
                              <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                                <User className="size-3" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div
                                className={`rounded-2xl px-3.5 py-2.5 text-sm ${
                                  isLeft
                                    ? "rounded-tl-sm bg-muted text-foreground"
                                    : "rounded-tr-sm bg-primary text-primary-foreground"
                                } ${msg.is_flagged ? "ring-2 ring-destructive/50" : ""}`}
                              >
                                {msg.content}
                              </div>
                              <div className={`mt-1 flex items-center gap-1.5 ${isLeft ? "" : "justify-end"}`}>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                {msg.is_flagged && (
                                  <Badge variant="destructive" className="text-[8px] px-1 py-0">Flagged</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                <MessageCircle className="size-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Select a conversation</p>
                <p className="text-xs text-muted-foreground">Choose a conversation from the list to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  )
}
