<template>
  <div class="min-h-screen bg-[#f8f9fc] p-8 font-sans text-gray-800 relative">
    <header class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-[#0f172a] tracking-tight">
          Pagamentos
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Gerencie suas despesas mensais e datas de vencimento.
        </p>
      </div>
      <button
        @click="isModalOpen = true"
        class="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] transition-colors text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Nova Despesa
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between"
      >
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-medium text-gray-500">Total do Mês</span>
            <button
              @click="openEditTotal"
              class="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
              title="Editar Valor Total"
            >
              <i class="ph-bold ph-pencil-simple text-sm"></i>
            </button>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ formatarMoeda(totalMes) }}
          </h2>
        </div>
        <div
          class="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center"
        >
          <div class="p-3 bg-slate-100 rounded-full text-slate-500 flex">
            <i class="ph-bold ph-wallet text-xl"></i>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between"
      >
        <div>
          <span class="text-sm font-medium text-gray-500 mb-1 block"
            >Já Pago</span
          >
          <h2 class="text-2xl font-bold text-[#10b981]">R$ 0,00</h2>
        </div>
        <div
          class="h-12 w-12 rounded-full bg-[#ecfdf5] flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-[#10b981]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div
        class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between"
      >
        <div>
          <span class="text-sm font-medium text-gray-500 mb-1 block"
            >Falta Pagar</span
          >
          <h2 class="text-2xl font-bold text-[#ef4444]">
            {{ formatarMoeda(totalPending) }}
          </h2>
        </div>
        <div class="p-3 bg-rose-100 rounded-full text-rose-600 flex">
          <i class="ph-bold ph-hourglass text-xl"></i>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 mb-6 border-b border-gray-200">
      <button
        @click="scrollTabs('left')"
        class="p-2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none shrink-0"
      >
        <i class="ph-bold ph-caret-left text-xl"></i>
      </button>

      <div
        ref="tabsContainer"
        class="flex-1 overflow-x-auto pb-px"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <div class="flex space-x-4">
          <button
            v-for="mes in meses"
            :key="mes.id"
            @click="mesAtivo = mes.id"
            :class="[
              'py-3 px-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap',
              mesAtivo === mes.id
                ? 'border-[#6366f1] text-[#6366f1]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ mes.nome }} - {{ mes.ano }}
          </button>
        </div>
      </div>

      <button
        @click="scrollTabs('right')"
        class="p-2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none shrink-0"
      >
        <i class="ph-bold ph-caret-right text-xl"></i>
      </button>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              <th class="py-4 px-6 w-24">Ordem</th>
              <th class="py-4 px-6">Descrição (Pagar)</th>
              <th class="py-4 px-6">Dia</th>
              <th class="py-4 px-6 text-center">Observações</th>
              <th class="py-4 px-6 text-center">Parcelas</th>
              <th class="py-4 px-6 text-center">Cód. Barras</th>
              <th class="py-4 px-6 text-right">Valor</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="item in despesas"
              :key="item.ordem"
              class="hover:bg-gray-50/50 transition-colors group"
            >
              <td class="py-4 px-6">
                <div class="flex items-center gap-3 text-gray-400">
                  <i
                    class="ph-bold ph-dots-six-vertical text-lg text-slate-300 group-hover:text-indigo-400"
                  ></i>
                  <span class="font-medium text-gray-500">{{
                    item.ordem
                  }}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="font-medium text-gray-900">{{
                  item.descricao
                }}</span>
              </td>
              <td class="py-4 px-6">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#166534]"
                >
                  Dia {{ item.dia }}
                </span>
              </td>
              <td class="py-4 px-6 text-center text-gray-400">
                {{ item.observacoes || "-" }}
              </td>
              <td class="py-4 px-6 text-center text-gray-400">
                {{ item.parcelas || "-" }}
              </td>
              <td class="py-4 px-6 text-center text-gray-400">
                {{ item.codBarras || "-" }}
              </td>
              <td class="py-4 px-6 text-right font-bold text-gray-900">
                {{ formatarMoeda(item.valor) }}
              </td>
              <td class="py-4 px-6 text-center">
                <button
                  class="text-gray-300 hover:text-[#6366f1] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </td>
              <td class="py-4 px-6 text-center">
                <button
                  class="text-gray-300 hover:text-red-500 transition-colors group-hover:opacity-100"
                >
                  <i class="ph-bold ph-trash text-lg"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-[520px] flex flex-col"
        @click.stop
      >
        <div
          class="px-6 py-5 border-b border-slate-100 flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <i class="ph-bold ph-plus-circle text-[#6366f1] text-xl"></i>
            <h3 class="text-base font-bold text-[#0f172a]">
              Adicionar Pagamento
            </h3>
          </div>
          <button
            @click="isModalOpen = false"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i class="ph ph-x text-lg"></i>
          </button>
        </div>

        <div class="p-6 space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
                >Ordem</label
              >
              <input
                type="number"
                value="10"
                class="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
                >Vencimento (Dia)</label
              >
              <input
                type="number"
                placeholder="Ex: 10"
                class="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
              >Descrição do Pagamento</label
            >
            <input
              type="text"
              placeholder="Ex: Condomínio"
              class="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
            />
          </div>

          <div>
            <label
              class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
              >Valor (R$)</label
            >
            <input
              type="number"
              step="0.01"
              placeholder="R$ 0,00"
              class="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
                >Observações</label
              >
              <input
                type="text"
                placeholder="Detalhes opcionais"
                class="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
                >Parcelas</label
              >
              <input
                type="text"
                placeholder="Ex: 1/12"
                class="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
              >Código de Barras</label
            >
            <textarea
              rows="3"
              placeholder="Cole o código aqui..."
              class="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] resize-none"
            ></textarea>
          </div>
        </div>

        <div class="px-6 py-4 flex items-center justify-end gap-4 pb-6">
          <button
            @click="isModalOpen = false"
            class="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            class="px-5 py-2.5 text-sm font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-lg transition-colors shadow-sm"
          >
            Salvar Despesa
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isEditTotalModalOpen"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-[420px] flex flex-col"
        @click.stop
      >
        <div
          class="px-6 py-5 flex items-center justify-between border-b border-slate-50"
        >
          <div class="flex items-center gap-2">
            <i class="ph-bold ph-wallet text-[#6366f1] text-xl"></i>
            <h3 class="text-base font-bold text-[#0f172a]">
              Editar Total do Mês
            </h3>
          </div>
          <button
            @click="isEditTotalModalOpen = false"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i class="ph ph-x text-lg"></i>
          </button>
        </div>

        <div class="p-6">
          <p class="text-[14px] text-slate-600 mb-1 leading-relaxed">
            Defina um valor fixo para o mês de
            <strong class="text-slate-800 font-bold">Abril - 2026</strong>.
          </p>
          <p class="text-[14px] text-slate-500 mb-6">
            Remova para calcular o total automaticamente.
          </p>

          <div>
            <label
              class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
            >
              Valor Fixo (R$)
            </label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-slate-400 text-sm font-medium"
                >R$</span
              >
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                class="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
              />
            </div>
          </div>
        </div>

        <div class="px-6 py-4 flex items-center justify-between pb-6">
          <button
            class="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
          >
            Remover Fixo
          </button>

          <div class="flex items-center gap-3">
            <button
              @click="isEditTotalModalOpen = false"
              class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              class="px-6 py-2.5 text-sm font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-lg transition-colors shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Controle do Modal Novo Pagamento
const isModalOpen = ref(false);

// Controle do Modal Editar Total
const isEditTotalModalOpen = ref(false);

const openEditTotal = () => {
  isEditTotalModalOpen.value = true;
};

// Controle de Navegação de Meses
const mesAtivo = ref("abril-2026");
const tabsContainer = ref(null);

const scrollTabs = (direction) => {
  if (tabsContainer.value) {
    const scrollAmount = 250;
    tabsContainer.value.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};

const meses = ref([
  { id: "setembro-2025", nome: "Setembro", ano: "2025" },
  { id: "outubro-2025", nome: "Outubro", ano: "2025" },
  { id: "novembro-2025", nome: "Novembro", ano: "2025" },
  { id: "dezembro-2025", nome: "Dezembro", ano: "2025" },
  { id: "janeiro-2026", nome: "Janeiro", ano: "2026" },
  { id: "fevereiro-2026", nome: "Fevereiro", ano: "2026" },
  { id: "marco-2026", nome: "Março", ano: "2026" },
  { id: "abril-2026", nome: "Abril", ano: "2026" },
]);

const despesas = ref([
  {
    ordem: 1,
    descricao: "condominio - Pagani",
    dia: 10,
    observacoes: "",
    parcelas: "",
    codBarras: "",
    valor: 553.57,
  },
  {
    ordem: 2,
    descricao: "cartão NuBank",
    dia: 11,
    observacoes: "",
    parcelas: "",
    codBarras: "",
    valor: 2100.9,
  },
  {
    ordem: 3,
    descricao: "Meu celular",
    dia: 12,
    observacoes: "",
    parcelas: "",
    codBarras: "",
    valor: 28.9,
  },
  {
    ordem: 4,
    descricao: "Internet",
    dia: 15,
    observacoes: "",
    parcelas: "",
    codBarras: "",
    valor: 104.79,
  },
  {
    ordem: 5,
    descricao: "caixa / taxa construção",
    dia: 17,
    observacoes: "",
    parcelas: "",
    codBarras: "",
    valor: 1841.66,
  },
  {
    ordem: 6,
    descricao: "Parcela apartamento",
    dia: 20,
    observacoes: "",
    parcelas: "",
    codBarras: "",
    valor: 1052.37,
  },
]);

// Cálculo do Total do Mês (soma de todas as despesas)
const totalMes = computed(() => {
  return despesas.value.reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
});

// Cálculo do Valor Pendente (apenas o que ainda não foi pago)
const totalPending = computed(() => {
  return despesas.value
    .filter((item) => !item.pago)
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
});

// Função utilitária para formatar o valor monetário
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};
</script>
