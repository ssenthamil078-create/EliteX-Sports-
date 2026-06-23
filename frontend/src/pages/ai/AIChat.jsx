import { useState } from 'react'
import toast from 'react-hot-toast'
import { Bot, Send, Sparkles, UserRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { aiAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Button, Card, PageHeader, Badge } from '@/components/ui'

export default function AIChat() {
  const userId = useAuthStore((s) => s.getUserId())

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hi athlete! Ask me about training, recovery, competitions, performance, injury prevention, or career planning.',
    },
  ])

  const sendMessage = async (e) => {
    e.preventDefault()

    if (!message.trim()) return

    if (!userId) {
      toast.error('User ID missing. Login again.')
      return
    }

    const userMessage = message.trim()

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMessage,
      },
    ])

    setMessage('')
    setLoading(true)

    try {
      const res = await aiAPI.chat({
        user_id: userId,
        message: userMessage,
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: res.data.ai_response,
        },
      ])
    } catch (err) {
      toast.error(err.response?.data?.detail || 'AI chat failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Sports Assistant"
        subtitle="Ask your AI coach about performance, recovery, competitions, and training."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card hover={false} className="flex min-h-[650px] flex-col">
          <div className="mb-5 flex items-center justify-between border-b border-primary/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                <Bot className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black">AI Coach Chat</h2>
                <p className="text-sm text-gray-400">
                  Real-time sports guidance
                </p>
              </div>
            </div>

            <Badge variant="success">Online</Badge>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'ai' && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-7 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-accent text-white'
                        : 'border border-primary/20 bg-background/60 text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.role === 'user' && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                      <UserRound className="h-5 w-5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Bot className="h-5 w-5 text-primary" />
                AI is thinking...
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="mt-5 flex gap-3 border-t border-primary/20 pt-4"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your AI coach..."
              className="input-field"
            />

            <Button type="submit" loading={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card hover={false}>
            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-warning" />
              <h2 className="text-xl font-black">Ask About</h2>
            </div>

            <div className="space-y-3">
              <Badge>Training Plan</Badge>
              <Badge>Recovery</Badge>
              <Badge>Performance</Badge>
              <Badge>Injury Prevention</Badge>
              <Badge>Career Path</Badge>
              <Badge>Competitions</Badge>
            </div>
          </Card>

          <Card hover={false}>
            <h2 className="mb-4 text-xl font-black">Sample Prompts</h2>

            <div className="space-y-3 text-sm text-gray-400">
              {[
                'How can I improve my endurance?',
                'What should I do after high fatigue?',
                'Suggest a weekly training plan.',
                'How to avoid injury during training?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setMessage(prompt)}
                  className="block w-full rounded-2xl border border-primary/20 bg-background/50 p-3 text-left transition hover:border-primary/50 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}