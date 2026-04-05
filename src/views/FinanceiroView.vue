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
          <h2 class="text-2xl font-bold text-[#10b981]">
            {{ formatarMoeda(totalPago) }}
          </h2>
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
                  @click="alternarStatus(item)"
                  :class="[
                    'transition-colors',
                    item.pago
                      ? 'text-green-500'
                      : 'text-gray-300 hover:text-[#6366f1]',
                  ]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mx-auto"
                    :fill="item.pago ? 'currentColor' : 'none'"
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
                  @click="excluirDespesa(item.ordem)"
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
                v-model="novaDespesa.ordem"
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
                v-model="novaDespesa.dia"
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
              v-model="novaDespesa.descricao"
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
              v-model="novaDespesa.valor"
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
                v-model="novaDespesa.observacoes"
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
                v-model="novaDespesa.parcelas"
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
              v-model="novaDespesa.codBarras"
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
            @click="salvarDespesa"
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

<script>
import { buscarMeses, buscarDespesas } from "../services/FinanceiroService.js";
export default {
  // 1. DATA: Substitui o "ref()". É aqui que ficam as variáveis reativas.
  data() {
    return {
      isModalOpen: false,
      isEditTotalModalOpen: false,
      mesAtivo: null,
      meses: [],
      novaDespesa: {
        ordem: null,
        descricao: "",
        dia: null,
        observacoes: "",
        parcelas: "",
        codBarras: "",
        valor: 0,
        pago: false,
      },
      despesas: [],
      mesAtivo: "abril-2026",
    };
  },

  // 2. COMPUTED: Substitui o "computed(() => {})". Usado para cálculos automáticos.
  computed: {
    totalMes() {
      // Sempre usar this.nomeDaVariavel na Options API
      return this.despesas.reduce(
        (acc, curr) => acc + Number(curr.valor || 0),
        0,
      );
    },
    totalPago() {
      return this.despesas
        .filter((item) => item.pago)
        .reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
    },
    totalPending() {
      return this.despesas
        .filter((item) => !item.pago)
        .reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
    },
    mesAtivoNome() {
      const mes = this.meses.find((m) => m.id === this.mesAtivo);
      return mes ? `${mes.nome} - ${mes.ano}` : "Mês atual";
    },
  },

  // Monitora mudanças no mês ativo para recarregar despesas
  watch: {
    mesAtivo(novoMes) {
      if (novoMes) this.buscarDespesas();
    },
  },

  // 3. METHODS: Substitui as funções const = () => {}.
  methods: {
    openEditTotal() {
      this.isEditTotalModalOpen = true;
    },

    scrollTabs(direction) {
      // Na Options API, acessamos a div "ref='tabsContainer'" através de this.$refs
      const container = this.$refs.tabsContainer;

      if (container) {
        const scrollAmount = 250;
        container.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    },

    //meses
    async buscarMeses() {
      try {
        this.meses = await buscarMeses();
      } catch (error) {
        console.error("Erro ao carregar meses:", error);
      }
    },

    async carregarDespesasNaTela(mesId) {
      try {
        // Chama o service e espera a resposta
        const dadosDoBanco = await buscarDespesas(mesId);

        // O SEGREDO ESTÁ AQUI NA VIEW: guarda a resposta na variável da tela!
        this.despesas = dadosDoBanco;
      } catch (error) {
        console.error("Erro ao carregar despesas:", error);
      }
    },

    formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    },

    alternarStatus(item) {
      item.pago = !item.pago;
    },

    excluirDespesa(ordem) {
      this.despesas = this.despesas.filter((d) => d.ordem !== ordem);
    },

    salvarDespesa() {
      this.despesas.push({ ...this.novaDespesa });
      this.isModalOpen = false;
      // Limpar formulário
      this.novaDespesa = {
        ordem: null,
        descricao: "",
        dia: null,
        observacoes: "",
        parcelas: "",
        codBarras: "",
        valor: 0,
        pago: false,
      };
    },
  },

  // 4. MOUNTED: Substitui o "onMounted()". Roda assim que a tela carrega.
  async mounted() {
    await this.buscarMeses();
    await this.carregarDespesasNaTela(this.mesAtivo);
    // Define o primeiro mês da lista como ativo caso nenhum esteja selecionado
    if (this.meses.length > 0 && !this.mesAtivo) {
      this.mesAtivo = this.meses[0].id;
    }
  },
};
</script>
