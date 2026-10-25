export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  senha_hash: string;
  data_criacao: string;
}

export interface Idioma {
  id_idioma: number;
  nome_idioma: string;
}

export type TipoNivel = "Intermediario" | "Medio" | "Avancado";

export interface Nivel {
  id_nivel: number;
  id_idioma: number;
  nivel_atual: TipoNivel;
  ordem_nivel: number; // 1 = Intermediário, 2 = Médio, 3 = Avançado
}

export interface ProgressoUsuario {
  id_progresso: number;
  id_usuario: number;
  id_nivel: number;
  bloqueado: boolean;
  concluido: boolean;
  nota_prova_final: number; // Decimal (5,2) -> float
}

export interface Licao {
  id_licao: number;
  id_nivel: number;
  titulo: string;
  ordem_licao: number;
  explicacao_profunda?: string;
}

export interface Vocabulario {
  id_vocabulario: number;
  id_licao: number;
  termo_original: string;
  traducao: string;
  pronuncia?: string;
  url_audio?: string;
  url_imagem?: string;
  exemplo_contexto_1: string;
  exemplo_contexto_2?: string;
  exemplo_contexto_3?: string;
}

export interface DesafioQuestao {
  tipo: "multipla-escolha" | "ordenar-palavras" | "completar-lacuna";
  pergunta: string;
  opcoes?: string[]; // Para múltipla escolha
  frase_embaralhada?: string[]; // Para ordenar palavras
  frase_com_lacuna?: string; // Para completar lacuna (ex: "I ___ a book.")
  resposta_correta: string; // Resposta ou frase correta final
}

export interface Gramatica {
  id_gramatica: number;
  id_licao: number;
  regra_titulo: string;
  explicacao: string;
  desafio_json: DesafioQuestao; // Estrutura dinâmica para quizzes
}

export interface ProvaFinal {
  id_prova: number;
  id_nivel: number;
}

export interface OpcaoResposta {
  id: number;
  texto: string;
}

export interface QuestaoProva {
  id_questao: number;
  id_prova: number;
  pergunta: string;
  categoria: "Vocabulario" | "Gramatica" | "Interpretacao";
  opcoes_resposta: OpcaoResposta[]; // [{ id: 1, texto: "text" }]
  resposta_correta_id: number;
}

export interface CalendarioEstudos {
  id_agenda: number;
  id_usuario: number;
  id_idioma: number;
  dia_semana: number; // 0 (Domingo) a 6 (Sábado)
  hora_estudo: string; // TIME (ex: "18:30")
  minutos_meta: number; // Default 30
}

// Full State for mock db or file persistence
export interface AppDatabase {
  usuarios: Usuario[];
  idiomas: Idioma[];
  niveis: Nivel[];
  progresso_usuario: ProgressoUsuario[];
  licoes: Licao[];
  vocabularios: Vocabulario[];
  gramaticas: Gramatica[];
  provas_finais: ProvaFinal[];
  questoes_prova: QuestaoProva[];
  calendario_estudos: CalendarioEstudos[];
}
