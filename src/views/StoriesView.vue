<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layout/AppLayout.vue'
import { getStories, updateStory, type Story, type UpdateStoryPayload } from '../api/stories'

const stories = ref<Story[]>([])
const isLoading = ref(true)
const loadError = ref('')
const selectedStory = ref<Story | null>(null)
const editingStory = ref<UpdateStoryPayload | null>(null)
const isSaving = ref(false)
function openStory(story: Story) {
  selectedStory.value = story
  editingStory.value = null
}

function closeStory() {
  if (isSaving.value) return
  selectedStory.value = null
  editingStory.value = null
}

function startEditing() {
  if (!selectedStory.value) return

  editingStory.value = {
    id: selectedStory.value.id,
    title: selectedStory.value.title,
    mystery: selectedStory.value.mystery,
    solution: selectedStory.value.solution,
    hint: selectedStory.value.hint ?? '',
    is_published: selectedStory.value.is_published,
  }
}

function cancelEditing() {
  editingStory.value = null
}

async function saveStory() {
  if (!editingStory.value || isSaving.value) return

  isSaving.value = true

  try {
    const payload = {
      ...editingStory.value,
      title: editingStory.value.title.trim(),
      mystery: editingStory.value.mystery.trim(),
      solution: editingStory.value.solution.trim(),
      hint: editingStory.value.hint.trim(),
    }
    await updateStory(payload)
    await loadStories()
    selectedStory.value = stories.value.find((story) => story.id === payload.id) ?? null
    editingStory.value = null

    await Swal.fire({
      title: '故事已更新',
      text: '故事內容與公開狀態已儲存。',
      icon: 'success',
      confirmButtonText: '完成',
      confirmButtonColor: 'var(--color-ink)',
    })
  } catch {
    await Swal.fire({
      title: '更新失敗',
      text: '請確認內容後再試一次。',
      icon: 'error',
      confirmButtonText: '知道了',
      confirmButtonColor: 'var(--color-coral)',
    })
  } finally {
    isSaving.value = false
  }
}

async function togglePublished(story: Story) {
  if (isSaving.value) return

  isSaving.value = true
  try {
    await updateStory({
      id: story.id,
      title: story.title,
      mystery: story.mystery,
      solution: story.solution,
      hint: story.hint ?? '',
      is_published: !story.is_published,
    })
    story.is_published = !story.is_published
  } catch {
    await Swal.fire({
      title: '狀態更新失敗',
      text: '請稍後再試一次。',
      icon: 'error',
      confirmButtonText: '知道了',
      confirmButtonColor: 'var(--color-coral)',
    })
  } finally {
    isSaving.value = false
  }
}

function flattenStories(response: Record<string, Story[]>) {
  return Object.values(response).flatMap((value) => Array.isArray(value) ? value : [])
}

