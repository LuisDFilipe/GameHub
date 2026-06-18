export type PlayerProfile = {
  name: string
  dateOfBirth: string
  createdAt: string
}

export type GameId = 'tic-tac-toe' | 'memory'

export type ScoreResult = 'win' | 'loss' | 'draw' | 'completed'

export type ScoreEntry = {
  id: string
  gameId: GameId
  gameName: string
  result: ScoreResult
  points: number
  detail: string
  playedAt: string
  playerName: string
}
