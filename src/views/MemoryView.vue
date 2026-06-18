<script setup lang="ts">
import { computed, ref } from 'vue'
import { addScore } from '@/lib/storage'

type Card = {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

const values = ['A', 'B', 'C', 'D', 'E', 'F']
const moves = ref(0)
const elapsedSeconds = ref(0)
const timer = ref<number | null>(null)
const lockBoard = ref(false)
const firstCard = ref<Card | null>(null)
const cards = ref<Card[]>(createDeck())

const matchedCount = computed(() => cards.value.filter((card) => card.isMatched).length)
const isComplete = computed(() => matchedCount.value === cards.value.length)

function createDeck() {
  return [...values, ...values]
    .map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5)
}

function startTimer() {
  if (timer.value !== null) return

  timer.value = window.setInterval(() => {
    elapsedSeconds.value += 1
  }, 1000)
}

function stopTimer() {
  if (timer.value === null) return

  window.clearInterval(timer.value)
  timer.value = null
}

function scoreGame() {
  stopTimer()
  const points = Math.max(25, 240 - moves.value * 8 - elapsedSeconds.value)

  addScore({
    gameId: 'memory',
    gameName: 'Memória',
    result: 'completed',
    points,
    detail: `${moves.value} jogadas em ${elapsedSeconds.value}s`,
  })
}

function flipCard(card: Card) {
  if (lockBoard.value || card.isFlipped || card.isMatched || isComplete.value) return

  startTimer()
  card.isFlipped = true

  if (!firstCard.value) {
    firstCard.value = card
    return
  }

  moves.value += 1
  const previousCard = firstCard.value
  firstCard.value = null

  if (previousCard.value === card.value) {
    previousCard.isMatched = true
    card.isMatched = true
    if (cards.value.every((entry) => entry.isMatched)) scoreGame()
    return
  }

  lockBoard.value = true
  window.setTimeout(() => {
    previousCard.isFlipped = false
    card.isFlipped = false
    lockBoard.value = false
  }, 700)
}

function resetGame() {
  stopTimer()
  moves.value = 0
  elapsedSeconds.value = 0
  lockBoard.value = false
  firstCard.value = null
  cards.value = createDeck()
}
</script>

<template>
  <section class="memory-view">
    <div class="game-panel" :class="{ 'is-winner': isComplete }">
      <div class="game-header">
        <div>
          <p class="eyebrow">Encontra os pares</p>
          <h2>{{ isComplete ? 'Completo' : ' ' }}</h2>
        </div>
        <button class="secondary-button" type="button" @click="resetGame">Reset</button>
      </div>

      <div class="stat-row">
        <span>{{ moves }} jogadas</span>
        <span>{{ elapsedSeconds }}s</span>
        <span>{{ matchedCount / 2 }} / {{ cards.length / 2 }} pares</span>
      </div>

      <div class="card-grid" aria-label="Memory cards">
        <button
          v-for="card in cards"
          :key="card.id"
          class="memory-card"
          :class="{ flipped: card.isFlipped || card.isMatched, matched: card.isMatched }"
          type="button"
          @click="flipCard(card)"
        >
          <span>{{ card.isFlipped || card.isMatched ? card.value : '?' }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.memory-view {
  display: grid;
  place-items: center;
  padding: 12px;
}

.game-panel {
  display: grid;
  width: min(100%, 760px);
  gap: 18px;
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

.game-header,
.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

.stat-row {
  flex-wrap: wrap;
}

.stat-row span {
  min-height: 36px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.74);
  font-weight: 700;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.memory-card {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(2rem, 10vw, 4rem);
  font-weight: 900;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.memory-card.flipped {
  border-color: rgba(255, 71, 71, 0.58);
  background: rgba(255, 71, 71, 0.16);
  color: #fff;
  transform: rotateY(180deg);
}

.memory-card.flipped span {
  transform: rotateY(180deg);
}

.memory-card.matched {
  border-color: rgba(122, 199, 76, 0.68);
  background: rgba(122, 199, 76, 0.14);
}

@media (max-width: 620px) {
  .game-panel {
    padding: 16px;
  }

  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
