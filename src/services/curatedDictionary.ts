// Curated High-Speed Multilingual Lexicographical Corpus
// Guarantees instant (<1ms) rich search results for all core languages taught in the portal

export interface CuratedDictWord {
  termo_original: string;
  idioma_nome: string;
  traducao: string;
  pronuncia: string;
  categoria: string;
  explicacao_cultural: string;
  nivel_nome: string;
  exemplo_contexto_1: string;
  exemplo_contexto_1_traducao: string;
  exemplo_contexto_2: string;
  exemplo_contexto_2_traducao: string;
  exemplo_contexto_3: string;
  exemplo_contexto_3_traducao: string;
  url_audio?: string;
}

export const CURATED_DICTIONARY: CuratedDictWord[] = [
  // --- KIMBUNDU (Angola) ---
  {
    termo_original: "Kiambote",
    idioma_nome: "Kimbundu",
    traducao: "Olá / Tudo bem / Bom estado",
    pronuncia: "Kee-ahm-boh-teh",
    categoria: "Saudação & Substantivo",
    explicacao_cultural: "Saudação universal de harmonia e bem-estar no Kimbundu. Representa o desejo sincero de paz e saúde ao interlocutor.",
    nivel_nome: "Iniciante",
    exemplo_contexto_1: "Kiambote, tata! Wazekele kyebhi?",
    exemplo_contexto_1_traducao: "Olá, senhor! Como você passou a noite?",
    exemplo_contexto_2: "Etu tuala kiambote lelo.",
    exemplo_contexto_2_traducao: "Nós estamos muito bem hoje.",
    exemplo_contexto_3: "Kuzuela kiambote ku jikula njila.",
    exemplo_contexto_3_traducao: "Falar com benevolência abre todos os caminhos."
  },
  {
    termo_original: "Dikamba",
    idioma_nome: "Kimbundu",
    traducao: "Amigo / Companheiro",
    pronuncia: "Dee-kahm-bah",
    categoria: "Substantivo",
    explicacao_cultural: "Conceito sagrado de lealdade e parentesco comunitário nas tradições angolanas.",
    nivel_nome: "Intermediário",
    exemplo_contexto_1: "O dikamba diami ua kwiza ku inzo.",
    exemplo_contexto_1_traducao: "O meu amigo veio à minha casa.",
    exemplo_contexto_2: "Dikamba dia kidi ka ku bhele mu ngolongolo.",
    exemplo_contexto_2_traducao: "Um amigo verdadeiro não te abandona na dificuldade.",
    exemplo_contexto_3: "Tuene ni ukamba ua nguzu.",
    exemplo_contexto_3_traducao: "Temos uma amizade forte e sincera."
  },
  {
    termo_original: "Sakidila",
    idioma_nome: "Kimbundu",
    traducao: "Obrigado / Agradecimento",
    pronuncia: "Sah-kee-dee-lah",
    categoria: "Expressão de Gratidão",
    explicacao_cultural: "Expressão tradicional de agradecimento e reconhecimento de bênçãos compartilhadas.",
    nivel_nome: "Iniciante",
    exemplo_contexto_1: "Sakidila kyavulu mu kikuatekesu kyé.",
    exemplo_contexto_1_traducao: "Muito obrigado pela sua generosa ajuda.",
    exemplo_contexto_2: "Sakidila mu kudia kuabiza.",
    exemplo_contexto_2_traducao: "Obrigado pela refeição saborosa.",
    exemplo_contexto_3: "O muxima ua sakidila u bakesa muenhu.",
    exemplo_contexto_3_traducao: "Um coração agradecido enobrece a vida."
  },
  {
    termo_original: "Muenhu",
    idioma_nome: "Kimbundu",
    traducao: "Vida / Existência / Alma",
    pronuncia: "Moo-eh-nhoo",
    categoria: "Substantivo",
    explicacao_cultural: "A força vital cósmica que conecta os antepassados, os vivos e a natureza na cosmovisão bantu.",
    nivel_nome: "Médio",
    exemplo_contexto_1: "O muenhu u zola ukaza ni kidi.",
    exemplo_contexto_1_traducao: "A vida requer equilíbrio e verdade.",
    exemplo_contexto_2: "Kala ni muenhu ua fukama.",
    exemplo_contexto_2_traducao: "Tenha uma vida próspera e feliz.",
    exemplo_contexto_3: "O muenhu uene ujitu ua Nzambi.",
    exemplo_contexto_3_traducao: "A vida é uma dádiva divina."
  },
  {
    termo_original: "Kudilonga",
    idioma_nome: "Kimbundu",
    traducao: "Aprender / Instruir-se",
    pronuncia: "Koo-dee-lohn-gah",
    categoria: "Verbo",
    explicacao_cultural: "A transmissão contínua de saberes e provérbios através da oralidade e da escuta dos mais velhos.",
    nivel_nome: "Intermediário",
    exemplo_contexto_1: "Tua zola kudilonga o dimi dia bankoko.",
    exemplo_contexto_1_traducao: "Queremos aprender a língua de nossos antepassados.",
    exemplo_contexto_2: "Kudilonga o zuela ku tu bakesa.",
    exemplo_contexto_2_traducao: "Aprender a falar nos engrandece.",
    exemplo_contexto_3: "O undenge u ngi kuatesa kudilonga.",
    exemplo_contexto_3_traducao: "A juventude me motiva a aprender cada vez mais."
  },

  // --- LINGALA (Congo) ---
  {
    termo_original: "Mbote",
    idioma_nome: "Lingala",
    traducao: "Olá / Saudação / Paz",
    pronuncia: "M-boh-teh",
    categoria: "Saudação",
    explicacao_cultural: "A saudação primordial em Lingala nas bacias dos rios Congo e Ubangui, transmitindo acolhimento.",
    nivel_nome: "Iniciante",
    exemplo_contexto_1: "Mbote na yo, ndeko na ngai!",
    exemplo_contexto_1_traducao: "Olá a você, meu querido irmão!",
    exemplo_contexto_2: "Mbote na bato banso ya ndako.",
    exemplo_contexto_2_traducao: "Saudações a todos da casa.",
    exemplo_contexto_3: "Mbote na tongo epesaka esengo.",
    exemplo_contexto_3_traducao: "Um bom dia pela manhã traz felicidade."
  },
  {
    termo_original: "Matondi",
    idioma_nome: "Lingala",
    traducao: "Obrigado / Gratidão",
    pronuncia: "Mah-tohn-dee",
    categoria: "Expressão",
    explicacao_cultural: "Palavra que encerra respeito mútuo e gratidão comunitária.",
    nivel_nome: "Iniciante",
    exemplo_contexto_1: "Matondi mingi mpo na lisungi nayo.",
    exemplo_contexto_1_traducao: "Muito obrigado pelo seu apoio generoso.",
    exemplo_contexto_2: "Totondi Nzambe mpo na bomoyi.",
    exemplo_contexto_2_traducao: "Agradecemos a Deus pela vida.",
    exemplo_contexto_3: "Matondi na liyebisi kitoko.",
    exemplo_contexto_3_traducao: "Obrigado pela bela mensagem."
  },
  {
    termo_original: "Moninga",
    idioma_nome: "Lingala",
    traducao: "Amigo / Companheiro",
    pronuncia: "Moh-neen-gah",
    categoria: "Substantivo",
    explicacao_cultural: "Expressa a fraternidade inabalável entre pessoas que partilham caminhos e refeições.",
    nivel_nome: "Intermediário",
    exemplo_contexto_1: "Moninga malamu aleki ndeko ya mosika.",
    exemplo_contexto_1_traducao: "Um bom amigo vale mais que um parente distante.",
    exemplo_contexto_2: "Nalingaka kosolola na moninga na ngai.",
    exemplo_contexto_2_traducao: "Eu adoro conversar com o meu amigo.",
    exemplo_contexto_3: "Baninga basalisanaka na ntango ya mpasi.",
    exemplo_contexto_3_traducao: "Amigos se apoiam em tempos difíceis."
  },
  {
    termo_original: "Kimia",
    idioma_nome: "Lingala",
    traducao: "Paz / Serenidade / Calma",
    pronuncia: "Kee-mee-ah",
    categoria: "Substantivo",
    explicacao_cultural: "Um dos ideais mais celebrados na música e na literatura congolesa.",
    nivel_nome: "Médio",
    exemplo_contexto_1: "Tolingi kimia na mokili mobimba.",
    exemplo_contexto_1_traducao: "Desejamos paz em todo o mundo.",
    exemplo_contexto_2: "Zala na kimia na motema nayo.",
    exemplo_contexto_2_traducao: "Guarde a paz em seu coração.",
    exemplo_contexto_3: "Kimia ezali fungola ya bokoli.",
    exemplo_contexto_3_traducao: "A paz é a chave do desenvolvimento."
  },

  // --- UMBUNDU (Angola) ---
  {
    termo_original: "Kalunga",
    idioma_nome: "Umbundu",
    traducao: "Olá / Saudação soberana / O Mar",
    pronuncia: "Kah-loon-gah",
    categoria: "Saudação & Substantivo",
    explicacao_cultural: "Saudação nobre no planalto central angolano (Huambo, Bié, Benguela), evocando a vastidão do mar e da divindade.",
    nivel_nome: "Iniciante",
    exemplo_contexto_1: "Kalunga, a vamanji! Wakolapo?",
    exemplo_contexto_1_traducao: "Olá, irmãos! Vocês estão com saúde?",
    exemplo_contexto_2: "Kalunga veya ciwa vokati ketu.",
    exemplo_contexto_2_traducao: "Sejam muito bem-vindos ao nosso convívio.",
    exemplo_contexto_3: "Tuenda ko Kalunga okupaleka oluali.",
    exemplo_contexto_3_traducao: "Vamos ao mar contemplar o mundo."
  },
  {
    termo_original: "Ombembwa",
    idioma_nome: "Umbundu",
    traducao: "Paz / Concórdia",
    pronuncia: "Ohm-behm-bwah",
    categoria: "Substantivo",
    explicacao_cultural: "O valor supremo de reconciliação e harmonia social entre as famílias de Ovimbundu.",
    nivel_nome: "Médio",
    exemplo_contexto_1: "Tu yongola ombembwa vofeka yetu.",
    exemplo_contexto_1_traducao: "Queremos paz e concórdia em nossa terra.",
    exemplo_contexto_2: "Ombembwa yitwala esanju.",
    exemplo_contexto_2_traducao: "A paz traz alegria a todos.",
    exemplo_contexto_3: "Tu kale lombembwa la vakwetu.",
    exemplo_contexto_3_traducao: "Vivamos em paz com nossos semelhantes."
  },

  // --- ENGLISH ---
  {
    termo_original: "Serendipity",
    idioma_nome: "Inglês",
    traducao: "Serendipidade / Descoberta feliz e inesperada",
    pronuncia: "/ˌser.ənˈdɪp.ə.t̬i/",
    categoria: "Substantivo",
    explicacao_cultural: "Criado em 1754 por Horace Walpole, baseado no conto persa 'Os Três Príncipes de Serendip'. Descreve acasos afortunados.",
    nivel_nome: "Avançado",
    exemplo_contexto_1: "Finding this rare bilingual dictionary was pure serendipity.",
    exemplo_contexto_1_traducao: "Encontrar este raro dicionário bilíngue foi pura serendipidade.",
    exemplo_contexto_2: "Scientific breakthroughs often involve a touch of serendipity.",
    exemplo_contexto_2_traducao: "Avanços científicos frequentemente envolvem um toque de feliz acaso.",
    exemplo_contexto_3: "They met by serendipity at a bookstore in London.",
    exemplo_contexto_3_traducao: "Eles se conheceram por feliz coincidência em uma livraria em Londres."
  },
  {
    termo_original: "Resilience",
    idioma_nome: "Inglês",
    traducao: "Resiliência / Capacidade de superação",
    pronuncia: "/rɪˈzɪl.jəns/",
    categoria: "Substantivo",
    explicacao_cultural: "Um dos traços de personalidade mais valorizados na comunicação e liderança global moderna.",
    nivel_nome: "Intermediário",
    exemplo_contexto_1: "Linguistic resilience means never giving up after making grammar errors.",
    exemplo_contexto_1_traducao: "Resiliência linguística significa nunca desistir após cometer erros gramaticais.",
    exemplo_contexto_2: "She demonstrated incredible resilience throughout her studies.",
    exemplo_contexto_2_traducao: "Ela demonstrou uma resiliência incrível ao longo de seus estudos.",
    exemplo_contexto_3: "Resilience turns obstacles into stepping stones.",
    exemplo_contexto_3_traducao: "A resiliência transforma obstáculos em degraus de evolução."
  },

  // --- FRENCH ---
  {
    termo_original: "Effervescence",
    idioma_nome: "Francês",
    traducao: "Efervescência / Entusiasmo contagiante",
    pronuncia: "/e.fɛʁ.vɛ.sɑ̃s/",
    categoria: "Substantivo",
    explicacao_cultural: "Muito empregado na vida cultural parisiense para descrever momentos de intensa criatividade.",
    nivel_nome: "Avançado",
    exemplo_contexto_1: "Une grande effervescence régnait dans les rues de Paris.",
    exemplo_contexto_1_traducao: "Uma grande efervescência reinava nas ruas de Paris.",
    exemplo_contexto_2: "L'effervescence intellectuelle de ce salon linguistique est inspirante.",
    exemplo_contexto_2_traducao: "A efervescência intelectual deste salão linguístico é inspiradora.",
    exemplo_contexto_3: "Le festival a créé une belle effervescence artistique.",
    exemplo_contexto_3_traducao: "O festival criou uma bela efervescência artística."
  },

  // --- GERMAN ---
  {
    termo_original: "Weltschmerz",
    idioma_nome: "Alemão",
    traducao: "Dor do mundo / Melancolia existencial",
    pronuncia: "/ˈvɛlt.ʃmɛɐ̯ts/",
    categoria: "Substantivo",
    explicacao_cultural: "Conceito filosófico e literário do Romantismo alemão (cunhado por Jean Paul).",
    nivel_nome: "Avançado",
    exemplo_contexto_1: "Der Dichter drückte seinen tiefen Weltschmerz in Versen aus.",
    exemplo_contexto_1_traducao: "O poeta expressou sua profunda dor do mundo em versos.",
    exemplo_contexto_2: "Weltschmerz kann durch Musik in Trost verwandelt werden.",
    exemplo_contexto_2_traducao: "O Weltschmerz pode ser transformado em consolo através da música.",
    exemplo_contexto_3: "Viele Philosophen haben über das Phänomen des Weltschmerzes geschrieben.",
    exemplo_contexto_3_traducao: "Muitos filósofos escreveram sobre o fenômeno do Weltschmerz."
  },

  // --- SPANISH ---
  {
    termo_original: "Sobremesa",
    idioma_nome: "Espanhol",
    traducao: "Sobremesa / Conversa prolongada após a refeição",
    pronuncia: "/so.βɾeˈme.sa/",
    categoria: "Substantivo & Tradição",
    explicacao_cultural: "Tradição hispânica insubstituível de permanecer à mesa conversando afetuosamente horas após a refeição.",
    nivel_nome: "Intermediário",
    exemplo_contexto_1: "La sobremesa familiar los domingos duró más de dos horas.",
    exemplo_contexto_1_traducao: "A sobremesa familiar de domingo durou mais de duas horas.",
    exemplo_contexto_2: "Disfrutamos de una maravillosa sobremesa con amigos.",
    exemplo_contexto_2_traducao: "Aproveitamos uma sobremesa maravilhosa com amigos.",
    exemplo_contexto_3: "La sobremesa es el alma de la hospitalidad española.",
    exemplo_contexto_3_traducao: "A sobremesa é a alma da hospitalidade espanhola."
  },

  // --- LATIN ---
  {
    termo_original: "Carpe Diem",
    idioma_nome: "Latim",
    traducao: "Aproveite o dia / Colha o momento",
    pronuncia: "/ˈkar.pe ˈdi.em/",
    categoria: "Locução Filosófica",
    explicacao_cultural: "Verso célebre do poeta romano Horácio em suas Odes (I, 11). Convite a viver com sabedoria e intensidade.",
    nivel_nome: "Clássico",
    exemplo_contexto_1: "Carpe diem, quam minimum credula postero.",
    exemplo_contexto_1_traducao: "Aproveite o dia de hoje, confiando o mínimo no incerto amanhã.",
    exemplo_contexto_2: "Vitam sapienter age et carpe diem.",
    exemplo_contexto_2_traducao: "Conduza a vida sabiamente e colha cada dia.",
    exemplo_contexto_3: "Carpe diem est sententia poetarum omnium aetatum.",
    exemplo_contexto_3_traducao: "Carpe diem é a máxima dos poetas de todas as épocas."
  }
];

// High-speed lexical search function
export function searchCuratedDictionary(
  query: string,
  idiomaFilter: string = "Todos"
): CuratedDictWord[] {
  const cleanQ = query.trim().toLowerCase();
  
  let dataset = CURATED_DICTIONARY;
  if (idiomaFilter && idiomaFilter !== "Todos") {
    dataset = dataset.filter(
      item => item.idioma_nome.toLowerCase() === idiomaFilter.toLowerCase()
    );
  }

  if (!cleanQ) {
    return dataset.slice(0, 8);
  }

  return dataset.filter(item => 
    item.termo_original.toLowerCase().includes(cleanQ) ||
    item.traducao.toLowerCase().includes(cleanQ) ||
    item.explicacao_cultural.toLowerCase().includes(cleanQ) ||
    item.exemplo_contexto_1.toLowerCase().includes(cleanQ)
  );
}
