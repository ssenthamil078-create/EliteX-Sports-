import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Award,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Upload,
  Fingerprint,
} from 'lucide-react'

import { certificateAPI } from '@/api/sportsAPI'
import { useAuthStore } from '@/store/authStore'
import { Card, PageHeader, Button, Input, Badge } from '@/components/ui'

export default function Certificates() {
  const userId = useAuthStore((s) => s.getUserId())
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    certificate_title: '',
    issued_by: '',
    issue_date: '',
    certificate_url: '',
  })

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['certificates', userId],
    queryFn: () => certificateAPI.getUserCertificates(userId).then((res) => res.data),
    enabled: !!userId,
  })

  const uploadMutation = useMutation({
    mutationFn: (payload) => certificateAPI.upload(payload),
    onSuccess: () => {
      toast.success('Certificate uploaded and verified')
      setForm({
        certificate_title: '',
        issued_by: '',
        issue_date: '',
        certificate_url: '',
      })
      queryClient.invalidateQueries({ queryKey: ['certificates', userId] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Certificate upload failed')
    },
  })

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const submit = (e) => {
    e.preventDefault()

    uploadMutation.mutate({
      user_id: userId,
      ...form,
    })
  }

  const certificates = data?.certificates || []

  return (
    <div>
      <PageHeader
        title="Certificates"
        subtitle="Upload, verify, and manage athlete certificates."
        action={
          <Button onClick={() => refetch()} loading={isFetching}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card hover={false}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary">
              <Upload className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Upload Certificate</h2>
              <p className="text-sm text-gray-400">
                Add verified achievements to your profile.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Certificate Title"
              name="certificate_title"
              value={form.certificate_title}
              onChange={handleChange}
              placeholder="District Athletics Winner"
              required
            />

            <Input
              label="Issued By"
              name="issued_by"
              value={form.issued_by}
              onChange={handleChange}
              placeholder="Sports Authority / School / College"
              required
            />

            <Input
              label="Issue Date"
              type="date"
              name="issue_date"
              value={form.issue_date}
              onChange={handleChange}
              required
            />

            <Input
              label="Certificate URL"
              name="certificate_url"
              value={form.certificate_url}
              onChange={handleChange}
              placeholder="https://..."
              required
            />

            <Button className="w-full" loading={uploadMutation.isPending}>
              <Award className="h-4 w-4" />
              Upload Certificate
            </Button>
          </form>
        </Card>

        <Card hover={false}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">My Certificates</h2>
              <p className="text-sm text-gray-400">
                Verified certificates attached to your athlete account.
              </p>
            </div>

            <Badge>{certificates.length} items</Badge>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-3xl bg-surface/70" />
              ))}
            </div>
          ) : certificates.length > 0 ? (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div
                  key={cert.certificate_id}
                  className="rounded-3xl border border-primary/20 bg-background/40 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="rounded-2xl bg-success/20 p-3 text-success">
                        <ShieldCheck className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-white">
                          {cert.certificate_title}
                        </h3>

                        <p className="text-sm text-gray-400">
                          Issued by {cert.issued_by}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Date: {cert.issue_date}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <Fingerprint className="h-4 w-4 text-primary" />
                          <span className="break-all">{cert.certificate_hash}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Badge variant="success">
                        {cert.verification_status}
                      </Badge>

                      {cert.certificate_url && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(cert.certificate_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center text-center">
              <Award className="mb-4 h-14 w-14 text-primary" />
              <h2 className="text-2xl font-black">No certificates yet</h2>
              <p className="mt-2 max-w-md text-gray-400">
                Upload certificates to improve your profile credibility for scholarships, scouts, and mentors.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}