import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Trophy,
  GraduationCap,
  RefreshCw,
} from 'lucide-react'

import { adminOpportunityAPI } from '@/api/sportsAPI'
import { Card, PageHeader, Button, Input, Badge } from '@/components/ui'
import { SkeletonGrid } from '@/components/ui/Skeleton'

const emptyCompetition = {
  name: '',
  sport: '',
  level: '',
  venue: '',
  date: '',
  registration_fee: '',
  age_category: '',
  eligibility: '',
  organizer: '',
  application_link: '',
}

const emptyScholarship = {
  name: '',
  provider: '',
  amount: '',
  sport_eligibility: '',
  age_category: '',
  eligibility_criteria: '',
  application_link: '',
  deadline: '',
}

export default function AdminOpportunities() {
  const qc = useQueryClient()
  const [tab, setTab] = useState('competitions')
  const [editingId, setEditingId] = useState(null)
  const [competitionForm, setCompetitionForm] = useState(emptyCompetition)
  const [scholarshipForm, setScholarshipForm] = useState(emptyScholarship)

  const competitionsQuery = useQuery({
    queryKey: ['admin-competitions'],
    queryFn: () => adminOpportunityAPI.getCompetitions().then((res) => res.data),
  })

  const scholarshipsQuery = useQuery({
    queryKey: ['admin-scholarships'],
    queryFn: () => adminOpportunityAPI.getScholarships().then((res) => res.data),
  })

  const createCompetition = useMutation({
    mutationFn: adminOpportunityAPI.createCompetition,
    onSuccess: () => {
      toast.success('Competition added')
      setCompetitionForm(emptyCompetition)
      qc.invalidateQueries({ queryKey: ['admin-competitions'] })
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to add competition'),
  })

  const updateCompetition = useMutation({
    mutationFn: ({ id, payload }) => adminOpportunityAPI.updateCompetition(id, payload),
    onSuccess: () => {
      toast.success('Competition updated')
      setEditingId(null)
      setCompetitionForm(emptyCompetition)
      qc.invalidateQueries({ queryKey: ['admin-competitions'] })
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to update competition'),
  })

  const deleteCompetition = useMutation({
    mutationFn: adminOpportunityAPI.deleteCompetition,
    onSuccess: () => {
      toast.success('Competition deleted')
      qc.invalidateQueries({ queryKey: ['admin-competitions'] })
    },
  })

  const createScholarship = useMutation({
    mutationFn: adminOpportunityAPI.createScholarship,
    onSuccess: () => {
      toast.success('Scholarship added')
      setScholarshipForm(emptyScholarship)
      qc.invalidateQueries({ queryKey: ['admin-scholarships'] })
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to add scholarship'),
  })

  const updateScholarship = useMutation({
    mutationFn: ({ id, payload }) => adminOpportunityAPI.updateScholarship(id, payload),
    onSuccess: () => {
      toast.success('Scholarship updated')
      setEditingId(null)
      setScholarshipForm(emptyScholarship)
      qc.invalidateQueries({ queryKey: ['admin-scholarships'] })
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to update scholarship'),
  })

  const deleteScholarship = useMutation({
    mutationFn: adminOpportunityAPI.deleteScholarship,
    onSuccess: () => {
      toast.success('Scholarship deleted')
      qc.invalidateQueries({ queryKey: ['admin-scholarships'] })
    },
  })

  const isCompetition = tab === 'competitions'
  const competitions = competitionsQuery.data?.competitions || []
  const scholarships = scholarshipsQuery.data?.scholarships || []

  const submitCompetition = (e) => {
    e.preventDefault()

    if (editingId) {
      updateCompetition.mutate({ id: editingId, payload: competitionForm })
    } else {
      createCompetition.mutate(competitionForm)
    }
  }

  const submitScholarship = (e) => {
    e.preventDefault()

    if (editingId) {
      updateScholarship.mutate({ id: editingId, payload: scholarshipForm })
    } else {
      createScholarship.mutate(scholarshipForm)
    }
  }

  const editCompetition = (item) => {
    setEditingId(item.id)
    setCompetitionForm({
      name: item.name || '',
      sport: item.sport || '',
      level: item.level || '',
      venue: item.venue || '',
      date: item.date || '',
      registration_fee: item.registration_fee || '',
      age_category: item.age_category || '',
      eligibility: item.eligibility || '',
      organizer: item.organizer || '',
      application_link: item.application_link || '',
    })
    setTab('competitions')
  }

  const editScholarship = (item) => {
    setEditingId(item.id)
    setScholarshipForm({
      name: item.name || '',
      provider: item.provider || '',
      amount: item.amount || '',
      sport_eligibility: item.sport_eligibility || '',
      age_category: item.age_category || '',
      eligibility_criteria: item.eligibility_criteria || '',
      application_link: item.application_link || '',
      deadline: item.deadline || '',
    })
    setTab('scholarships')
  }

  const resetForm = () => {
    setEditingId(null)
    setCompetitionForm(emptyCompetition)
    setScholarshipForm(emptyScholarship)
  }

  return (
    <div>
      <PageHeader
        title="Admin Opportunities Manager"
        subtitle="Manually add, edit and delete competitions and scholarships."
        action={
          <Button
            onClick={() => {
              competitionsQuery.refetch()
              scholarshipsQuery.refetch()
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => {
            setTab('competitions')
            resetForm()
          }}
          className={`rounded-2xl border px-5 py-3 font-bold ${
            isCompetition
              ? 'border-primary bg-primary/20 text-white shadow-neon'
              : 'border-primary/20 text-gray-400'
          }`}
        >
          <Trophy className="mr-2 inline h-4 w-4" />
          Competitions
        </button>

        <button
          onClick={() => {
            setTab('scholarships')
            resetForm()
          }}
          className={`rounded-2xl border px-5 py-3 font-bold ${
            !isCompetition
              ? 'border-primary bg-primary/20 text-white shadow-neon'
              : 'border-primary/20 text-gray-400'
          }`}
        >
          <GraduationCap className="mr-2 inline h-4 w-4" />
          Scholarships
        </button>
      </div>

      <div className="responsive-page-grid">
        <Card hover={false}>
          <h2 className="mb-5 text-2xl font-black">
            {editingId ? 'Edit' : 'Add'} {isCompetition ? 'Competition' : 'Scholarship'}
          </h2>

          {isCompetition ? (
            <CompetitionForm
              form={competitionForm}
              setForm={setCompetitionForm}
              onSubmit={submitCompetition}
              loading={createCompetition.isPending || updateCompetition.isPending}
              editing={!!editingId}
              reset={resetForm}
            />
          ) : (
            <ScholarshipForm
              form={scholarshipForm}
              setForm={setScholarshipForm}
              onSubmit={submitScholarship}
              loading={createScholarship.isPending || updateScholarship.isPending}
              editing={!!editingId}
              reset={resetForm}
            />
          )}
        </Card>

        <Card hover={false}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">
              {isCompetition ? 'Competitions' : 'Scholarships'}
            </h2>
            <Badge>{isCompetition ? competitions.length : scholarships.length} items</Badge>
          </div>
        {competitionsQuery.isLoading || scholarshipsQuery.isLoading ? (
            <SkeletonGrid count={6} />
        ) : (

          <div className="space-y-4">
            {isCompetition
              ? competitions.map((item) => (
                  <ItemCard
                    key={item.id}
                    title={item.name}
                    subtitle={`${item.sport} • ${item.level} • ${item.date}`}
                    status={item.status}
                    onEdit={() => editCompetition(item)}
                    onDelete={() => {
                      if (confirm('Delete this competition?')) {
                        deleteCompetition.mutate(item.id)
                      }
                    }}
                  />
                ))
              : scholarships.map((item) => (
                  <ItemCard
                    key={item.id}
                    title={item.name}
                    subtitle={`${item.provider} • ${item.amount} • ${item.deadline}`}
                    status={item.status}
                    onEdit={() => editScholarship(item)}
                    onDelete={() => {
                      if (confirm('Delete this scholarship?')) {
                        deleteScholarship.mutate(item.id)
                      }
                    }}
                  />
                ))}
          </div>
        )}
        </Card>
      </div>
    </div>
  )
}

function CompetitionForm({ form, setForm, onSubmit, loading, editing, reset }) {
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
      <Input label="Sport" value={form.sport} onChange={(e) => update('sport', e.target.value)} required />
      <Input label="Level" value={form.level} onChange={(e) => update('level', e.target.value)} required />
      <Input label="Venue" value={form.venue} onChange={(e) => update('venue', e.target.value)} required />
      <Input label="Date" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
      <Input label="Registration Fee" value={form.registration_fee} onChange={(e) => update('registration_fee', e.target.value)} required />
      <Input label="Age Category" value={form.age_category} onChange={(e) => update('age_category', e.target.value)} required />
      <Input label="Eligibility" value={form.eligibility} onChange={(e) => update('eligibility', e.target.value)} required />
      <Input label="Organizer" value={form.organizer} onChange={(e) => update('organizer', e.target.value)} required />
      <Input label="Application Link" value={form.application_link} onChange={(e) => update('application_link', e.target.value)} required />

      <div className="flex gap-3">
        <Button className="flex-1" loading={loading}>
          {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editing ? 'Update' : 'Add'}
        </Button>

        {editing && (
          <Button type="button" variant="secondary" onClick={reset}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

function ScholarshipForm({ form, setForm, onSubmit, loading, editing, reset }) {
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
      <Input label="Provider" value={form.provider} onChange={(e) => update('provider', e.target.value)} required />
      <Input label="Amount" value={form.amount} onChange={(e) => update('amount', e.target.value)} required />
      <Input label="Sport Eligibility" value={form.sport_eligibility} onChange={(e) => update('sport_eligibility', e.target.value)} required />
      <Input label="Age Category" value={form.age_category} onChange={(e) => update('age_category', e.target.value)} required />
      <Input label="Eligibility Criteria" value={form.eligibility_criteria} onChange={(e) => update('eligibility_criteria', e.target.value)} required />
      <Input label="Application Link" value={form.application_link} onChange={(e) => update('application_link', e.target.value)} required />
      <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} required />

      <div className="flex gap-3">
        <Button className="flex-1" loading={loading}>
          {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editing ? 'Update' : 'Add'}
        </Button>

        {editing && (
          <Button type="button" variant="secondary" onClick={reset}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

function ItemCard({ title, subtitle, status, onEdit, onDelete }) {
  return (
    <div className="rounded-3xl border border-primary/20 bg-background/40 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-black text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          <Badge className="mt-3" variant={status === 'Finished' ? 'danger' : 'success'}>
            {status}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={onEdit}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>

          <Button size="sm" variant="danger" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}