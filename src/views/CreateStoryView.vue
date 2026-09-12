<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layout/AppLayout.vue'
import { createStory, type CreateStoryPayload } from '../api/stories'

const isSubmitting = ref(false)

const story = ref<CreateStoryPayload>({
  title: '',
  mystery: '',
  solution: '',
  hint: '',
  is_published: false,
})

async function submitStory() {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    await createStory({
      title: story.value.title.trim(),
      mystery: story.value.mystery.trim(),
      solution: story.value.solution.trim(),
      hint: story.value.hint.trim(),
      is_published: story.value.is_published,
    })

    await Swal.fire({
      title: '故事已建立',
      text: story.value.is_published ? '故事已公開，玩家可以開始推理。' : '故事已儲存為草稿。',
      icon: 'success',
      confirmButtonText: '完成',
      confirmButtonColor: 'var(--color-ink)',
    })

    story.value = {
      title: '',
      mystery: '',
      solution: '',
      hint: '',
      is_published: false,
    }
  } catch {
    await Swal.fire({
      title: '故事建立失敗',
      text: '請確認內容後再試一次。',
      icon: 'error',
      confirmButtonText: '知道了',
      confirmButtonColor: 'var(--color-coral)',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="mx-auto max-w-235 px-4 py-7.25 md:px-[5.5%] md:py-13.75">
      <section class="mb-6.25">
        <p class="m-0 text-[10px] tracking-wider text-eyebrow">故事工坊</p>
        <h1 class="my-3.25 mb-1.75 font-serif text-4xl font-normal tracking-tight text-ink md:text-5xl">新增一個故事</h1>
        <p class="m-0 text-xs text-muted">寫下湯面與湯底，讓玩家從問題裡拼出你的真相。</p>
      </section>

      <form class="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]" @submit.prevent="submitStory">
        <section class="rounded-lg border border-line bg-paper p-5 md:p-7">
          <div class="mb-6 border-b border-line-soft pb-4">
            <h2 class="m-0 font-serif text-xl font-normal text-ink">故事內容</h2>
            <p class="mt-1 text-[11px] text-muted">先從一個讓人想追問的場景開始。</p>
          </div>

          <div class="grid gap-5">
            <label class="grid gap-2 text-[11px] font-medium text-text-strong">
              故事標題
              <input v-model="story.title" class="rounded border border-border-input bg-shell px-3 py-2.5 text-xs text-ink outline-none focus:border-coral" type="text" placeholder="例如：最後一班電車" required />
            </label>
            <label class="grid gap-2 text-[11px] font-medium text-text-strong">
              湯面
              <textarea v-model="story.mystery" class="min-h-32 resize-y rounded border border-border-input bg-shell px-3 py-2.5 text-xs leading-6 text-ink outline-none focus:border-coral" placeholder="玩家一開始看見的故事情境。" required></textarea>
            </label>
            <label class="grid gap-2 text-[11px] font-medium text-text-strong">
              湯底
              <textarea v-model="story.solution" class="min-h-32 resize-y rounded border border-border-input bg-shell px-3 py-2.5 text-xs leading-6 text-ink outline-none focus:border-coral" placeholder="事情真正發生的原因與完整真相。" required></textarea>
            </label>
          </div>
        </section>

        <section class="self-start rounded-lg border border-line bg-paper p-5 md:p-7">
          <div class="mb-6 border-b border-line-soft pb-4">
            <h2 class="m-0 font-serif text-xl font-normal text-ink">主持設定</h2>
            <p class="mt-1 text-[11px] text-muted">讓推理過程保留一點餘韻。</p>
          </div>

          <label class="grid gap-2 text-[11px] font-medium text-text-strong">
            提示
            <textarea v-model="story.hint" class="min-h-28 resize-y rounded border border-border-input bg-shell px-3 py-2.5 text-xs leading-6 text-ink outline-none focus:border-coral" placeholder="玩家卡關時可以給的線索。" required></textarea>
          </label>
          <label class="mt-6 flex items-start justify-between gap-4 border-t border-line-soft pt-5 text-xs leading-5 text-text-strong">
            <span><strong class="block font-medium">立即公開故事</strong><small class="text-[10px] text-muted">關閉時會先儲存為草稿。</small></span>
            <input v-model="story.is_published" class="mt-1 h-4 w-4 shrink-0 accent-coral" type="checkbox" />
          </label>
        </section>

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end lg:col-span-2">
          <RouterLink class="rounded border border-border bg-transparent px-5 py-3 text-center text-xs text-text-warm transition-colors hover:border-ink" to="/">取消</RouterLink>
          <button class="rounded bg-ink px-5 py-3 text-xs font-medium text-cream transition-colors hover:bg-sage disabled:cursor-not-allowed disabled:opacity-60" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? '建立中...' : '建立故事' }}
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>