<template>
  <div
    v-if="active"
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[2px] transition-all"
  >
    <div
      class="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center"
    >
      <!-- Spinner Animado -->
      <div class="relative h-12 w-12">
        <div
          class="absolute inset-0 rounded-full border-4 border-slate-100"
        ></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-t-[#6366f1] animate-spin"
        ></div>
      </div>

      <p
        v-if="message"
        class="mt-4 text-sm font-semibold text-slate-600 tracking-tight"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppLoading",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "Carregando dados...",
    },
  },
};
</script>
