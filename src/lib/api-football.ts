import { MatchesResponse, Match } from "@/types/football"

const BASE_URL = "https://api.football-data.org/v4"

async function fetchFootball<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN!,
    },
    next: { revalidate: 60 }, // caché de 60 segundos
  })

  if (!res.ok) {
    throw new Error(`Football API error: ${res.status}`)
  }

  return res.json()
}

export async function getAllMatches(): Promise<MatchesResponse> {
  return fetchFootball<MatchesResponse>("/competitions/WC/matches")
}

export async function getTodayMatches(): Promise<Match[]> {
  const today = new Date().toISOString().split("T")[0]
  const data = await fetchFootball<MatchesResponse>(
    `/competitions/WC/matches?dateFrom=${today}&dateTo=${today}`
  )
  return data.matches
}

export async function getMatchesByGroup(group: string): Promise<Match[]> {
  const data = await getAllMatches()
  return data.matches.filter((m) => m.group === `GROUP_${group}`)
}

export async function getLiveMatches(): Promise<Match[]> {
  const data = await fetchFootball<MatchesResponse>(
    "/competitions/WC/matches?status=IN_PLAY"
  )
  return data.matches
}

export async function getMexicoMatches(): Promise<Match[]> {
  const data = await getAllMatches()
  return data.matches.filter(
    (m) => m.homeTeam.name === "Mexico" || m.awayTeam.name === "Mexico"
  )
}