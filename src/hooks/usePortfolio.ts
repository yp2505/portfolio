'use client'

import { useEffect, useState } from 'react'
import {
  fetchCertificates,
  fetchProjects,
  fetchTechStacks,
  Project,
  Certificate,
  TechStack
} from '@/lib/portfolioService'

export default function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [techStacks, setTechStacks] = useState<TechStack[]>([])
  const [loading, setLoading] = useState(true)

  const loadPortfolio = async () => {
    let loadedProjects: Project[] = []

    try {
      const notionRes = await fetch('/api/notion')
      const notionData = await notionRes.json()
      if (notionData.success && notionData.projects?.length > 0) {
        loadedProjects = notionData.projects

      }
    } catch {
      // Fallback if notion fetch fails or env is not configured
    }

    if (loadedProjects.length === 0) {
      loadedProjects = await fetchProjects()
    }

    const [certificatesData, techStacksData] = await Promise.all([
      fetchCertificates(),
      fetchTechStacks(),
    ])

    setProjects(loadedProjects || [])
    setCertificates(certificatesData || [])
    setTechStacks(techStacksData || [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPortfolio()
  }, [])

  return {
    projects,
    certificates,
    techStacks,
    loading,
  }
}