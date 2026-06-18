<script setup lang="ts">
import { computed, ref } from 'vue'
import { clearScores, readScores } from '@/lib/storage'

const scores = ref(readScores())

const totalPoints = computed(() => scores.value.reduce((sum, score) => sum + score.points, 0))
const bestScore = computed(() => Math.max(0, ...scores.value.map((score) => score.points)))

const clearHistory = () => {
  clearScores()
  scores.value = []
}
</script>

<template>
  <section class="scores-view">
    <div class="summary-grid">
      <article class="summary-card">
        <p class="summary-label">Games played</p>
        <p class="summary-value">{{ scores.length }}</p>
      </article>
      <article class="summary-card">
        <p class="summary-label">Total points</p>
        <p class="summary-value">{{ totalPoints }}</p>
      </article>
      <article class="summary-card">
        <p class="summary-label">Best score</p>
        <p class="summary-value">{{ bestScore }}</p>
      </article>
    </div>

    <section class="panel">
      <div class="panel-header">
        <h2>Recent results</h2>
        <button v-if="scores.length" class="secondary-button" type="button" @click="clearHistory">
          Clear
        </button>
      </div>

      <p v-if="!scores.length" class="empty-state">No scores yet.</p>

      <div v-else class="score-list">
        <article v-for="score in scores" :key="score.id" class="score-row">
          <div>
            <strong>{{ score.gameName }}</strong>
            <p>{{ score.detail }}</p>
          </div>
          <div class="score-meta">
            <span>{{ score.points }} pts</span>
            <time :datetime="score.playedAt">
              {{ new Date(score.playedAt).toLocaleDateString() }}
            </time>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.scores-view {
  display: grid;
  gap: 18px;
  padding: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.summary-card,
.panel {
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(14, 14, 14, 0.92);
}

.summary-label {
  color: rgba(255, 255, 255, 0.58);
}

.summary-value {
  margin-top: 8px;
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
}

.panel-header,
.score-row,
.score-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-header,
.score-row {
  justify-content: space-between;
}

.panel-header {
  margin-bottom: 16px;
}

.panel-header h2 {
  font-size: 1.2rem;
  font-weight: 800;
}

.empty-state,
.score-row p,
.score-meta time {
  color: rgba(255, 255, 255, 0.66);
}

.score-list {
  display: grid;
  gap: 10px;
}

.score-row {
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.score-row strong,
.score-meta span {
  font-weight: 800;
}

.score-meta {
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
}

@media (max-width: 720px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .score-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .score-meta {
    align-items: flex-start;
  }
}
</style>
