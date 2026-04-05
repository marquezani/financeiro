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
    console.log("Service: Criando despesa com dados:", despesa);
    const { data, error } = await supabase
        .from("despesas")
        .insert([despesa])
        .select();

    if (error) {
        console.error("Service: Erro ao criar despesa:", error);
        throw new Error(error.message || "Erro ao criar despesa no banco de dados.");
    }
    console.log("Service: Despesa criada com sucesso:", data);
    // Se data estiver vazio devido a RLS, retorna a despesa enviada
    return data && data.length > 0 ? data[0] : { ...despesa, id: 'temp' };
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

export async function atualizarMetodoPagamento(id, metodo) {
    if (!id) throw new Error("ID da despesa é obrigatório para atualização.");

    const { data, error } = await supabase
        .from("despesas")
        .update({ metodo_pagamento: metodo })
        .eq("id", id)
        .select();

    if (error) {
        console.error("Service: Erro ao atualizar método de pagamento:", error.message, error.details);
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error("Nenhum registro foi atualizado para o método de pagamento.");
    }
}

export async function atualizarOrdensDespesas(despesas) {
    if (!Array.isArray(despesas) || despesas.length === 0) {
        return [];
    }

    const validRows = despesas
        .filter((item) => item && item.id !== null && item.id !== undefined)
        .map((item) => ({
            id: item.id,
            ordem: item.ordem,
        }));

    if (validRows.length === 0) {
        throw new Error("Nenhuma despesa válida para atualizar a ordem.");
    }

    const results = [];
    for (const row of validRows) {
        const { data, error } = await supabase
            .from("despesas")
            .update({ ordem: row.ordem })
            .eq("id", row.id)
            .select("id, ordem");

        if (error) {
            console.error("Service: Erro ao atualizar ordem da despesa:", row, error);
            throw new Error(error.message || "Erro ao atualizar ordens das despesas.");
        }

        if (!data || data.length === 0) {
            console.error("Service: Nenhuma despesa atualizada para o row:", row);
            throw new Error(
                "Nenhuma despesa atualizada. Verifique os IDs das despesas e as permissões no Supabase.",
            );
        }

        results.push(data[0]);
    }

    return results;
}

function normalizeMesId(mesId) {
    if (mesId === null || mesId === undefined) return mesId;
    if (typeof mesId === "string" && /^[0-9]+$/.test(mesId)) {
        return Number(mesId);
    }
    return mesId;
}

export async function atualizarValorFixoMes(mesId, valorFixo, fallback) {
    const normalizedId = normalizeMesId(mesId);
    if (normalizedId === null || normalizedId === undefined) {
        throw new Error("ID do mês é obrigatório para atualizar o valor fixo.");
    }

    console.log("Service: Atualizando valor fixo do mes", normalizedId, "para:", valorFixo);

    const { data, error } = await supabase
        .from("meses")
        .update({ valor_fixo: valorFixo })
        .eq("id", normalizedId)
        .select("id, valor_fixo");

    if (error) {
        console.error("Service: Erro ao atualizar valor fixo do mes:", error);
        throw new Error(error.message || "Erro no Supabase ao atualizar o valor fixo do mês.");
    }

    if (data && data.length > 0) {
        return data[0];
    }

    if (fallback && fallback.nome && fallback.ano) {
        console.warn(
            "Service: Nenhum registro atualizado por ID, tentando fallback por nome/ano.",
            { mesId: normalizedId, fallback },
        );
        const { data: fallbackData, error: fallbackError } = await supabase
            .from("meses")
            .update({ valor_fixo: valorFixo })
            .match({ nome: fallback.nome, ano: fallback.ano })
            .select("id, valor_fixo");

        if (fallbackError) {
            console.error("Service: Erro no fallback por nome/ano:", fallbackError);
            throw new Error(
                fallbackError.message ||
                "Erro no Supabase ao atualizar o valor fixo do mês (fallback).",
            );
        }

        if (fallbackData && fallbackData.length > 0) {
            return fallbackData[0];
        }
    }

    console.error(
        "Service: Atualização concluída, mas nenhum registro foi retornado.",
        { mesId: normalizedId, valorFixo, data, fallback },
    );
    throw new Error(
        "Nenhum registro foi atualizado. Verifique o ID do mês e as permissões no Supabase.",
    );
}