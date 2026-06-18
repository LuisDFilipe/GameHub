<script setup lang="ts">
import { computed, ref } from 'vue'
import { addScore } from '@/lib/storage'

type Cell = 'X' | 'O' | ''

const winningLines: Array<[number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const board = ref<Cell[]>(Array<Cell>(9).fill(''))
const status = ref('Sua vez')
const gameOver = ref(false)
const isCpuThinking = ref(false)

const winner = computed(() => getWinner(board.value))
const availableCells = computed(() =>
  board.value.map((cell, index) => (cell === '' ? index : -1)).filter((index) => index >= 0),
)

function getWinner(cells: Cell[]) {
  for (const line of winningLines) {
    const [a, b, c] = line
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a]
    }
  }

  return ''
}

function findMove(mark: Cell) {
  for (const index of availableCells.value) {
    const trialBoard = [...board.value]
    trialBoard[index] = mark
    if (getWinner(trialBoard) === mark) return index
  }

  return -1
}

function chooseCpuMove(): number {
  const winningMove = findMove('O')
  if (winningMove >= 0) return winningMove

  const blockingMove = findMove('X')
  if (blockingMove >= 0) return blockingMove

  if (board.value[4] === '') return 4

  const corners = [0, 2, 6, 8].filter((index) => board.value[index] === '')
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)]!

  const cells = availableCells.value
  if (!cells.length) return -1

  return cells[Math.floor(Math.random() * cells.length)]!
}

function finishGame(result: 'win' | 'loss' | 'draw') {
  gameOver.value = true
  const points = result === 'win' ? 100 : result === 'draw' ? 35 : 10

  addScore({
    gameId: 'tic-tac-toe',
    gameName: 'Jogo do Galo',
    result,
    points,
    detail:
      result === 'win'
        ? 'Derrotou o Computador'
        : result === 'draw'
          ? 'Empate forçado'
          : 'O Computador ganhou a ronda',
  })
}

function checkState() {
  const currentWinner = winner.value

  if (currentWinner === 'X') {
    status.value = 'Ganhou'
    finishGame('win')
    return true
  }

  if (currentWinner === 'O') {
    status.value = 'Perdeu'
    finishGame('loss')
    return true
  }

  if (!availableCells.value.length) {
    status.value = 'Empate'
    finishGame('draw')
    return true
  }

  return false
}

function play(index: number) {  
  if (gameOver.value || isCpuThinking.value || board.value[index] !== '') return

  board.value[index] = 'X'
  if (checkState()) return

  status.value = 'A pensar...'
  isCpuThinking.value = true

  window.setTimeout(() => {
    const cpuMove = chooseCpuMove()
    if (cpuMove >= 0) board.value[cpuMove] = 'O'
    isCpuThinking.value = false
    if (!checkState()) status.value = 'Sua vez'
  }, 500 + Math.random() * 1000)
}

function resetGame() {
  board.value = Array<Cell>(9).fill('')
  status.value = 'Sua vez'
  gameOver.value = false
  isCpuThinking.value = false
}
</script>

<template>
  <section class="game-view">
    <div class="game-panel" :class="{ 'is-winner': winner === 'X' }">
      <div class="game-header">
        <div>
          <p class="eyebrow">X contra O</p>
          <h2>{{ status }}</h2>
        </div>
        <button class="secondary-button" type="button" @click="resetGame">Reset</button>
      </div>

      <div class="board" aria-label="Tic-Tac-Toe board">
        <button
          v-for="cell, index in board"
          :key="index"
          class="cell"
          type="button"
          :disabled="cell !== '' || gameOver || isCpuThinking"
          @click="play(index)"
        >
          {{ cell }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.game-view {
  display: grid;
  place-items: center;
  padding: 12px;
}

.game-panel {
  display: grid;
  width: min(100%, 620px);
  gap: 22px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(255, 71, 71, 0.18), transparent 30%),
    rgba(14, 14, 14, 0.92);
}

.game-panel.is-winner {
  background:
    radial-gradient(circle at top right, rgba(122, 199, 76, 0.16), transparent 30%),
    radial-gradient(circle at bottom left, rgba(122, 199, 76, 0.16), transparent 30%),
    radial-gradient(circle at top left, rgba(122, 199, 76, 0.16), transparent 30%),
    radial-gradient(circle at bottom right, rgba(122, 199, 76, 0.16), transparent 30%),
    rgba(14, 14, 14, 0.92);
}

.game-panel.is-winner .eyebrow {
  color: #c7f0b2;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.eyebrow {
  color: #ffb0b0;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

h2 {
  margin-top: 6px;
  font-size: clamp(1.8rem, 4vw, 2.7rem);
  font-weight: 900;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr); /* Add this line */
  gap: 10px;
  aspect-ratio: 1;
}

.cell {
  display: grid;
  place-items: center;
  min-width: 0;
  height: 100%; /* Force the grid child to fill its allocated space completely */
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: clamp(2.5rem, 15vw, 5rem);
  font-weight: 900;
  line-height: 1; /* Fixes vertical text bounds shifting */
}

.cell:disabled {
  cursor: default;
}

.cell:not(:disabled):hover {
  border-color: rgba(255, 71, 71, 0.7);
  background: rgba(255, 71, 71, 0.14);
}

@media (max-width: 560px) {
  .game-panel {
    padding: 16px;
  }
}
</style>
