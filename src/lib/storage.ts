import type { PlayerProfile, ScoreEntry } from '@/types/games'

const profileKey = 'games-hub:player-profile'
const scoresKey = 'games-hub:scores'

const hasStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

export function readPlayerProfile(): PlayerProfile | null {
  if (!hasStorage()) return null

  const rawProfile = window.localStorage.getItem(profileKey)
  if (!rawProfile) return null

  try {
    const profile = JSON.parse(rawProfile) as PlayerProfile
    if (!profile.name) return null
    /* if (!profile.name || !profile.dateOfBirth) return null */
    return profile
  } catch {
    return null
  }
}

export function savePlayerProfile(profile: Omit<PlayerProfile, 'createdAt'>): PlayerProfile {
  const nextProfile = {
    ...profile,
    createdAt: new Date().toISOString(),
  }

  if (hasStorage()) {
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile))
  }

  return nextProfile
}

export function clearPlayerProfile() {
  if (hasStorage()) {
    window.localStorage.removeItem(profileKey)
  }
}

export function readScores(): ScoreEntry[] {
  if (!hasStorage()) return []

  const rawScores = window.localStorage.getItem(scoresKey)
  if (!rawScores) return []

  try {
    return JSON.parse(rawScores) as ScoreEntry[]
  } catch {
    return []
  }
}

export function addScore(score: Omit<ScoreEntry, 'id' | 'playedAt' | 'playerName'>): ScoreEntry {
  const profile = readPlayerProfile()
  const entry: ScoreEntry = {
    ...score,
    id: window.crypto?.randomUUID?.() ?? String(Date.now()),
    playedAt: new Date().toISOString(),
    playerName: profile?.name ?? 'Player',
  }
  const nextScores = [entry, ...readScores()].slice(0, 50)

  if (hasStorage()) {
    window.localStorage.setItem(scoresKey, JSON.stringify(nextScores))
  }

  return entry
}

export function clearScores() {
  if (hasStorage()) {
    window.localStorage.removeItem(scoresKey)
  }
}
