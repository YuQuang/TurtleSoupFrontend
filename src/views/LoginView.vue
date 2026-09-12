<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const isGoogleLoading = ref(false)
const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL ?? ''

function submitLogin() {
  if (!email.value || !password.value) {
    Swal.fire({
      title: '還差一點資料',
      text: '請填寫電子信箱與密碼。',
      icon: 'warning',
      confirmButtonText: '知道了',
      confirmButtonColor: 'var(--color-ink)',
    })
    return
  }

  Swal.fire({
    title: '登入功能準備中',
    text: '目前請使用 Google 登入進入湯底俱樂部。',
    icon: 'info',
    confirmButtonText: '使用 Google 登入',
    confirmButtonColor: 'var(--color-coral)',
    showCancelButton: true,
    cancelButtonText: '稍後再說',
    cancelButtonColor: 'var(--color-muted)',
  }).then(({ isConfirmed }) => {
    if (isConfirmed) {
      connectWithGoogle()
    }
  })
}

function connectWithGoogle() {
  isGoogleLoading.value = true
  window.location.assign(`${backendBaseUrl}/api/integrations/google/connect`)
}
</script>

<template>
  <main class="relative flex min-h-dvh items-center overflow-hidden bg-shell px-4 py-8 text-ink sm:px-8 lg:px-12">
    <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border-28 border-gold/25 sm:h-96 sm:w-96"></div>
    <div class="pointer-events-none absolute -bottom-36 -right-24 h-80 w-80 rounded-full bg-coral/10 sm:h-112 sm:w-md"></div>

    <div class="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_70px_rgba(38,61,56,0.14)] lg:grid-cols-[0.92fr_1.08fr]">
      <section class="relative flex min-h-80 flex-col justify-between overflow-hidden bg-ink px-7 py-8 text-cream sm:px-10 sm:py-10 lg:min-h-156 lg:px-12 lg:py-12">
        <div class="absolute -bottom-16 -right-14 h-56 w-56 rounded-full border border-sage/40"></div>
        <div class="absolute bottom-8 right-9 h-28 w-28 rounded-full border border-gold/25"></div>

        <div class="relative">
          <div class="mb-10 flex items-center gap-3">
            <div class="grid h-11 w-11 -rotate-12 place-items-center rounded-full border border-gold text-2xl text-gold">◎</div>
            <div>
              <p class="m-0 font-serif text-lg tracking-wide">湯底俱樂部</p>
              <p class="m-0 mt-1 text-[10px] tracking-[0.2em] text-mist">一起把故事拼完整</p>
            </div>
          </div>

          <p class="m-0 text-[11px] tracking-[0.28em] text-gold">WELCOME BACK, DETECTIVE</p>
          <h1 class="mt-5 max-w-xs font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl">每個故事，<br /><span class="text-peach">都少一個線索。</span></h1>
          <p class="mt-6 max-w-sm text-sm leading-7 text-mist">回到聊天室，和夥伴一起從一碗湯開始，找出故事裡那個最不合理的地方。</p>
        </div>

        <div class="relative mt-10 flex items-end justify-between border-t border-border-dark pt-5 text-[10px] tracking-wider text-sage-text">
          <span>案件持續更新中</span>
          <span class="font-serif text-lg text-gold">042</span>
        </div>
      </section>

      <section class="flex items-center px-7 py-9 sm:px-12 sm:py-12 lg:px-16">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <p class="m-0 text-[10px] tracking-[0.22em] text-eyebrow">SIGN IN</p>
            <h2 class="mt-3 font-serif text-3xl font-normal text-ink">歡迎回來</h2>
            <p class="mt-2 text-xs leading-6 text-muted">登入後繼續你的推理，下一個真相正在等你。</p>
          </div>

          <form class="grid gap-4" @submit.prevent="submitLogin">
            <label class="grid gap-2 text-[11px] font-medium text-text-strong">
              電子信箱
              <input v-model="email" class="h-12 rounded border border-border-input bg-shell px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-placeholder focus:border-coral focus:ring-2 focus:ring-coral/15" type="email" autocomplete="email" placeholder="you@example.com" />
            </label>
            <label class="grid gap-2 text-[11px] font-medium text-text-strong">
              密碼
              <input v-model="password" class="h-12 rounded border border-border-input bg-shell px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-placeholder focus:border-coral focus:ring-2 focus:ring-coral/15" type="password" autocomplete="current-password" placeholder="輸入你的密碼" />
            </label>
            <button class="mt-1 h-12 rounded bg-ink px-4 text-xs font-semibold tracking-wider text-cream transition-colors hover:bg-sage focus:outline-none focus:ring-2 focus:ring-coral/40" type="submit">登入聊天室</button>
          </form>

          <div class="my-7 flex items-center gap-3 text-[10px] tracking-wider text-text-faint"><span class="h-px flex-1 bg-line"></span><span>或使用其他方式</span><span class="h-px flex-1 bg-line"></span></div>

          <button class="flex h-12 w-full items-center justify-center gap-3 rounded border border-border bg-transparent text-xs font-medium text-text-strong transition-colors hover:border-sage hover:bg-cream focus:outline-none focus:ring-2 focus:ring-coral/40 disabled:cursor-wait disabled:opacity-60" type="button" :disabled="isGoogleLoading" @click="connectWithGoogle">
            <span class="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-bold shadow-sm" aria-hidden="true"><span class="text-[#4285f4]">G</span></span>
            {{ isGoogleLoading ? '正在前往 Google...' : '使用 Google 登入' }}
          </button>

          <p class="mt-8 text-center text-[10px] leading-5 text-muted">登入即表示你同意湯底俱樂部的服務條款與隱私政策。</p>
        </div>
      </section>
    </div>
  </main>
</template>