async function loadStories() {
  isLoading.value = true
  loadError.value = ''

  try {
    stories.value = flattenStories(await getStories())
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '故事載入失敗'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadStories)
</script>

<template>
  <AppLayout>
    <div class="mx-auto max-w-297.5 px-4 py-7.25 md:px-[5.5%] md:py-13.75">
      <section class="mb-6.25 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="m-0 text-[10px] tracking-wider text-eyebrow">故事圖書館</p>
          <h1 class="my-3.25 mb-1.75 font-serif text-4xl font-normal tracking-tight text-ink md:text-5xl">探索所有故事</h1>
          <p class="m-0 text-xs text-muted">看看其他玩家留下的湯面，找一個想親自解開的謎。</p>
        </div>
        <RouterLink class="rounded bg-ink px-4 py-3 text-center text-xs font-medium text-cream transition-colors hover:bg-sage" to="/stories/new">＋ 新增故事</RouterLink>
      </section>

      <div v-if="isLoading" class="rounded-lg border border-line bg-paper p-10 text-center text-xs text-muted">正在翻閱故事...</div>

      <section v-else-if="loadError" class="rounded-lg border border-line bg-paper p-8 text-center">
        <p class="m-0 text-sm text-ink">故事暫時無法載入</p>
        <p class="mt-2 text-xs text-muted">{{ loadError }}</p>
        <button class="mt-5 rounded bg-ink px-4 py-2.5 text-xs text-cream transition-colors hover:bg-sage" type="button" @click="loadStories">重新載入</button>
      </section>

      <section v-else-if="stories.length === 0" class="rounded-lg border border-dashed border-line bg-paper p-10 text-center">
        <div class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-case-bg text-2xl text-sage-dark">♨</div>
        <h2 class="mt-4 font-serif text-xl font-normal text-ink">還沒有故事</h2>
        <p class="mt-2 text-xs text-muted">成為第一個寫下謎題的人吧。</p>
        <RouterLink class="mt-5 inline-block rounded bg-coral px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-ink" to="/stories/new">建立第一個故事</RouterLink>
      </section>

      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="story in stories" :key="story.id" class="flex flex-col rounded-lg border border-line bg-paper p-5 transition-shadow hover:shadow-[0_12px_30px_rgba(38,61,56,0.1)]">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="m-0 text-[9px] tracking-widest text-eyebrow">故事 #{{ story.id.slice(0, 8) }}</p>
              <h2 class="mt-2 font-serif text-xl font-normal text-ink">{{ story.title }}</h2>
            </div>
            <span :class="['shrink-0 rounded-full px-2 py-1 text-[9px] font-medium', story.is_published ? 'bg-sage/20 text-sage-dark' : 'bg-gold/25 text-text-warm']">
              {{ story.is_published ? '已公開' : '草稿' }}
            </span>
          </div>

          <div class="mt-5 space-y-4 text-xs leading-6 text-case-text">
            <div>
              <p class="m-0 text-[9px] tracking-widest text-text-faint">湯面</p>
              <p class="mt-1 line-clamp-3">{{ story.mystery }}</p>
            </div>
            <div class="rounded border border-dashed border-line bg-shell px-3 py-2.5 text-[11px] text-muted">
              湯底已隱藏，點開詳細內容查看
            </div>
          </div>

          <div class="mt-auto border-t border-line-soft pt-4">
            <p class="m-0 text-[9px] tracking-widest text-text-faint">提示</p>
            <p class="mt-1 line-clamp-2 text-xs leading-5 text-muted">{{ story.hint || '尚未提供提示' }}</p>
            <div class="mt-4 flex items-center gap-2">
              <button class="flex-1 rounded bg-ink px-3 py-2.5 text-[11px] font-medium text-cream transition-colors hover:bg-sage" type="button" @click="openStory(story)">查看詳細</button>
              <button
                class="rounded border border-border px-3 py-2.5 text-[11px] text-text-warm transition-colors hover:border-coral disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                :disabled="isSaving"
                @click="togglePublished(story)"
              >
                {{ story.is_published ? '改為不公開' : '公開故事' }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="selectedStory" class="fixed inset-0 z-30 flex items-center justify-center bg-ink/55 p-4" role="presentation" @click.self="closeStory">
      <section class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-line bg-paper p-5 shadow-[0_24px_70px_rgba(38,61,56,0.25)] md:p-7" role="dialog" aria-modal="true" aria-labelledby="story-detail-title">
        <div class="flex items-start justify-between gap-4 border-b border-line-soft pb-4">
          <div>
            <p class="m-0 text-[9px] tracking-widest text-eyebrow">故事詳細內容</p>
            <h2 id="story-detail-title" class="mt-2 font-serif text-2xl font-normal text-ink">{{ editingStory ? '編輯故事' : selectedStory.title }}</h2>
          </div>
          <button class="border-0 bg-transparent text-xl text-muted hover:text-ink" type="button" aria-label="關閉詳細內容" @click="closeStory">×</button>
        </div>

        <form v-if="editingStory" class="mt-6 grid gap-5" @submit.prevent="saveStory">
          <label class="grid gap-2 text-[11px] font-medium text-text-strong">故事標題<input v-model="editingStory.title" class="rounded border border-border-input bg-shell px-3 py-2.5 text-xs text-ink outline-none focus:border-coral" type="text" required /></label>
          <label class="grid gap-2 text-[11px] font-medium text-text-strong">湯面<textarea v-model="editingStory.mystery" class="min-h-28 resize-y rounded border border-border-input bg-shell px-3 py-2.5 text-xs leading-6 text-ink outline-none focus:border-coral" required></textarea></label>
          <label class="grid gap-2 text-[11px] font-medium text-text-strong">湯底<textarea v-model="editingStory.solution" class="min-h-28 resize-y rounded border border-border-input bg-shell px-3 py-2.5 text-xs leading-6 text-ink outline-none focus:border-coral" required></textarea></label>
          <label class="grid gap-2 text-[11px] font-medium text-text-strong">提示<textarea v-model="editingStory.hint" class="min-h-24 resize-y rounded border border-border-input bg-shell px-3 py-2.5 text-xs leading-6 text-ink outline-none focus:border-coral" required></textarea></label>
          <label class="flex items-center justify-between gap-4 border-t border-line-soft pt-4 text-xs text-text-strong"><span>公開故事</span><input v-model="editingStory.is_published" class="h-4 w-4 accent-coral" type="checkbox" /></label>
          <div class="flex justify-end gap-3"><button class="rounded border border-border px-4 py-2.5 text-xs text-text-warm" type="button" @click="cancelEditing">取消</button><button class="rounded bg-ink px-4 py-2.5 text-xs text-cream disabled:opacity-50" type="submit" :disabled="isSaving">{{ isSaving ? '儲存中...' : '儲存變更' }}</button></div>
        </form>

        <div v-else class="mt-6">
          <div class="flex items-center justify-between gap-3">
            <p class="m-0 text-[10px] text-muted">建立於 {{ new Date(selectedStory.created_at).toLocaleDateString('zh-TW') }}</p>
            <span :class="['rounded-full px-2 py-1 text-[9px] font-medium', selectedStory.is_published ? 'bg-sage/20 text-sage-dark' : 'bg-gold/25 text-text-warm']">{{ selectedStory.is_published ? '已公開' : '草稿' }}</span>
          </div>
          <div class="mt-6 grid gap-5 text-xs leading-6 text-case-text">
            <div><p class="m-0 text-[9px] tracking-widest text-text-faint">湯面</p><p class="mt-1 whitespace-pre-wrap">{{ selectedStory.mystery }}</p></div>
            <div><p class="m-0 text-[9px] tracking-widest text-text-faint">湯底</p><p class="mt-1 whitespace-pre-wrap">{{ selectedStory.solution }}</p></div>
            <div><p class="m-0 text-[9px] tracking-widest text-text-faint">提示</p><p class="mt-1 whitespace-pre-wrap">{{ selectedStory.hint || '尚未提供提示' }}</p></div>
          </div>
          <div class="mt-7 flex justify-end gap-3 border-t border-line-soft pt-5"><button class="rounded border border-border px-4 py-2.5 text-xs text-text-warm" type="button" @click="startEditing">編輯故事</button><button class="rounded bg-ink px-4 py-2.5 text-xs text-cream" type="button" @click="closeStory">關閉</button></div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>