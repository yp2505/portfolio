'use client'

import { useEffect, useState } from 'react'
import {
  fetchCertificates,
  fetchProjects,
  fetchTechStacks,
} from '@/lib/portfolioService'

export default function usePortfolio() {
  const [projects, setProjects] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [techStacks, setTechStacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    let loadedProjects: any[] = []

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

  return {
    projects,
    certificates,
    techStacks,
    loading,
  }
}