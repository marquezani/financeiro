import { supabase } from "../lib/supabaseClient";

export async function buscarMeses() {
    const { data, error } = await supabase
        .from("meses")
        .select("*")
        .order("ano", { ascending: true });

    if (error) {
        console.error("Erro ao buscar meses:", error);
    } else {
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
            if (a.ano === b.ano) {
                return ordemDosMeses[a.nome] - ordemDosMeses[b.nome];
            }
            return a.ano - b.ano;
        });

        return mesesOrdenados;
    }
}

export async function buscarDespesas(mesId) {
    console.log("Service: Buscando despesas para o mês:", mesId);

    const { data, error } = await supabase
        .from("despesas")
        .select("*")
        .eq("mes_id", mesId)
        .order("ordem", { ascending: true });

    if (error) {
        console.error("Service: Erro ao buscar despesas:", error);
        return []; // Se der erro, devolve um array vazio para não quebrar a tela
    }

    // DEVOLVE os dados para quem chamou a função
    return data || [];
}