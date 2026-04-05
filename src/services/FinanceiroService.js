import { supabase } from "../lib/supabaseClient";

export async function buscarMeses() {
    const { data, error } = await supabase
        .from("meses")
        .select("*")
        .order("ano", { ascending: true });

    if (error) {
        console.error("Erro ao buscar meses:", error);
        return [];
    }
    if (data && data.length > 0) {
        const ordemDosMeses = {
            Janeiro: 1,
            Fevereiro: 2,
            Março: 3,
            Abril: 4,
            Maio: 5,
            Junho: 6,
            Julho: 7,
            Agosto: 8,
            Setembro: 9,
            Outubro: 10,
            Novembro: 11,
            Dezembro: 12,
        };

        const mesesOrdenados = data.sort((a, b) => {
            if (a.ano !== b.ano) return a.ano - b.ano;
            const ordemA = ordemDosMeses[a.nome] || 0;
            const ordemB = ordemDosMeses[b.nome] || 0;
            return ordemA - ordemB;
        });

        return mesesOrdenados;
    }
    return [];
}

export async function buscarDespesas(mesId) {
    console.log("Service: Buscando despesas para o mês:", mesId);

    const { data, error } = await supabase
        .from("despesas")
        .select("*")
        .eq("mes_id", mesId)
        .order("ordem", { ascending: true });

    console.log("Service: Despesas buscadas:", data, "Erro:", error);
    if (error) {
        console.error("Service: Erro ao buscar despesas:", error);
        return []; // Se der erro, devolve um array vazio para não quebrar a tela
    }

    // DEVOLVE os dados para quem chamou a função
    return data || [];
}

export async function excluirDespesa(id) {
    const { error } = await supabase
        .from("despesas")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Service: Erro ao excluir despesa:", error);
        throw error;
    }
}

export async function criarDespesa(despesa) {
    const { data, error } = await supabase
        .from("despesas")
        .insert([despesa])
        .select();

    if (error) {
        console.error("Service: Erro ao criar despesa:", error);
        throw error;
    }
    return data[0];
}

export async function atualizarStatusDespesa(id, pago) {
    console.log("Service: Atualizando despesa", id, "para status:", pago);

    if (!id) throw new Error("ID da despesa é obrigatório para atualização.");

    const { data, error } = await supabase
        .from("despesas")
        .update({ pago: !!pago }) // Garante que estamos enviando um booleano puro
        .eq("id", id)
        .select(); // Força o retorno para confirmar se a linha foi realmente afetada

    if (error) {
        // Se o erro chegar aqui, o Supabase respondeu, mas negou a operação
        console.error("Service: Erro detalhado no Update:", error.message, error.details);
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error("Nenhum registro foi atualizado. Verifique se o ID está correto ou se as permissões RLS permitem o acesso.");
    }
}

export async function atualizarValorFixoMes(mesId, valorFixo) {
    console.log("Service: Atualizando valor fixo do mes", mesId, "para:", valorFixo);

    const { data, error } = await supabase
        .from("meses")
        .update({ valor_fixo: valorFixo })
        .eq("id", mesId)
        .select();

    if (error) {
        console.error("Service: Erro ao atualizar valor fixo do mes:", error);
        throw error;
    }

    return data && data.length > 0 ? data[0] : null;
}