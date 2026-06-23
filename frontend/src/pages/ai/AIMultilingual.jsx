import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Languages,
  Send,
  Globe2,
  Sparkles,
  Copy,
  RefreshCw,
} from 'lucide-react'

import { aiAPI } from '@/api/sportsAPI'
import { Card, PageHeader, Button, Badge } from '@/components/ui'

const LANGUAGES = [
  // Indian Languages
  'Tamil',
  'Hindi',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Urdu',
  'Odia',
  'Assamese',
  'Sanskrit',
  'Konkani',
  'Manipuri',
  'Kashmiri',
  'Bhojpuri',
  'Rajasthani',
  'Tulu',

  // Global Languages
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Arabic',
  'Chinese',
  'Japanese',
  'Korean',
  'Turkish',
  'Dutch',
  'Greek',
  'Thai',
  'Vietnamese',
  'Indonesian',
  'Malay',
  'Swahili',
]

export default function AIMultilingual() {
  const [message, setMessage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('Tamil')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const translate = async (e) => {
    e.preventDefault()

    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setLoading(true)

    try {
      const res = await aiAPI.multilingualResponse({
        message,
        target_language: targetLanguage,
      })

      setResult(res.data.translated_response)
      toast.success(`Translated to ${targetLanguage}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Translation failed')
    } finally {
      setLoading(false)
    }
  }

  const copyResult = async () => {
    if (!result) return

    await navigator.clipboard.writeText(result)
    toast.success('Copied translation')
  }

  const clearAll = () => {
    setMessage('')
    setResult('')
    setTargetLanguage('Tamil')
  }

  return (
    <div>
      <PageHeader
        title="AI Multilingual Assistant"
        subtitle="Translate coaching, training, and sports guidance into many Indian and global languages."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <Languages className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Sports Translation AI</h2>
              <p className="text-sm text-gray-400">
                Convert sports guidance into your preferred language.
              </p>
            </div>
          </div>

          <form onSubmit={translate} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Message / Training Advice
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={7}
                placeholder="Example: Focus on warm-up, hydration, sprint drills and recovery after training..."
                className="input-field resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-300">
                  Target Language
                </span>

                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="input-field"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <Button type="submit" loading={loading} className="w-full">
                  <Send className="h-4 w-4" />
                  Translate
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6 rounded-3xl border border-primary/20 bg-background/40 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">Output</h3>
                <p className="text-sm text-gray-400">
                  Language: {targetLanguage}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={copyResult}>
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>

                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>

            {result ? (
              <p className="whitespace-pre-wrap text-lg leading-8 text-gray-100">
                {result}
              </p>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-primary/30 text-center text-gray-500">
                Translation will appear here
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card hover={false}>
            <div className="mb-4 flex items-center gap-3">
              <Globe2 className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black">Supported Languages</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {LANGUAGES.slice(0, 20).map((lang) => (
                <Badge key={lang}>{lang}</Badge>
              ))}
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Includes Indian regional languages and major global languages.
            </p>
          </Card>

          <Card hover={false}>
            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-warning" />
              <h2 className="text-xl font-black">Use Cases</h2>
            </div>

            <div className="space-y-3 text-sm text-gray-400">
              <p>• Translate coaching advice for athletes</p>
              <p>• Convert training plans into native language</p>
              <p>• Help regional athletes understand AI feedback</p>
              <p>• Make sports guidance accessible to everyone</p>
            </div>
          </Card>

          <Card hover={false}>
            <h2 className="mb-4 text-xl font-black">Quick Samples</h2>

            <div className="space-y-3">
              {[
                'Drink water before and after every training session.',
                'Focus on recovery if your fatigue level is high.',
                'Warm up for 10 minutes before intense exercise.',
                'Track your performance weekly to improve consistency.',
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setMessage(sample)}
                  className="block w-full rounded-2xl border border-primary/20 bg-background/50 p-3 text-left text-sm text-gray-400 transition hover:border-primary/50 hover:text-white"
                >
                  {sample}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}