export type MatchStatus = "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "CANCELLED"

export type MatchStage =
  | "GROUP_STAGE"
  | "LAST_32"
  | "LAST_16"
  | "QUARTER_FINALS"
  | "SEMI_FINALS"
  | "THIRD_PLACE"
  | "FINAL"

export interface Team {
  id: number | null
  name: string | null
  shortName: string | null
  tla: string | null
  crest: string | null
}

export interface Score {
  winner: string | null
  duration: string
  fullTime: { home: number | null; away: number | null }
  halfTime: { home: number | null; away: number | null }
}

export interface Match {
  id: number
  utcDate: string
  status: MatchStatus
  matchday: number | null
  stage: MatchStage
  group: string | null
  homeTeam: Team
  awayTeam: Team
  score: Score
  lastUpdated: string
}

export interface Competition {
  id: number
  name: string
  code: string
  emblem: string
}

export interface MatchesResponse {
  filters: { season: string }
  resultSet: {
    count: number
    first: string
    last: string
    played: number
  }
  competition: Competition
  matches: Match[]
}