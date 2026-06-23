import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { legalAPI } from '@/api'
import { Card, PageHeader } from '@/components/ui'

const apiMap = {
  terms: legalAPI.terms,
  privacy: legalAPI.privacy,
  cookies: legalAPI.cookies,
  disclaimer: legalAPI.disclaimer,
}

export default function LegalPage() {
  const { type = 'terms' } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['legal', type],
    queryFn: () => apiMap[type]().then((r) => r.data),
  })

  return (
    <div>
      <PageHeader
        title={data?.title || 'Legal Page'}
        subtitle={data?.last_updated ? `Last updated: ${data.last_updated}` : 'Platform policies and legal information'}
      />

      <Card hover={false}>
        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="space-y-6">
            {data?.introduction && <p className="text-gray-300">{data.introduction}</p>}

            {data?.sections?.map((section, idx) => (
              <section key={idx}>
                <h2 className="mb-2 text-xl font-bold text-white">{section.heading}</h2>
                <p className="leading-relaxed text-gray-400">{section.content}</p>
              </section>
            ))}

            {data?.cookie_categories?.map((cookie, idx) => (
              <section key={idx} className="rounded-2xl border border-primary/20 bg-background/50 p-4">
                <h2 className="mb-2 text-xl font-bold text-white">{cookie.type}</h2>
                <p className="text-gray-400">{cookie.purpose}</p>
              </section>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
