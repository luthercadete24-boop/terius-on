import fs from "fs";
import path from "path";
import { AppDatabase, Usuario, Idioma, Nivel, ProgressoUsuario, Licao, Vocabulario, Gramatica, ProvaFinal, QuestaoProva, CalendarioEstudos } from "./types.js";

const DB_FILE = path.join(process.cwd(), "app_database.json");

// Helper function to create the initial seed database
function getGeneratedLicaoTitle(idioma: string, level: string, lessonIndex: number): string {
  const levelPt = level === "Intermediario" ? "Intermediário" : level === "Medio" ? "Médio" : "Avançado";
  const topics: Record<string, string[]> = {
    "Inglês": [
      "Conversação no Dia a Dia",
      "Expressões de Negócios e Networking",
      "Vocabulário de Viagens e Direções",
      "Terminologia Tecnológica",
      "Arte, Entretenimento e Mídia",
      "Clima, Meio Ambiente e Natureza",
      "Saúde, Bem-estar e Exercício",
      "Discussões Sociais e Atualidades",
      "Planejamento de Carreira",
      "Interações Sociais Avançadas"
    ],
    "Espanhol": [
      "Conversación Cotidiana",
      "Expresiones de Negocios",
      "Vocabulario de Viajes",
      "Terminología Tecnológica",
      "Arte y Entretenimiento",
      "Clima y Naturaleza",
      "Salud y Bienestar",
      "Discusiones Sociales",
      "Planeamiento de Carrera",
      "Interacciones Avanzadas"
    ],
    "Francês": [
      "Conversation Quotidienne",
      "Expressions Professionnelles",
      "Vocabulaire de Voyage",
      "Terminologie Technologique",
      "Art et Divertissement",
      "Climat et Nature",
      "Santé et Bien-être",
      "Discussions Sociales",
      "Planification de Carrière",
      "Interactions Avancées"
    ],
    "Alemão": [
      "Alltägliche Konversation",
      "Geschäftsausdrücke",
      "Reisevokabeln",
      "Technologische Begriffe",
      "Kunst und Unterhaltung",
      "Klima und Natur",
      "Gesundheit und Wellness",
      "Soziale Diskussionen",
      "Karriereplanung",
      "Fortgeschrittene Interaktionen"
    ],
    "Latim": [
      "Sermo Quotidianus",
      "Proverbia et Sententiae",
      "Iter et Viae",
      "Ars et Litterae",
      "Natura et Caelum",
      "Corpus et Salus",
      "Civitas et Societas",
      "Leges et Philosophia",
      "Historia et Scripta",
      "Sapientia Antiqua"
    ],
    "Lingala": [
      "Kosolola na tongo",
      "Kosala na Ndaku",
      "Kozwa nzela monene",
      "Kolia na biloko kitoko",
      "Miziki na Congo",
      "Kotanga mikanda na Lingala",
      "Koloba mpo na ndako",
      "Moyibi na makambo kitoko",
      "Boyokani na baninga",
      "Mayele ya bankoko"
    ],
    "Kimbundu": [
      "Kiambote o muadi",
      "Kudia ni kunua",
      "Njila ia mukandu",
      "Kukita mu kitadi",
      "Kuxima kua kidi",
      "Kuimba kua ngola",
      "Kikalaku kiambote",
      "Ukaza na muenhu",
      "Kizola kia usendo",
      "Mulonga ua undenge"
    ],
    "Italiano": [
      "Conversazione Quotidiana",
      "Espressioni di Business e Networking",
      "Vocabolario di Viaggio e Direzioni",
      "Terminologia Tecnologica",
      "Arte, Intrattenimento e Media",
      "Clima, Ambiente e Natura",
      "Salute, Benessere ed Esercizio",
      "Discussioni Sociali e Attualità",
      "Pianificazione della Carriera",
      "Interazioni Sociali Avanzate"
    ]
  };

  const list = topics[idioma] || topics["Inglês"];
  return `${list[lessonIndex - 1] || "Estudos Adicionais"} (${levelPt} - L${lessonIndex})`;
}

function getGeneratedExplicacaoProfunda(idioma: string, level: string, lessonIndex: number): string {
  const levelPt = level === "Intermediario" ? "Intermediário" : level === "Medio" ? "Médio" : "Avançado";
  
  const explanations: Record<string, string[]> = {
    "Inglês": [
      `### Conversação no Dia a Dia e Comunicação Integrada

A conversação cotidiana no nível Intermediário exige ir além das respostas automáticas de sim ou não. O fundamental aqui é aprender a sustentar conversas fluidas usando iniciadores de conversa (*conversation starters*) e conectivos refinados de ligação lógica.

#### 📌 Estruturas Fundamentais de Frase:
1. **Active Listening**: Demonstre engajamento ativo por meio de marcadores de discurso como:
   - *"Absolutely, I completely agree with your point of view."* (Com certeza, concordo totalmente com seu ponto de vista.)
   - *"Right, that makes perfect sense to me."* (Certo, isso faz todo sentido para mim.)
2. **Expressão de Incerteza ou Opinião Suave**: Utilize fórmulas polidas para debater sem soar agressivo:
   - *"As far as I know, there are better alternatives to explore."* (Até onde eu sei, existem alternativas melhores a serem exploradas.)
   - *"I suppose we could reconsider our initial plan."* (Suponho que poderíamos reconsiderar nosso plano inicial.)

#### 🗣️ Uso Prático e Dica Cultural:
Em países de língua inglesa, o silêncio durante uma conversa pode causar desconforto social. O uso de *filler words* (palavras de preenchimento) como *"well"*, *"actually"* ou *"you see"* de forma moderada demonstra domínio e mantém a conversa em um fluxo amigável e natural.`,
      
      `### Expressões de Negócios e Networking Corporativo

No ambiente de negócios internacional, a comunicação em inglês é altamente pautada pela cortesia indireta (*indirect politeness*) e o uso frequente de jargões corporativos corporados (*business jargon*).

#### 📌 Estruturas Fundamentais de Frase:
1. **Pedidos Indiretos e Suavizados**: Evite imperativos diretos. Prefira usar verbos modais e estruturas em formato de pergunta:
   - *"Could you please look into this issue as soon as possible?"* (Você poderia, por favor, averiguar este problema o mais rápido possível?)
   - *"I was wondering if we could schedule a quick sync."* (Estava me perguntando se poderíamos agendar uma rápida sincronização.)
2. **Uso de Jargões Profissionais**: Integre expressões idiomáticas de negócios para soar natural:
   - *"Let's make sure we are all on the same page."* (Vamos garantir que estamos todos na mesma página/alinhados.)
   - *"We should touch base next week to discuss the outcomes."* (Devemos entrar em contato na próxima semana para discutir os resultados.)

#### 🗣️ Uso Prático e Dica Cultural:
Em reuniões de negócios globais, é padrão dedicar os primeiros 3 a 5 minutos para a chamada *small talk* (conversa informal rápida sobre o final de semana, o clima ou viagens). Ir direto ao assunto sem essa introdução social pode parecer grosseiro ou impessoal em muitas culturas anglófonas.`,
      
      `### Vocabulário de Viagens, Direções e Navegação Global

Viajar com total autonomia exige dominar o vocabulário para aeroportos, hotéis, transportes urbanos e situações de imprevisto, bem como compreender direções dadas por nativos de forma clara.

#### 📌 Estruturas Fundamentais de Frase:
1. **Perguntas Indiretas**: São essenciais para pedir ajuda a estranhos de maneira polida:
   - *"Excuse me, do you happen to know where the nearest subway station is?"* (Com licença, você por acaso saberia onde fica a estação de metrô mais próxima?)
   - *"Could you please tell me how to get to the historic center?"* (Você poderia, por favor, me dizer como chegar ao centro histórico?)
2. **Expressando Necessidades Fisiológicas ou Logísticas**:
   - *"I'd like to make a reservation under the name of Smith."* (Gostaria de fazer uma reserva em nome de Smith.)
   - *"Is there a shuttle service that goes directly to the airport?"* (Existe um serviço de transfer que vai direto para o aeroporto?)

#### 🗣️ Uso Prático e Dica Cultural:
Fique atento às variações regionais: o sistema de metrô é chamado de *subway* nos EUA, *underground* ou *tube* em Londres, e *metro* na Europa Continental. Ao pedir informações, comece sempre com *"Excuse me"* e finalize com *"Thank you so much for your help"*.`,
      
      `### Terminologia Tecnológica e Era Digital

Discutir tecnologia em inglês envolve falar sobre inteligência artificial, segurança de dados, desenvolvimento de software e comportamento nas redes sociais, usando verbos frasais específicos.

#### 📌 Estruturas Fundamentais de Frase:
1. **Uso de Phrasal Verbs Tecnológicos**:
   - *"Don't forget to back up your critical files to the cloud."* (Não se esqueça de fazer cópia de segurança dos seus arquivos críticos na nuvem.)
   - *"I need to troubleshoot this connection issue before the meeting."* (Preciso diagnosticar/resolver este problema de conexão antes da reunião.)
2. **Descrevendo Qualidades de Sistemas**:
   - *"This new application is extremely user-friendly."* (Este novo aplicativo é extremamente fácil de usar.)
   - *"We are investing in cutting-edge technology to protect user data."* (Estamos investindo em tecnologia de ponta para proteger os dados dos usuários.)

#### 🗣️ Uso Prático e Dica Cultural:
O vocabulário tecnológico em inglês é amplamente utilizado em todo o mundo corporativo. No entanto, é vital pronunciá-lo corretamente. Palavras como *"software"*, *"hardware"*, *"data"* (que se pronuncia /deita/) e *"cybersecurity"* são de uso diário em empresas brasileiras de TI, mas o domínio da pronúncia correta impulsiona carreiras globais.`,
      
      `### Arte, Entretenimento e Mídia de Massa

Esta lição aborda como analisar e expressar opiniões detalhadas sobre filmes, séries, livros, música e artes plásticas, exercitando a argumentação estética refinada.

#### 📌 Estruturas Fundamentais de Frase:
1. **Adjetivos Críticos e Descritivos**:
   - *"The plot of the movie was incredibly thought-provoking and complex."* (O enredo do filme foi incrivelmente instigante e complexo.)
   - *"She delivered a stellar performance that captivated the entire audience."* (Ela entregou uma performance estelar que cativou todo o público.)
2. **Expressando Preferências Qualificadas**:
   - *"In my opinion, the book is by far much more detailed than the film adaptation."* (Na minha opinião, o livro é de longe muito mais detalhado que a adaptação cinematográfica.)
   - *"It is a masterpiece that highlights the social struggles of that era."* (É uma obra-prima que destaca as lutas sociais daquela época.)

#### 🗣️ Uso Prático e Dica Cultural:
Ao conversar sobre arte, evite julgamentos excessivamente simplistas como *"it is good"* ou *"it is bad"*. Utilizar adjetivos ricos como *"masterpiece"*, *"overrated"*, *"underwhelming"* ou *"breathtaking"* enriquece seu discurso e demonstra alto nível intelectual.`,
      
      `### Clima, Meio Ambiente e Sustentabilidade

Aprenda a discutir as mudanças climáticas, conservação ambiental, recursos renováveis e o impacto humano na biodiversidade terrestre.

#### 📌 Estruturas Fundamentais de Frase:
1. **Relações de Causa e Efeito Ecológicas**:
   - *"Deforestation leads to a massive loss of biodiversity in tropical regions."* (O desmatamento leva a uma perda massiva de biodiversidade em regiões tropicais.)
   - *"Global warming stems from the high emission of greenhouse gases."* (O aquecimento global origina-se da alta emissão de gases de efeito estufa.)
2. **Propondo Soluções de Conservação**:
   - *"We must reduce our carbon footprint by utilizing renewable energy sources."* (Devemos reduzir nossa pegada de carbono utilizando fontes de energia renováveis.)
   - *"Recycling and reducing plastic waste are essential steps towards sustainability."* (Reciclar e reduzir o lixo plástico são passos essenciais rumo à sustentabilidade.)

#### 🗣️ Uso Prático e Dica Cultural:
Em países desenvolvidos, discussões sobre reciclagem e a correta separação de lixo residencial (*sorting waste*) são de extrema importância no cotidiano. O desconhecimento de regras locais de reciclagem pode inclusive acarretar multas pesadas para moradores de países europeus.`,
      
      `### Saúde, Bem-estar e Prática de Exercícios

Aborda o vocabulário para descrever sintomas médicos, hábitos de vida saudáveis, saúde mental e atividades de condicionamento físico no dia a dia.

#### 📌 Estruturas Fundamentais de Frase:
1. **Descrevendo Sintomas e Sensações Corporais**:
   - *"I have been experiencing a dull ache in my lower back lately."* (Tenho sentido uma dor contínua e leve na região lombar ultimamente.)
   - *"I feel dizzy and need to lie down for a few minutes."* (Sinto-me tonto e preciso me deitar por alguns minutos.)
2. **Hábitos de Vida e Phrasal Verbs de Saúde**:
   - *"I decided to cut down on sugar and work out at least three times a week."* (Decidi reduzir o consumo de açúcar e me exercitar pelo menos três vezes por semana.)
   - *"She has finally given up smoking to improve her lung capacity."* (Ela finalmente desistiu/parou de fumar para melhorar sua capacidade pulmonar.)

#### 🗣️ Uso Prático e Dica Cultural:
Em consultas de saúde ou farmácias estrangeiras, saiba diferenciar as dores: *ache* refere-se a uma dor constante e incômoda (como *headache*, *toothache*, *backache*), enquanto *pain* é uma dor mais aguda e física. Para dores de cabeça intensas, usa-se o termo idiomático *"splitting headache"*.`,
      
      `### Discussões Sociais, Notícias e Atualidades

Falar sobre eventos globais, notícias atuais e questões sociais requer vocabulário político, econômico e ético apropriado para debates estruturados.

#### 📌 Estruturas Fundamentais de Frase:
1. **Marcadores de Debate e Contraste**:
   - *"On the one hand, technology connects people; on the other hand, it can isolate them."* (Por um lado, a tecnologia conecta as pessoas; por outro lado, pode isolá-las.)
   - *"We must address social inequality, nevertheless we also need economic growth."* (Devemos abordar a desigualdade social, no entanto, também precisamos de crescimento econômico.)
2. **Expressando Concordâncias Parciais**:
   - *"I agree with you to a certain extent, but we must also consider the costs."* (Concordo com você até certo ponto, mas também devemos considerar os custos.)

#### 🗣️ Uso Prático e Dica Cultural:
Nos debates culturais em países anglófonos, preza-se muito a objetividade e a cortesia no desacordo (*agree to disagree*). Usar estruturas como *"I understand your point, however..."* é muito mais respeitoso do que dizer *"You are wrong"*.`,
      
      `### Planejamento de Carreira e Entrevistas de Emprego

O foco desta seção é preparar o estudante para falar sobre suas qualificações, histórico profissional, pontos fortes e metas de carreira futuras com máxima confiança.

#### 📌 Estruturas Fundamentais de Frase:
1. **Uso de Verbos de Ação de Alto Impacto (Power Verbs)**:
   - *"During my previous role, I spearheaded the migration of our system database."* (No meu cargo anterior, liderei a migração do nosso banco de dados do sistema.)
   - *"I successfully managed to reduce operation costs by fifteen percent."* (Consegui com sucesso reduzir os custos operacionais em quinze por cento.)
2. **Expressando Metas de Longo Prazo**:
   - *"In five years, I envision myself leading an international engineering team."* (Em cinco anos, vejo-me liderando uma equipe internacional de engenharia.)
   - *"I am highly motivated to acquire more expertise in cloud architecture."* (Estou altamente motivado a adquirir mais especialização em arquitetura de nuvem.)

#### 🗣️ Uso Prático e Dica Cultural:
Em entrevistas americanas e britânicas, as respostas devem seguir o método **STAR** (Situação, Tarefa, Ação e Resultado). Ao falar das suas realizações, use *"I"* (Eu) para frisar suas contribuições exatas, em vez de se esconder atrás de um genérico *"We"* (Nós).`,
      
      `### Interações Sociais Avançadas e Nuances Idiomáticas

Esta lição foca em expressões idiomáticas avançadas, piadas, sutilezas sarcásticas e jargões culturais que ajudam o aluno a atingir um nível equivalente ao nativo.

#### 📌 Estruturas Fundamentais de Frase:
1. **Uso de Expressões Idiomáticas Clássicas**:
   - *"We need to bite the bullet and invest in this expensive upgrade."* (Precisamos encarar a situação difícil e investir nesta atualização cara.)
   - *"You absolutely hit the nail on the head with that explanation."* (Você absolutamente acertou em cheio na mosca com essa explicação.)
2. **Mitigadores Sociais**:
   - *"Could you tell me if she is a bit under the weather today?"* (Você poderia me dizer se ela está um pouco indisposta/doente hoje?)

#### 🗣️ Uso Prático e Dica Cultural:
O humor britânico é famoso pelo uso do *understatement* (minimizar a importância de algo sério) e do sarcasmo sutil, quase inexpressivo (*deadpan*). Já o humor americano tende a ser mais enérgico e verbalmente expressivo.`
    ],
    "Espanhol": [
      `### Conversación Cotidiana y Expresiones del Día a Día

La fluidez en el día a día exige ir más allá de los diálogos robóticos de manual escolar. Esta lección se enfoca en el uso de conectores conversacionales y modismos cotidianos de uso constante en España e Hispanoamérica.

#### 📌 Estruturas Fundamentais de Frase:
1. **Uso de Conectores Conversacionais**:
   - *"De hecho, me parece que tu propuesta es la mejor opción para todos."* (De fato, me parece que sua proposta é a melhor opção para todos.)
   - *"Por cierto, ¿ya terminaste de leer el informe que te envié?"* (A propósito, você já terminou de ler o relatório que te enviei?)
2. **Garantindo Fluidez e Coesão**:
   - *"O sea, lo que quieres decir es que no tenemos tiempo suficiente."* (Ou seja, o que você quer dizer é que não temos tempo suficiente.)

#### 🗣️ Uso Prático e Dica Cultural:
O espanhol falado possui uma riqueza extraordinária de conectores de acordo e empatia. Expressões como *"¡Claro!"*, *"Desde luego"* ou *"Exacto"* são fundamentais para demonstrar engajamento ativo no diálogo. O uso correto de *"De hecho"* estabelece um tom de sofisticação e precisão no discurso.`,
      
      `### Expresiones de Negocios y Lenguaje Profesional

El ámbito laboral hispanohablante valora el equilibrio entre la formalidad respetuosa escrita y una interacción personal cálida y cercana en el día a día.

#### 📌 Estruturas Fundamentais de Frase:
1. **Fórmulas de Tratamento Formal**:
   - *"Estimado señor García, le escribo para solicitar una reunión técnica."* (Prezado senhor García, escrevo-lhe para solicitar uma reunião técnica.)
   - *"Quedo a su entera disposición para cualquier aclaración adicional."* (Fico à sua inteira disposição para qualquer esclarecimento adicional.)
2. **Suavização de Propostas e Negociação**:
   - *"Me gustaría presentarles una propuesta de colaboración estratégica."* (Gostaria de apresentar-lhes uma proposta de colaboração estratégica.)
   - *"Sería muy conveniente revisar los términos de entrega de este mes."* (Seria muito conveniente revisar os termos de entrega deste mês.)

#### 🗣️ Uso Prático e Dica Cultural:
Diferente do ambiente corporativo anglófono, o mundo dos negócios em espanhol valoriza imensamente as relações interpessoais prévias. Dedicar os primeiros minutos a perguntar sinceramente pela família ou saúde do seu interlocutor é considerado excelente etiqueta de negócios.`,
      
      `### Viajes, Direcciones y Navegación en Ciudades

Dominar el vocabulario para ubicarse, tomar transporte público y pedir ayuda de emergencia de forma natural en cualquier país de habla hispana.

#### 📌 Estruturas Fundamentais de Frase:
1. **Pedindo Direções com Polidez**:
   - *"Disculpe, ¿podría indicarme cómo llegar a la catedral desde aquí?"* (Com licença, você poderia me indicar como chegar à catedral a partir daqui?)
   - *"Siga todo recto y luego gire en la segunda calle a la izquierda."* (Siga reto e depois vire na segunda rua à esquerda.)
2. **Gerenciando Logística de Viagem**:
   - *"¿Dónde puedo adquirir un billete para el tren de alta velocidad?"* (Onde posso adquirir um bilhete para o trem de alta velocidade?)
   - *"¿A qué hora pasa el próximo autobús hacia el aeropuerto?"* (A que horas passa o próximo ônibus em direção ao aeroporto?)

#### 🗣️ Uso Prático e Dica Cultural:
Fique atento às ricas variações regionais do espanhol: para "ônibus" usa-se *autobús* na Espanha, *colectivo* na Argentina, *guagua* em Cuba e República Dominicana, e *camión* no México. Conhecer essas diferenças locais demonstra profundo respeito cultural.`,
      
      `### Tecnología, Redes Sociales y Era Digital

La comunicación digital en español cuenta con términos específicos sumamente integrados al habla cotidiana de millones de usuarios de internet.

#### 📌 Estruturas Fundamentais de Frase:
1. **Verbos Digitais e de Segurança**:
   - *"Te aconsejo descargar el archivo adjunto únicamente por la red Wi-Fi."* (Aconselho você a baixar o arquivo anexo unicamente através da rede Wi-Fi.)
   - *"Es fundamental actualizar tu contraseña de seguridad periódicamente."* (É fundamental atualizar sua senha de segurança periodicamente.)
2. **Comunicação em Plataformas de Mensagens**:
   - *"He realizado una copia de seguridad de todos nuestros chats grupales."* (Realizei uma cópia de segurança de todas as nossas conversas em grupo.)
   - *"No te olvides de compartir la ubicación exacta del evento."* (Não se esqueça de compartilhar a localização exata do evento.)

#### 🗣️ Uso Prático e Dica Cultural:
Termos oriundos do inglês são frequentemente adaptados e conjugados em espanhol, como os verbos *chatear* (conversar online), *escanear* (digitalizar) e *cliquear* (clicar). Contudo, a Real Academia Española (RAE) sempre recomenda priorizar termos genuínos como *compartir* ou *descargar*.`
    ],
    "Francês": [
      `### Conversation Quotidienne et Interactions Sociales

La conversation courante en français exige de maîtriser l'art de la politesse et de savoir naviguer de façon fluide entre les différents registres de langue.

#### 📌 Estruturas Fundamentais de Frase:
1. **Uso de Conectores de Fluidez**:
   - *"En fait, je pense que vous devriez prendre un raccourci pour y arriver."* (Na verdade, acho que você deveria pegar um atalho para chegar lá.)
   - *"Du coup, nous avons décidé de reporter la rencontre à demain matin."* (Portanto/Então, decidimos adiar o encontro para amanhã de manhã.)
2. **Garantindo Polidez e Respeito (Vouvoiement)**:
   - *"S'il vous plaît, pourriez-vous m'indiquer la direction du musée ?"* (Por favor, você poderia me indicar a direção do museu?)

#### 🗣️ Uso Prático e Dica Cultural:
Na França, o uso do pronome *"vous"* (vouvoiement) com pessoas que você não conhece intimamente, comerciantes ou autoridades é uma regra de convivência inegociável. Iniciar qualquer interação, seja em um balcão ou na rua, sem um claro *"Bonjour"* é considerado extremamente rude e inadequado.`,
      
      `### Expressions Professionnelles et Affaires

Le monde professionnel francophone est caractérisé par un haut degré de formalisme à l'écrit et le respect rigoureux des protocoles de communication.

#### 📌 Estruturas Fundamentais de Frase:
1. **Fórmulas de Polidez Escrita**:
   - *"Je vous prie d'agréer, Monsieur, l'expression de mes salutations distinguées."* (Peço-lhe que aceite, Senhor, a expressão das minhas distinta saudações.)
   - *"Je reste à votre entière disposition pour tout renseignement complémentaire."* (Fico à sua inteira disposição para qualquer informação complementar.)
2. **Acompanhamento de Metas de Projetos**:
   - *"Nous devons respecter la date limite pour rendre ce compte rendu."* (Devemos respeitar o prazo final para entregar este relatório/ata.)
   - *"La réunion de cadrage aura lieu à quatorze heures précises."* (A reunião de alinhamento ocorrerá às quatorze horas em ponto.)

#### 🗣️ Uso Prático e Dica Cultural:
A redação de e-mails profissionais em francês exige um vocabulário polido e formal muito específico. Evite traduções literais do português que possam soar excessivamente informais. Fórmulas clássicas de encerramento como *"Cordialement"* ou *"Bien à vous"* são amplamente aceitas e recomendadas.`
    ]
  };

  const list = explanations[idioma];
  if (list) {
    const item = list[(lessonIndex - 1) % list.length];
    if (item) return item;
  }

  // Custom detailed explanations for Alemão, Latim, Lingala, Kimbundu
  if (idioma === "Alemão") {
    if (lessonIndex % 2 === 1) {
      return `### Pronúncia, Gêneros e Artigos (Alemão Essencial)

A língua alemã é conhecida por sua estrutura altamente lógica e seus três gêneros gramaticais bem definidos: masculino (*der*), feminino (*die*) e neutro (*das*).

#### 📌 Estruturas Fundamentais de Frase:
1. **Apresentação de Objetos com Gênero**:
   - *"Das ist ein interessantes Buch."* (Este é um livro interessante - gênero neutro.)
   - *"Der Tisch in der Küche ist sehr groß."* (A mesa na cozinha é muito grande - gênero masculino.)
2. **Uso de Conectores Básicos**:
   - *"Ich lerne Deutsch, weil es mir im Alltag ajuda."* (Estou aprendendo alemão porque me ajuda no dia a dia.)

#### 🗣️ Uso Prático e Dica Cultural:
No alemão, os gêneros das palavras frequentemente não coincidem com o português. Por exemplo, *"a menina"* (*das Mädchen*) é uma palavra gramaticalmente neutra. A melhor estratégia é memorizar sempre o substantivo acompanhado de seu artigo correspondente!`;
    } else {
      return `### Satzstruktur und das Verb an zweiter Stelle (V2 Rule)

A posição do verbo na frase alemã é sagrada. Nas orações principais declarativas, o verbo conjugado ocupa estritamente a segunda posição gramatical (*V2*).

#### 📌 Estruturas Fundamentais de Frase:
1. **Estrutura com Advérbio Inicial**:
   - *"Heute gehe ich mit meinen Kollegen zur Arbeit."* (Hoje eu vou ao trabalho com os meus colegas - o sujeito vai para depois do verbo.)
   - *"Jetzt machen wir eine kurze Pause."* (Agora nós fazemos uma pequena pausa.)
2. **Frases Coordenadas**:
   - *"Ich mag Kaffee, aber ich trinke auch gerne Tee."* (Eu gosto de café, mas também bebo chá com prazer.)

#### 🗣️ Uso Prático e Dica Cultural:
Se você iniciar sua oração principal com qualquer informação de tempo ou lugar (como *"Heute"* ou *"In der Stadt"*), o sujeito é obrigado a se deslocar para a terceira posição, imediatamente após o verbo conjugado. Essa inversão é um sinal clássico de domínio da gramática alemã.`;
    }
  }

  if (idioma === "Latim") {
    if (lessonIndex % 2 === 1) {
      return `### Casos Gramaticais: Nominativo e Acusativo (Fundamentos do Latim)

O latim é uma língua clássica flexiva. Isso significa que a função das palavras na frase é determinada por suas desinências (sufixos finais), e não pela ordem das palavras.

#### 📌 Estruturas Fundamentais de Frase:
1. **Oração Transitiva Direta Clássica**:
   - *"Amicus librum magnum legit."* (O amigo lê o livro grande - *librum* indica o objeto direto.)
   - *"Puella pulchra rosam amat."* (A bela garota ama a rosa - *rosam* indica acusativo feminino.)
2. **Oração com Verbo de Ligação**:
   - *"Errare humanum est."* (Errar é humano - o verbo *esse* normalmente se posiciona no fim.)

#### 🗣️ Uso Prático e Dica Cultural:
Em latim, não existem artigos definidos ou indefinidos (como 'o', 'a', 'um', 'uma'). A palavra *"amicus"* pode traduzir-se como "o amigo" ou "um amigo", dependendo puramente do contexto. Preste muita atenção às terminações!`;
    } else {
      return `### O Verbo "Esse" (Ser/Estar) e a Ordem das Palavras

O verbo *"esse"* desempenha um papel fundamental na articulação do pensamento filosófico romano, servindo de elo de ligação entre o sujeito e suas qualidades.

#### 📌 Estruturas Fundamentais de Frase:
1. **Declaração de Existência ou Estado**:
   - *"Est in agro magna virtus et fides."* (Há no campo grande virtude e lealdade.)
   - *"Fortuna caeca est."* (A fortuna é cega.)
2. **Concordância de Caso**:
   - *"Nemo sine culpa est."* (Ninguém está livre de culpa.)

#### 🗣️ Uso Prático e Dica Cultural:
Embora a ordem das palavras em latim seja bastante livre devido ao sistema de declinações, o verbo tende a migrar para o final absoluto da frase na prosa clássica de autores consagrados como Cícero e Júlio César.`;
    }
  }

  if (idioma === "Lingala") {
    if (lessonIndex % 2 === 1) {
      return `### Classes de Nomes e Sistema de Concordância do Lingala

O Lingala é uma língua banta falada em ambos os Congos. Ela se apoia em um sistema dinâmico de classes de nomes com prefixos que alternam entre o singular e o plural.

#### 📌 Estruturas Fundamentais de Frase:
1. **Cumprimentos e Saudação de Bem-Estar**:
   - *"Mbote na yo, ndeko! Ozali malamu?"* (Olá para você, irmão/irmã! Você está bem?)
   - *"Nazali malamu mpenza, matondo!"* (Estou muito bem, obrigado!)
2. **Apresentação Pessoal**:
   - *"Nazali koyekola Lingala mpo na koloba na baninga."* (Estou estudando Lingala para falar com os amigos.)

#### 🗣️ Uso Prático e Dica Cultural:
A língua Lingala possui um caráter extremamente melódico e rítmico. Os prefixos nos nomes mudam radicalmente: por exemplo, *"moto"* significa uma pessoa, enquanto *"bato"* significa pessoas. Preste muita atenção a esses prefixos!`;
    } else {
      return `### Prefixos Verbais de Sujeito e Tempo Presente

Em Lingala, os verbos são compostos colando-se um prefixo de sujeito antes do radical verbal, permitindo conjugar qualquer verbo com máxima regularidade.

#### 📌 Estruturas Fundamentais de Frase:
1. **Ações Cotidianas**:
   - *"Nazo kende na wenze kosomba mampa."* (Estou indo ao mercado comprar pães - *na-* para 'eu'.)
   - *"Boni mosala ezali kokende lelo?"* (Como o trabalho está indo hoje? - *e-* para classe impessoal.)
2. **Expressão de Desejos**:
   - *"Toya kolia kitoko elongo."* (Vamos comer bem juntos.)

#### 🗣️ Uso Prático e Dica Cultural:
Nas capitais de Kinshasa e Brazzaville, o Lingala moderno absorveu dezenas de palavras do francês para facilitar transações diárias. O uso de expressões de cortesia como *"s'il vous plaît"* perfeitamente integradas ao Lingala é padrão na comunicação cotidiana.`;
    }
  }

  if (idioma === "Kimbundu") {
    if (lessonIndex % 2 === 1) {
      return `### Classes Nominais e Origens Linguísticas (Kimbundu Essencial)

O Kimbundu é uma das línguas bantas nacionais mais importantes de Angola, possuindo profunda conexão histórica e de vocabulário com o português brasileiro.

#### 📌 Estruturas Fundamentais de Frase:
1. **Expressando Emoção e Afeto (Kuxima)**:
   - *"Kiambote! O kuxima wami wasola ué."* (Olá! O meu coração também escolheu / amou.)
   - *"Ngala ni kizola mu nzo yami."* (Tenho amor na minha casa/lar.)
2. **Identificação e Declaração**:
   - *"Ngozola o ndaka yami ia kidi."* (Amo verdadeiramente a minha língua de origem.)

#### 🗣️ Uso Prático e Dica Cultural:
Você sabia que palavras brasileiras extremamente comuns como *"caçula"*, *"moleque"*, *"bagunça"*, *"fubá"* e *"quilombo"* têm sua origem direta no Kimbundu? Estudar esta língua reconecta o aluno com as raízes culturais mais profundas da lusofonia.`;
    } else {
      return `### Estruturas de Verbos de Ação e Vida Comunitária

A conjugação no Kimbundu faz uso de prefixos pessoais fixados diretamente ao radical verbal, definindo com rapidez o agente e o tempo da ação realizada.

#### 📌 Estruturas Fundamentais de Frase:
1. **Atividades e Comércio Diário**:
   - *"Ngasumbile mbolo lero mu kikalaku."* (Comprei pão hoje no trabalho - *nga-* indica primeira pessoa do singular.)
   - *"Kuzuela kimbundu kuambote mu nzo."* (Falar Kimbundu é muito bom/importante em casa.)
2. **Expressão de Convivência e Direção**:
   - *"Kende mu nzo yami ni kizola."* (Vá para minha casa com amor/paz.)

#### 🗣️ Uso Prático e Dica Cultural:
A hospitalidade (*usendo*) e a vida em comunidade são valores morais fundamentais da sociedade Kimbundu. Convidar familiares e amigos para partilhar o pão (*mbolo*) ou o alimento (*kudia*) na própria casa (*nzo*) é uma das formas de afeto mais tradicionais.`;
    }
  }

  if (idioma === "Italiano") {
    if (lessonIndex % 2 === 1) {
      return `### Studio dell'Italiano: Pronuncia e Fondamenti

L'italiano è una lingua musicale ed espressiva, rinomata per la sua chiarezza fonetica e la ricchezza culturale.

#### 📌 Strutture Fondamentali di Frase:
1. **Presentazione e Saluti**:
   - *"Buongiorno! Mi chiamo Marco e sono felice di conoscerti."* (Bom dia! Meu nome é Marco e estou feliz em te conhecer.)
   - *"Come stai? Spero che tutto vada bene."* (Como vai você? Espero que tudo esteja bem.)
2. **Uso di Articoli e Generi**:
   - *"La tavola è pronta per la cena di stasera."* (A mesa está pronta para o jantar de hoje à noite - gênero femminile.)
   - *"Il libro di italiano è sul tavolo."* (O livro de italiano está sobre a mesa - gênero maschile.)

#### 🗣️ Uso Pratico e Dica Culturale:
In Italia, i saluti variano a seconda del momento della giornata. *"Buongiorno"* si usa fino al pomeriggio, seguito da *"Buonasera"*. L'uso del formale *"Lei"* è standard con persone che non si conoscono o in contesti lavorativi, mentre *"tu"* è riservato ad amici e giovani.`;
    } else {
      return `### Struttura della Frase e Uso dei Verbi Ausiliari

In italiano, la struttura fondamentale segue l'ordine SVO (Soggetto-Verbo-Oggetto), ma è molto flessibile grazie alle coniugazioni verbali chiare.

#### 📌 Strutture Fondamentali di Frase:
1. **Passato Prossimo con Ausiliare**:
   - *"Ieri ho visitato un bellissimo museo a Roma."* (Ontem visitei um belissimo museu em Roma - usa o auxiliar *avere*.)
   - *"Siamo andati in Italia per le vacanze estive."* (Fomos para a Itália para as férias de verão - usa o auxiliar *essere*.)
2. **Connettori Logici e Coordinazione**:
   - *"Mi piace molto viaggiare, ma preferisco sempre tornare a casa."* (Gosto molto de viajar, mas prefiro sempre voltar para casa.)

#### 🗣️ Uso Pratico e Dica Culturale:
La scelta dell'ausiliare nel passato prossimo è un aspetto cruciale: i verbi transitivi richiedono *"avere"*, mentre molti verbi di movimento, cambiamento di stato e riflessivi richiedono *"essere"*. Fate attenzione alla concordanza del participio passato con il soggetto quando usate *"essere"*!`;
    }
  }

  // General fallback for default list or any other case
  const defaultList = explanations["Inglês"];
  const defaultItem = defaultList[(lessonIndex - 1) % defaultList.length];
  return defaultItem;
}

function getGeneratedVocab(
  idioma: string,
  level: string,
  lessonIndex: number,
  vocabIndex: number,
  id_licao: number,
  id_vocabulario: number
): Vocabulario {
  const key = `${idioma}_${vocabIndex}`;
  const vocabDb: Record<string, Array<{term: string, trad: string, ex1: string, ex2: string, ex3: string}>> = {
    "Inglês_1": [
      { term: "Enhance", trad: "Melhorar / Aprimorar", ex1: "We want to enhance our service.", ex2: "She enhanced her skills.", ex3: "A good book can enhance your mind." },
      { term: "Gather", trad: "Reunir / Coletar", ex1: "Let's gather the feedback.", ex2: "They gathered in the room.", ex3: "Gather your tools before starting." },
      { term: "Thrive", trad: "Prosperar / Crescer bem", ex1: "The company will thrive here.", ex2: "Plants thrive with good water.", ex3: "He thrives under challenge." },
      { term: "Acknowledge", trad: "Reconhecer / Admitir", ex1: "Please acknowledge the receipt.", ex2: "He acknowledged his mistake.", ex3: "They acknowledged her success." },
      { term: "Determine", trad: "Determinar / Decidir", ex1: "We must determine the cause.", ex2: "She determined to learn English.", ex3: "This will determine our future." },
      { term: "Acquire", trad: "Adquirir / Obter", ex1: "You will acquire new skills.", ex2: "We acquired a new company.", ex3: "Knowledge is acquired through study." },
      { term: "Cope", trad: "Lidar com / Enfrentar", ex1: "How do you cope with stress?", ex2: "She coped well with the news.", ex3: "We must cope with these changes." },
      { term: "Resolve", trad: "Resolver / Decidir", ex1: "Let's resolve this issue today.", ex2: "He resolved to study more.", ex3: "The conflict was resolved peacefully." },
      { term: "Emphasize", trad: "Enfatizar / Destacar", ex1: "I want to emphasize this point.", ex2: "She emphasized the safety rules.", ex3: "The teacher emphasized correct spelling." },
      { term: "Sustain", trad: "Sustentar / Manter", ex1: "We must sustain this level.", ex2: "He sustained an injury.", ex3: "Can we sustain our economic growth?" }
    ],
    "Inglês_2": [
      { term: "Endeavor", trad: "Esforço / Empreendimento", ex1: "We wish you luck in your endeavor.", ex2: "They endeavored to do their best.", ex3: "This endeavor requires patience." },
      { term: "Feasible", trad: "Viável / Praticável", ex1: "The plan seems quite feasible.", ex2: "Is it feasible to build this now?", ex3: "A feasible alternative was found." },
      { term: "Reluctant", trad: "Relutante / Receoso", ex1: "She was reluctant to sign.", ex2: "He is reluctant to make promises.", ex3: "The cat was reluctant to go out." },
      { term: "Advocate", trad: "Defensor / Defender", ex1: "He is an advocate for peace.", ex2: "She advocates for clean energy.", ex3: "We advocate for student rights." },
      { term: "Ambiguous", trad: "Ambíguo / Duvidoso", ex1: "The instructions were ambiguous.", ex2: "An ambiguous answer is not helpful.", ex3: "Do not use ambiguous language." },
      { term: "Coherent", trad: "Coerente / Claro", ex1: "The speaker was very coherent.", ex2: "A coherent plan is essential.", ex3: "His argument was logical and coherent." },
      { term: "Deviate", trad: "Desviar / Afastar-se", ex1: "Do not deviate from the topic.", ex2: "The plane deviated from its route.", ex3: "Prices may deviate slightly." },
      { term: "Inevitable", trad: "Ivitável / Fatal", ex1: "Change is inevitable in life.", ex2: "An inevitable outcome of study is learning.", ex3: "We cannot avoid the inevitable." },
      { term: "Mutual", trad: "Mútuo / Recíproco", ex1: "We have a mutual understanding.", ex2: "Mutual respect is very important.", ex3: "They share a mutual friend." },
      { term: "Subsequent", trad: "Subsequente / Posterior", ex1: "Subsequent events proved him right.", ex2: "This is discussed in subsequent chapters.", ex3: "The subsequent meeting was canceled." }
    ],
    "Espanhol_1": [
      { term: "Mejorar", trad: "Melhorar", ex1: "Queremos mejorar nuestro servicio.", ex2: "Él mejoró su pronunciación.", ex3: "La práctica constante ayuda a mejorar." },
      { term: "Reunir", trad: "Reunir", ex1: "Vamos a reunir todos los datos.", ex2: "Se reunieron en la plaza.", ex3: "Reunió sus cosas y se fue." },
      { term: "Crecer", trad: "Crescer", ex1: "El negocio va a crecer mucho.", ex2: "Los niños crecen rápido.", ex3: "Esta planta crece en la sombra." },
      { term: "Reconocer", trad: "Reconhecer", ex1: "Debemos reconocer el esfuerzo.", ex2: "Él reconoció su error.", ex3: "La reconociendo de inmediato." },
      { term: "Decidir", trad: "Decidir", ex1: "Tengo que decidir mi futuro.", ex2: "Decidieron viajar mañana.", ex3: "Esto va a decidir el partido." },
      { term: "Adquirir", trad: "Adquirir", ex1: "Vas a adquirir habilidades.", ex2: "Adquirimos una nueva casa.", ex3: "El conocimiento se adquiere estudiando." },
      { term: "Afrontar", trad: "Enfrentar / Lidar com", ex1: "Hay que afrontar el problema.", ex2: "Ella afrontó la situación con calma.", ex3: "Afrontamos nuevos desafíos." },
      { term: "Resolver", trad: "Resolver", ex1: "Vamos a resolver esto hoy.", ex2: "Resolvió el examen con facilidad.", ex3: "El misterio fue resuelto." },
      { term: "Destacar", trad: "Destacar / Enfatizar", ex1: "Quiero destacar este punto.", ex2: "Ella destaca en su clase.", ex3: "Se destacan por su amabilidad." },
      { term: "Mantener", trad: "Manter", ex1: "Debemos mantener el orden.", ex2: "Mantuvo su palabra hasta el final.", ex3: "Es difícil mantener la calma." }
    ],
    "Espanhol_2": [
      { term: "Esfuerzo", trad: "Esforço", ex1: "Agradecemos tu gran esfuerzo.", ex2: "Hicieron un esfuerzo supremo.", ex3: "El esfuerzo dará frutos." },
      { term: "Viable", trad: "Viável", ex1: "El proyecto parece muy viable.", ex2: "No es viable construirlo aquí.", ex3: "Buscamos una solución viable." },
      { term: "Dudar", trad: "Duvidar / Hesitar", ex1: "No debes dudar de ti mismo.", ex2: "Él dudó por un momento.", ex3: "Dudo que venga hoy." },
      { term: "Defender", trad: "Defender", ex1: "Voy a defender mi postura.", ex2: "Ellos defienden sus derechos.", ex3: "Debemos defender el bosque." },
      { term: "Dudoso", trad: "Duvidoso / Ambíguo", ex1: "Es un asunto muy dudoso.", ex2: "Su respuesta fue dudosa.", ex3: "No dejes espacio para lo dudoso." },
      { term: "Claro", trad: "Claro / Coerente", ex1: "El agua está muy clara.", ex2: "Fue un ejemplo muy claro.", ex3: "Hablemos de forma clara." },
      { term: "Desviar", trad: "Desviar", ex1: "No desvíes la atención.", ex2: "El camino se desvió a la derecha.", ex3: "Logramos desviar el golpe." },
      { term: "Inevitable", trad: "Ivitável", ex1: "El cambio es inevitable.", ex2: "Fue un choque inevitable.", ex3: "Aceptemos lo inevitable." },
      { term: "Mutuo", trad: "Mútuo", ex1: "Tenemos un acuerdo mutuo.", ex2: "El respeto mutuo es clave.", ex3: "Sienten un cariño mutuo." },
      { term: "Siguiente", trad: "Seguinte / Posterior", ex1: "El siguiente capítulo es mejor.", ex2: "Llegó al día siguiente.", ex3: "Siga las siguientes reglas." }
    ],
    "Francês_1": [
      { term: "Améliorer", trad: "Melhorar / Aprimorar", ex1: "Nous voulons améliorer le service.", ex2: "Elle a amélioré ses compétences.", ex3: "Une pratique constante aide à s'améliorer." },
      { term: "Rassembler", trad: "Reunir / Juntar", ex1: "Rassemblons les informations.", ex2: "Ils se sont rassemblés dans la cour.", ex3: "Il a rassemblé ses livres." },
      { term: "Grandir", trad: "Crescer", ex1: "Les enfants grandissent vite.", ex2: "L'entreprise veut grandir à l'étranger.", ex3: "Cette plante grandit bien." },
      { term: "Reconnaître", trad: "Reconhecer", ex1: "Je dois reconnaître mon erreur.", ex2: "Elle l'a reconnu tout de suite.", ex3: "Reconnaître le talent est important." },
      { term: "Décider", trad: "Decidir", ex1: "C'est difficile de décider.", ex2: "Ils ont décidé de partir tôt.", ex3: "Nous devons décider notre destin." },
      { term: "Acquérir", trad: "Adquirir", ex1: "Vous allez acquérir de l'expérience.", ex2: "Nous avons acquis cette maison.", ex3: "Le savoir s'acquiert par l'étude." },
      { term: "Affronter", trad: "Enfrentar / Lidar com", ex1: "Il faut affronter les faits.", ex2: "Elle a affronté l'orage avec bravoure.", ex3: "Affronter ses peurs est libérateur." },
      { term: "Résoudre", trad: "Resolver", ex1: "Nous allons résoudre ce problème.", ex2: "Elle a résolu l'énigme facilement.", ex3: "Le cas est enfin résolu." },
      { term: "Souligner", trad: "Destacar / Enfatizar", ex1: "Je veux souligner cet aspect.", ex2: "Elle a souligné les mots importants.", ex3: "Le rapport souligne la nécessité d'agir." },
      { term: "Maintenir", trad: "Manter", ex1: "Maintenez la position s'il vous plaît.", ex2: "Il a maintenu sa décision.", ex3: "C'est dur de maintenir le silence." }
    ],
    "Francês_2": [
      { term: "Effort", trad: "Esforço", ex1: "Merci pour votre grand effort.", ex2: "Ils ont fait un effort incroyable.", ex3: "Chaque effort compte." },
      { term: "Faisable", trad: "Viável / Possível", ex1: "Ce projet est tout à fait faisable.", ex2: "Est-ce faisable de finir aujourd'hui ?", ex3: "Une option faisable existe." },
      { term: "Hésiter", trad: "Hesitar", ex1: "N'hésitez pas à demander.", ex2: "Il a hésité avant de parler.", ex3: "Elle hésite entre deux choix." },
      { term: "Défendre", trad: "Defender / Proibir", ex1: "Je vais défendre mon pays.", ex2: "Il est défendu de fumer ici.", ex3: "Ils défendent la justice." },
      { term: "Ambigu", trad: "Ambíguo / Duvidoso", ex1: "Sa réponse était très ambiguë.", ex2: "Évitez les termes ambigus.", ex3: "C'est un rôle ambigu." },
      { term: "Clair", trad: "Claro / Coerente", ex1: "Le ciel est très clair.", ex2: "C'est un message clair.", ex3: "Parler de manière claire est un art." },
      { term: "Dévier", trad: "Desviar", ex1: "Ne déviez pas du chemin.", ex2: "La route dévie à gauche.", ex3: "Nous avons dévié la discussion." },
      { term: "Inévitable", trad: "Ivitável", ex1: "C'est un choix inévitable.", ex2: "La mort est inévitable.", ex3: "Nous affrontons l'inévitable." },
      { term: "Mutuel", trad: "Mútuo", ex1: "Nous avons un respect mutuel.", ex2: "C'est une décision mutuelle.", ex3: "Leur amour est mutuel." },
      { term: "Suivant", trad: "Seguinte / Posterior", ex1: "Le jour suivant fut pluvieux.", ex2: "Regardez l'image suivante.", ex3: "Le chapitre suivant est court." }
    ],
    "Alemão_1": [
      { term: "Verbessern", trad: "Melhorar / Aprimorar", ex1: "Wir wollen den Service verbessern.", ex2: "Sie hat ihre Fähigkeiten verbessert.", ex3: "Konstante Übung hilft zu verbessern." },
      { term: "Sammeln", trad: "Reunir / Coletar", ex1: "Lass uns Feedback sammeln.", ex2: "Sie sammelten sich im Raum.", ex3: "Sammle deine Werkzeuge vor dem Start." },
      { term: "Gedeihen", trad: "Prosperar / Crescer bem", ex1: "Das Unternehmen wird hier gedeihen.", ex2: "Pflanzen gedeihen mit gutem Wasser.", ex3: "Er gedeiht unter Herausforderungen." },
      { term: "Anerkennen", trad: "Reconhecer / Admitir", ex1: "Bitte erkennen Sie den Erhalt an.", ex2: "Er erkannte seinen Fehler an.", ex3: "Sie erkannten ihren Erfolg an." },
      { term: "Bestimmen", trad: "Determinar / Decidir", ex1: "Wir müssen die Ursache bestimmen.", ex2: "Sie bestimmte, Deutsch zu lernen.", ex3: "Dies wird unsere Zukunft bestimmen." },
      { term: "Erwerben", trad: "Adquirir / Obter", ex1: "Sie werden neue Fähigkeiten erwerben.", ex2: "Wir haben eine neue Firma erworben.", ex3: "Wissen wird durch Studium erworben." },
      { term: "Bewältigen", trad: "Lidar com / Enfrentar", ex1: "Wie bewältigen Sie Stress?", ex2: "Sie hat die Nachricht gut bewältigt.", ex3: "Wir müssen diese Änderungen bewältigen." },
      { term: "Lösen", trad: "Resolver / Decidir", ex1: "Lass uns dieses Problem heute lösen.", ex2: "Er löste die Aufgabe mit Bravour.", ex3: "Der Konflikt wurde friedlich gelöst." },
      { term: "Betonen", trad: "Enfatizar / Destacar", ex1: "Ich möchte diesen Point betonen.", ex2: "Sie betonte die Sicherheitsregeln.", ex3: "Der Lehrer betonte die richtige Schreibweise." },
      { term: "Erhalten", trad: "Manter / Receber", ex1: "Wir müssen dieses Niveau erhalten.", ex2: "Er hat eine Verletzung erhalten.", ex3: "Können wir das Wirtschaftswachstum erhalten?" }
    ],
    "Alemão_2": [
      { term: "Bemühen", trad: "Esforço / Esforçar-se", ex1: "Wir danken Ihnen für Ihre Bemühungen.", ex2: "Sie bemühten sich, ihr Bestes zu geben.", ex3: "Dieses Bemühen erfordert Geduld." },
      { term: "Machbar", trad: "Viável / Praticável", ex1: "Der Plan scheint durchaus machbar.", ex2: "Ist es machbar, dies jetzt zu bauen?", ex3: "Eine machbare Alternative wurde gefunden." },
      { term: "Zögerlich", trad: "Hesitante / Relutante", ex1: "Sie war zögerlich zu unterschreiben.", ex2: "Er ist zögerlich, Versprechen zu machen.", ex3: "Die Katze war zögerlich, rauszugehen." },
      { term: "Befürworten", trad: "Defender / Apoiar", ex1: "Er ist ein Befürworter des Friedens.", ex2: "Sie befürwortet saubere Energie.", ex3: "Wir befürworten die Rechte der Studenten." },
      { term: "Mehrdeutig", trad: "Ambíguo / Duvidoso", ex1: "Die Anweisungen waren mehrdeutig.", ex2: "Eine mehrdeutige Antwort hilft nicht.", ex3: "Verwenden Sie keine mehrdeutige Sprache." },
      { term: "Schlüssig", trad: "Coerente / Claro", ex1: "Der Redner was sehr schlüssig.", ex2: "Ein schlüssiger Plan ist wichtig.", ex3: "Sein Argument war logisch und schlüssig." },
      { term: "Abweichen", trad: "Desviar / Afastar-se", ex1: "Weichen Sie nicht vom Thema ab.", ex2: "Das Flugzeug wich von der Route ab.", ex3: "Preise können leicht abweichen." },
      { term: "Unvermeidlich", trad: "Inevitável", ex1: "Veränderung ist unvermeidlich im Leben.", ex2: "Ein unvermeidliches Ergebnis des Studiums ist Lernen.", ex3: "Wir können dem Unvermeidlichen nicht entgehen." },
      { term: "Gegenseitig", trad: "Mútuo", ex1: "Wir haben ein gegenseitiges Verständnis.", ex2: "Gegenseitiger Respekt ist sehr wichtig.", ex3: "Sie teilen einen gegenseitigen Freund." },
      { term: "Nachträglich", trad: "Subsequente / Posterior", ex1: "Nachträgliche Ereignisse gaben ihm recht.", ex2: "Dies wird in nachträglichen Kapiteln besprochen.", ex3: "Das nachträgliche Treffen wurde abgesagt." }
    ],
    "Latim_1": [
      { term: "Augere", trad: "Melhorar / Aumentar", ex1: "Scientiam nostram augere volumus.", ex2: "Sapientia mentem auget.", ex3: "Virtus famam semper auget." },
      { term: "Colligere", trad: "Reunir / Coletar", ex1: "Libros in bibliotheca colligo.", ex2: "Milites in unum colliguntur.", ex3: "Flores in horto colligere iuvat." },
      { term: "Florere", trad: "Prosperar / Florescer", ex1: "Civitas in pace floret.", ex2: "Artes in hac urbe florent.", ex3: "Floret fides in pectore honesto." },
      { term: "Cognoscere", trad: "Reconhecer / Conhecer", ex1: "Veritatem cognoscere cupio.", ex2: "Amicum in turba cognovi.", ex3: "Error cognitus corrigi debet." },
      { term: "Decernere", trad: "Decidir / Decretar", ex1: "Senatus bellum decernit.", ex2: "Iudex sententiam decernit.", ex3: "De hac re decernere debemus." },
      { term: "Parare", trad: "Adquirir / Preparar", ex1: "Viam ad gloriam paramus.", ex2: "Cenam hospitibus parat.", ex3: "Mens sapiens ad mala parata est." },
      { term: "Tolerare", trad: "Enfrentar / Lidar com / Tolerar", ex1: "Dolorem fortiter tolerare oportet.", ex2: "Labores tolerare discimus.", ex3: "Nemo iniuriam tolerare debet." },
      { term: "Solvere", trad: "Resolver / Soltar", ex1: "Aenigma solvere conor.", ex2: "Nodum solvere non possum.", ex3: "Vincula soluta sunt." },
      { term: "Ostendere", trad: "Destacar / Mostrar", ex1: "Viam mihi ostende, quaeso.", ex2: "Virtutem in periculo ostendit.", ex3: "Ratio veritatem ostendit." },
      { term: "Tenere", trad: "Manter / Segurar", ex1: "Promissum tuum tenere memento.", ex2: "Librum manu teneo.", ex3: "Silentium in templo tenebant." }
    ],
    "Latim_2": [
      { term: "Labor", trad: "Esforço / Trabalho", ex1: "Labor omnia vincit improbus.", ex2: "Magnus labor fructum dabit.", ex3: "Sine labore nihil habemus." },
      { term: "Possibilis", trad: "Viável / Possível", ex1: "Res facilis et possibilis videtur.", ex2: "Nihil homini sapienti impossibile est.", ex3: "Viam possibilem inveniemus." },
      { term: "Dubitare", trad: "Hesitar / Duvidar", ex1: "De fide tua non dubito.", ex2: "Dubitare cogito est.", ex3: "In re dubia auxilium pete." },
      { term: "Defendere", trad: "Defender", ex1: "Patriam contra hostes defendam.", ex2: "Iura civium defendere oportet.", ex3: "Murus urbem defendit." },
      { term: "Dubius", trad: "Duvidoso / Ambíguo", ex1: "Res in statu dubio est.", ex2: "Responsio dubia non prodest.", ex3: "Via dubia vitanda est." },
      { term: "Clarus", trad: "Claro / Ilustre / Coerente", ex1: "Caelum clarum et serenum est.", ex2: "Vox clara in silentio auditur.", ex3: "Clarissimus dux exercitus fuit." },
      { term: "Avertere", trad: "Desviar", ex1: "Oculos a malo averte.", ex2: "Ira dei avertere conantur.", ex3: "Dux iter ab hoste avertit." },
      { term: "Inevitabilis", trad: "Inevitável", ex1: "Fatum inevitabile est.", ex2: "Mors omnibus inevitabilis est.", ex3: "Casus inevitabilis accidit." },
      { term: "Mutuus", trad: "Mútuo", ex1: "Amor mutuus inter amicos est.", ex2: "Auxilium mutuum feramus.", ex3: "Respectus mutuus pacem servat." },
      { term: "Sequens", trad: "Seguinte", ex1: "Die sequenti iter fecit.", ex2: "Capitulum sequens lege.", ex3: "Sequens sententia vera est." }
    ],
    "Lingala_1": [
      { term: "Koyekola", trad: "Aprender / Estudar", ex1: "Nazali koyekola Lingala.", ex2: "Bana bazali koyekola.", ex3: "Koyekola ezali ndako ya mayele." },
      { term: "Kosala", trad: "Trabalhar / Fazer", ex1: "Nazo kosala mosala lelo.", ex2: "Salela ngai likambo oyo.", ex3: "Boni mosala ezali kokende?" },
      { term: "Kokende", trad: "Ir / Partir", ex1: "Nakei kokende na ndako.", ex2: "Kende malamu, ndeko na ngai.", ex3: "Bakei wapi lelo?" },
      { term: "Kosomba", trad: "Comprar", ex1: "Nalingi kosomba bilamba.", ex2: "Somba mampa na wenze.", ex3: "Asombaki ndako ya sika lobi." },
      { term: "Kolia", trad: "Comer", ex1: "Toya kolia elongo.", ex2: "Nazo lia ndunda ya kitoko.", ex3: "Balia biloko oyo." },
      { term: "Kozwa", trad: "Conseguir / Obter", ex1: "Nazwi kitadi mpo na mbongo.", ex2: "Okozwa mosala malamu.", ex3: "Boni bosembo ya kozwa mbano?" },
      { term: "Koloba", trad: "Falar", ex1: "Loba malembe, nalingi koyoka.", ex2: "Azali koloba na falanse.", ex3: "Boni, oyebi koloba Lingala?" },
      { term: "Koyemba", trad: "Cantar", ex1: "Toyemba nzembo kitoko.", ex2: "Bana bazali koyemba.", ex3: "Ayembaki malamu mpenza lobi." },
      { term: "Kobina", trad: "Dançar", ex1: "Babinaka malamu na Congo.", ex2: "Nalingi kobina na yo.", ex3: "Oyei kobina elongo na biso." },
      { term: "Koyoka", trad: "Ouvir / Escutar / Sentir", ex1: "Yoka liloba na ngai.", ex2: "Nazo yoka mongongo na ye.", ex3: "Ayokaki mpasi na motema." }
    ],
    "Lingala_2": [
      { term: "Malamu", trad: "Bom / Bem", ex1: "Ozali malamu, ndeko?", ex2: "Mosala ezali malamu mpenza.", ex3: "Luka nzela ya malamu." },
      { term: "Kitoko", trad: "Lindo / Bonito", ex1: "Elenge mwasi ya kitoko.", ex2: "Oyo ezali nzembo kitoko.", ex3: "Ndako na ye ezali kitoko mpenza." },
      { term: "Mposa", trad: "Vontade / Desejo", ex1: "Nazali na mposa ya kolia.", ex2: "Mposa ya lola ezali monene.", ex3: "Mposa na yo ekosalema." },
      { term: "Mosika", trad: "Longe", ex1: "Ndako na ye ezali mosika.", ex2: "Okei mosika lelo.", ex3: "Kutaka basika na mosika." },
      { term: "Pene", trad: "Perto / Próximo", ex1: "Ndako na ye ezali pene.", ex2: "Zala pene na ngai.", ex3: "Wenze ezali pene na ndako." },
      { term: "Tongo", trad: "Manhã", ex1: "Mbote na tongo, baninga.", ex2: "Nalamuki na tongo makasi.", ex3: "Tongo etani malamu lelo." },
      { term: "Pokwa", trad: "Tarde / Noite", ex1: "Mbote na pokwa, tata.", ex2: "Tokomonana na pokwa.", ex3: "Pokwa eyei noki lelo." },
      { term: "Lobi", trad: "Ontem / Amanhã", ex1: "Nakei lobi na mosala.", ex2: "Lobi na tongo tokokutana.", ex3: "Lobi asombaki bilamba." },
      { term: "Lelo", trad: "Hoje", ex1: "Lelo ezali mokolo ya esengo.", ex2: "Nazo kosala lelo.", ex3: "Mampa ya lelo ezali kitoko." },
      { term: "Mokolo", trad: "Dia / Dono", ex1: "Mokolo na mokolo toyekolaka.", ex2: "Oyo ezali mokolo malamu.", ex3: "Mokolo ndako azali kokende." }
    ],
    "Kimbundu_1": [
      { term: "Kuxima", trad: "Coração / Sentimento", ex1: "O kuxima wami wasola ué.", ex2: "Kuxima ya Angola.", ex3: "Muxima wé wazala ni ndenge." },
      { term: "Kizola", trad: "Amor / Amizade", ex1: "Ngala ni kizola mu nzo yé.", ex2: "Kizola kia kidi kizola kia nzambi.", ex3: "Usendo wasola ni kizola inene." },
      { term: "Kikalaku", trad: "Trabalho / Ofício", ex1: "O kikalaku kiambote mpenza.", ex2: "Nakei mu kikalaku lero.", ex3: "Luka kikalaku kiambote." },
      { term: "Kusumba", trad: "Comprar", ex1: "Ngasumbile mbolo lero.", ex2: "Sumbela eme o mbolo.", ex3: "Kusumba o mutari kwasoso." },
      { term: "Kudia", trad: "Comer / Alimento", ex1: "Ngandala kudia o mbolo.", ex2: "Kudia kuambote kuia muenhu.", ex3: "Dia mbolo ja lelo." },
      { term: "Kubaka", trad: "Pegar / Conseguir", ex1: "Kubaka kitadi kia soso.", ex2: "Baka o mutari mu nzo.", ex3: "Kubaka kizola kia nzambi." },
      { term: "Kuzuela", trad: "Falar", ex1: "Kuzuela kimbundu kuambote.", ex2: "Zuela malembe, tata wami.", ex3: "Ondaka yambote mu kuzuela." },
      { term: "Kuimba", trad: "Cantar", ex1: "Kuimba o kwembi kua kidi.", ex2: "Bana kuimba o kuembi kua ndenge.", ex3: "Kuimba kua Luanda kuambote." },
      { term: "Kubina", trad: "Dançar", ex1: "Bina o kizomba kiambote.", ex2: "Ngandala kubina ni eye.", ex3: "Bina tunde tongo ienyi." },
      { term: "Kufuita", trad: "Pagar", ex1: "Kufuita o kitadi kienyi lero.", ex2: "Fuita o mbolo ja lelo.", ex3: "Asumbile o mbolo ni kufuita." }
    ],
    "Kimbundu_2": [
      { term: "Kiambote", trad: "Bom / Tudo bem / Saudações", ex1: "Kiambote, tata wami, uazekele kyambote?", ex2: "O kikalaku ezala kiambote.", ex3: "Njila yambote mu nzo yé." },
      { term: "Kidi", trad: "Verdade", ex1: "Ondaka ia kidi inene mpenza.", ex2: "Zuela o kidi, mona wami.", ex3: "Kidi kizuila mu nzo." },
      { term: "Kitadi", trad: "Dinheiro / Riqueza", ex1: "Ngala ni kitadi kia soso.", ex2: "O kitadi kizuila mbote kieny.", ex3: "Kubaka kitadi mu kikalaku." },
      { term: "Mbolo", trad: "Pão", ex1: "Sumbela eme o mbolo.", ex2: "O mbolo kiki yambote mpenza.", ex3: "Ngandala kudia o mbolo." },
      { term: "Njila", trad: "Caminho / Estrada", ex1: "O njila ia Luanda ialula.", ex2: "Njila ia kidi inene.", ex3: "Kiambote njila ué." },
      { term: "Lero", trad: "Hoje", ex1: "O kikalaku lero kiambote.", ex2: "Ngasumbile o mbolo lero.", ex3: "Lero ndenge ezala inene." },
      { term: "Mazuda", trad: "Ontem", ex1: "Ngasumbile o mbolo mazuda.", ex2: "Kikalaku kia mazuda kiambote.", ex3: "Mazuda ndenge ia soso." },
      { term: "Tongo", trad: "Manhã", ex1: "Kiambote mu tongo, ndeko.", ex2: "Tongo iambote mu nzo yé.", ex3: "Nalamuki mu tongo makasi." },
      { term: "Nzo", trad: "Casa / Lar", ex1: "Nzo yami ezala pene ué.", ex2: "Kende mu nzo yé.", ex3: "O nzo yami parva." },
      { term: "Muenhu", trad: "Vida / Saúde", ex1: "Ngala ni muenhu uambote.", ex2: "O muenhu uambote mu kikalaku.", ex3: "Kizola kia muenhu wa kidi." }
    ],
    "Italiano_1": [
      { term: "Migliorare", trad: "Melhorar / Aprimorar", ex1: "Voglio migliorare il mio italiano.", ex2: "Studio per migliorare le mie competenze.", ex3: "La tecnologia migliora la qualità della vita." },
      { term: "Raccogliere", trad: "Reunir / Coletar", ex1: "Dobbiamo raccogliere i dati prima di decidere.", ex2: "I bambini amano raccogliere le conchiglie sulla spiaggia.", ex3: "Raccogliamo i frutti del nostro lavoro." },
      { term: "Fiorire", trad: "Prosperare / Florescer / Crescer bem", ex1: "L'arte continua a fiorire in questa città.", ex2: "I fiori fioriscono in primavera.", ex3: "La sua attività commerciale sta fiorendo." },
      { term: "Riconoscere", trad: "Reconhecer / Admitir", ex1: "Riconosco l'importanza di questo progetto.", ex2: "Non ha voluto reconocer o seu erro.", ex3: "È importante riconoscere il merito degli altri." },
      { term: "Determinare", trad: "Determinar / Decidir", ex1: "Dobbiamo determinare la causa del problema.", ex2: "Questo fattore determinerà la nostra scelta.", ex3: "Ha determinato di finire il lavoro stasera." },
      { term: "Acquisire", trad: "Adquirir / Obter", ex1: "Voglio acquisire nuove conoscenze linguistiche.", ex2: "L'azienda ha acquisito un nuovo cliente.", ex3: "Le competenze si acquisiscono con l'esperienza." },
      { term: "Affrontare", trad: "Lidar com / Enfrentar", ex1: "Dobbiamo affrontare questa situazione con coraggio.", ex2: "Lui sa come affrontare i problemi difficili.", ex3: "Affronteremo la sfida insieme." },
      { term: "Risolvere", trad: "Resolver / Decidir", ex1: "Possiamo risolvere questo enigma rapidamente.", ex2: "Hanno risolto la disputa in modo amichevole.", ex3: "Voglio risolvere questa questione oggi." },
      { term: "Evidenziare", trad: "Enfatizar / Destacar", ex1: "Vorrei evidenziare i punti chiave del discorso.", ex2: "Il grafico evidenzia la crescita economica.", ex3: "Il professore ha evidenziato gli errori comuni." },
      { term: "Sostenere", trad: "Sustentar / Manter / Apoiar", ex1: "Dobbiamo sostenere questo ritmo di lavoro.", ex2: "I genitori sostengono sempre i propri figli.", ex3: "È difficile sostenere questa tesi scientifica." }
    ],
    "Italiano_2": [
      { term: "Sforzo", trad: "Esforço / Empreendimento", ex1: "Questo risultato richiede un grande sforzo.", ex2: "Apprezzo lo sforzo che hai fatto per me.", ex3: "Con un piccolo sforzo in più, possiamo farcela." },
      { term: "Fattibile", trad: "Viável / Praticável / Possível", ex1: "Il tuo piano mi sembra assolutamente fattibile.", ex2: "Non credo che questo progetto sia fattibile adesso.", ex3: "Troveremo una soluzione fattibile." },
      { term: "Riluttante", trad: "Relutante / Receoso", ex1: "Era riluttante ad accettare l'offerta di lavoro.", ex2: "È riluttante a parlare in pubblico.", ex3: "All'inizio era riluttante, ma poi ha acconsentito." },
      { term: "Difendere", trad: "Defensor / Defender", ex1: "Dobbiamo difendere i nostri diritti civili.", ex2: "L'avvocato difende l'imputato con passione.", ex3: "I soldati difendono la patria con coraggio." },
      { term: "Ambiguo", trad: "Ambíguo / Duvidoso", ex1: "Le sue parole hanno un significato ambiguo.", ex2: "Un comportamento ambiguo genera sospetti.", ex3: "La risposta è stata estremamente ambigua." },
      { term: "Coerente", trad: "Coerente / Claro / Lógico", ex1: "Il suo ragionamento è logico e coerente.", ex2: "Dobbiamo essere coerenti con le nostre idee.", ex3: "Un piano coerente è la chiave del successo." },
      { term: "Deviare", trad: "Desviar / Afastar-se", ex1: "Non deviare dal sentiero principale.", ex2: "Il fiume devia verso sud.", ex3: "Non dobbiamo deviare dai nostri obiettivi." },
      { term: "Inevitabile", trad: "Inevitável / Fatal", ex1: "Il cambiamento è inevitabile nel tempo.", ex2: "Un esito inevitabile di questo errore.", ex3: "La pioggia era inevitabile oggi." },
      { term: "Reciproco", trad: "Mútuo / Recíproco", ex1: "C'è un rispetto reciproco tra colleghi.", ex2: "L'aiuto reciproco è fundamental in una comunità.", ex3: "Il sentimento di affetto è reciproco." },
      { term: "Successivo", trad: "Subsequente / Posterior / Seguinte", ex1: "Questo argomento sarà trattato nel capitolo successivo.", ex2: "Il giorno successivo siamo andati a Venezia.", ex3: "Le decisioni successive saranno prese dal comitato." }
    ]
  };

  const list = vocabDb[key] || vocabDb["Inglês_1"];
  const item = list[(lessonIndex - 1) % list.length];

  const pronunciaDict: Record<string, string> = {
    // Inglês
    "Enhance": "[en-háns] (como em 'en-hánss')",
    "Gather": "[gá-ðer] (o 'th' soa como um 'd' vibrado com a ponta da língua nos dentes)",
    "Thrive": "[θraɪv] (o 'th' é soprado com a ponta da língua nos dentes)",
    "Acknowledge": "[ækˈnɒl.ɪdʒ] (como 'ék-nól-idj')",
    "Determine": "[di-têr-min] (não termina com som de 'main')",
    "Acquire": "[e-kwá-ier] (como 'e-quáir')",
    "Cope": "[kóup] (como 'côup')",
    "Resolve": "[ri-zólv] (o 's' tem som de 'z')",
    "Emphasize": "[ém-fa-saiz] (como 'ém-fa-saiz')",
    "Sustain": "[səs-téin] (como 'sâs-tein')",
    "Endeavor": "[en-dé-vor] (como 'en-dé-vôr')",
    "Feasible": "[fí-zi-b'l] (como 'fí-zi-boul')",
    "Reluctant": "[ri-lák-tant] (como 'ri-lâc-tânt')",
    "Advocate": "[éd-və-keit] (como 'éd-vo-queit')",
    "Ambiguous": "[æm-bíg-iu-əs] (como 'ém-bíg-iu-âs')",
    "Coherent": "[kou-hí-rent] (como 'co-hí-rênt')",
    "Deviate": "[dí-vi-eit] (como 'dí-vi-eit')",
    "Inevitable": "[in-év-i-ta-b'l] (como 'in-év-i-ta-boul')",
    "Mutual": "[miú-tʃu-al] (como 'miú-tchu-al')",
    "Subsequent": "[sáb-si-kwent] (como 'sâb-si-quent')",

    // Espanhol
    "Mejorar": "[me-ho-rár] (o 'j' tem som áspero de 'r' de 'rua')",
    "Reunir": "[rre-u-nír] (o 'rr' inicial é fortemente vibrado)",
    "Crecer": "[kre-thér] (na Espanha, 'c' antes de 'e' soa soprado entre os dentes)",
    "Reconocer": "[rre-ko-no-thér] (o 'rr' é forte e o 'c' final soa soprado)",
    "Decidir": "[de-thi-dír] (o 'c' soa soprado)",
    "Adquirir": "[að-ki-rír] (o 'd' é suave, quase encostando a língua nos dentes)",
    "Afrontar": "[a-fron-tár] (pronúncia limpa e direta)",
    "Resolver": "[rre-sol-bér] (o 'v' tem som idêntico ao 'b')",
    "Destacar": "[des-ta-kár] (pronúncia direta)",
    "Mantener": "[man-te-nér] (pronúncia direta)",
    "Esfuerzo": "[es-fuer-tho] (o 'z' soa soprado entre os dentes)",
    "Viable": "[biá-βle] (o 'v' soa como um 'b' suave e contínuo)",
    "Dudar": "[du-ðár] (o segundo 'd' soa suave como 'th' em 'the')",
    "Defender": "[de-fen-dér] (pronúncia direta)",
    "Dudoso": "[du-ðó-so] (o 's' tem sempre som de 'ss' em espanhol, nunca de 'z')",
    "Claro": "[klá-ro] (pronúncia direta e aberta)",
    "Desviar": "[des-biár] (o 'v' soa como 'b')",
    "Mutuo": "[mú-tuo] (pronúncia direta)",
    "Siguiente": "[si-guién-te] (o 'g' é suave e o 'u' é mudo)",

    // Francês
    "Améliorer": "[a-me-lio-ré] (o 'r' final é mudo e o 'r' inicial é gutural)",
    "Rassembler": "[rra-sã-blé] (o 'a' inicial é gutural, 'em' soa anasalado)",
    "Grandir": "[grã-dír] (o 'an' é anasalado e o 'r' é gutural)",
    "Reconnaître": "[rre-co-nê-tr'] (o 'r' é gutural e termina suavemente no sopro)",
    "Décider": "[de-si-dé] (o 'r' final é mudo)",
    "Acquérir": "[a-ke-rír] (o 'qu' soa como 'k', o 'r' final é pronunciado e gutural)",
    "Affronter": "[a-frõ-té] (o 'on' é anasalado e o 'r' é gutural)",
    "Résoudre": "[rre-zú-dr'] (o 's' soa como 'z', o 'r' é gutural)",
    "Souligner": "[su-li-gné] (o 'gn' soa exatamente como o 'nh' em português)",
    "Maintenir": "[mê-te-nír] (o 'ain' é anasalado aberto)",
    "Effort": "[e-fór] (o 't' final é completamente mudo)",
    "Faisable": "[fə-zá-bl'] (o 'ai' soa como 'â' e o 's' tem som de 'z')",
    "Hésiter": "[e-zi-té] (o 'h' é mudo e o 's' soa como 'z')",
    "Défendre": "[de-fã-dr'] (o 'en' é anasalado e termina no sopro suave do r)",
    "Ambigu": "[ã-bi-gú] (o 'am' é anasalado e o 'u' é pronunciado com bico de assobio)",
    "Clair": "[klêr] (o 'r' é gutural pronunciado)",
    "Dévier": "[de-vi-é] (o 'r' final é mudo)",
    "Inévitable": "[i-ne-vi-tá-bl'] (o 'e' soa aberto, termina suave no l)",
    "Mutuel": "[mu-tu-êl] (o 'u' exige o bico de assobio tipicamente francês)",
    "Suivant": "[sui-vã] (o 't' final é mudo e o 'an' é anasalado)",

    // Alemão
    "Verbessern": "[fer-bés-arn] (o 'v' inicial tem som de 'f')",
    "Sammeln": "[zá-mel'n] (o 's' inicial tem som de 'z')",
    "Gedeihen": "[gue-dá-ien] (o 'ei' soa como 'ai')",
    "Anerkennen": "[án-er-kê-nen] (pronúncia firme com acento no 'an')",
    "Bestimmen": "[be-chtí-men] (o 'st' soa como 'cht')",
    "Erwerben": "[er-vér-ben] (o 'w' alemão tem som de 'v')",
    "Bewältigen": "[be-vél-ti-ghen] (o 'ä' soa como 'é' aberto)",
    "Lösen": "[lǿ-zen] (o 'ö' é dito fazendo bico de 'o' e pronunciando 'e')",
    "Betonen": "[be-tó-nen] (pronúncia direta com vogais longas)",
    "Erhalten": "[er-hál-ten] (o 'h' é aspirado suavemente como em inglês)",
    "Bemühen": "[be-mǘ-en] (o 'ü' é dito fazendo bico de 'u' e pronunciando 'i')",
    "Machbar": "[máh-bar] (o 'ch' tem som áspero na garganta)",
    "Zögerlich": "[tsǿ-guer-lih] (o 'z' soa como 'ts', 'ch' final é um sopro suave)",
    "Befürworten": "[be-fǘr-vor-ten] (o 'w' soa como 'v')",
    "Mehrdeutig": "[méer-doi-tih] (o 'eu' soa como 'oi', 'ig' final soa como 'ih' soprado)",
    "Schlüssig": "[chlǘ-sih] (o 'sch' soa como 'ch', 'ü' com bico de u e som de i)",
    "Abweichen": "[áp-vai-hen] (o 'b' soa como 'p' e 'ch' é um sopro)",
    "Unvermeidlich": "[ún-fer-maid-lih] (o 'v' soa como 'f', 'ei' soa como 'ai')",
    "Gegenseitig": "[ghé-ghen-zai-tih] (o 's' soa como 'z', o 'g' é seco)",
    "Nachträglich": "[náh-trêg-lih] (o 'ch' é gutural áspero e 'ä' soa como 'ê')",

    // Latim
    "Augere": "[áu-gue-re] (o 'g' é sempre seco como em 'gato')",
    "Colligere": "[col-lí-gue-re] (pronúncia clara)",
    "Florere": "[flo-ré-re] (pronúncia aberta)",
    "Cognoscere": "[cog-nós-ke-re] (na pronúncia clássica, o 'sc' soa como 'sk')",
    "Decernere": "[de-kér-ne-re] (na clássica, o 'c' tem som de 'k')",
    "Parare": "[pa-rá-re] (pronúncia ritmada e direta)",
    "Tolerare": "[to-le-rá-re] (pronúncia direta)",
    "Solvere": "[sól-we-re] (no latim clássico, o 'v' soa como 'w')",
    "Ostendere": "[os-tén-de-re] (pronúncia clássica)",
    "Tenere": "[te-né-re] (pronúncia clássica)",
    "Labor": "[lá-bor] (vogal 'a' longa)",
    "Possibilis": "[pos-sí-bi-lis] (pronúncia fluida)",
    "Dubitare": "[du-bi-tá-re] (pronúncia clássica)",
    "Defendere": "[de-fén-de-re] (som de 'k' ou 'f' direto)",
    "Dubius": "[dú-bi-us] (o 'u' final é curto)",
    "Clarus": "[klá-rus] (pronúncia limpa e imponente)",
    "Avertere": "[a-wér-te-re] (o 'v' clássico soa como 'w')",
    "Inevitabilis": "[i-ne-wi-tá-bi-lis] (o 'v' clássico soa como 'w')",
    "Mutuus": "[mú-tu-us] (vogal dupla no final)",
    "Sequens": "[sé-kwens] (o 'qu' soa como 'kw')",

    // Lingala
    "Koyekola": "[co-ié-co-la] (pronúncia rítmica aberta)",
    "Kosala": "[co-sá-la] (o 's' é sempre limpo, sem som de z)",
    "Kokende": "[co-kén-de] (o 'n' é pré-nasalizado colado no 'd')",
    "Kosomba": "[co-sóm-ba] (o 'm' é colado de forma anasalada no 'b')",
    "Kolia": "[co-lí-a] (pronúncia rápida)",
    "Kozwa": "[co-zuá] (o 'z' tem som de z de zebra)",
    "Koloba": "[co-ló-ba] (pronúncia direta)",
    "Koyemba": "[co-iém-ba] (o 'm' é pré-nasalizado colado no 'b')",
    "Kobina": "[co-bí-na] (pronúncia cantada)",
    "Koyoka": "[co-ió-ca] (pronúncia direta)",
    "Malamu": "[ma-lá-mu] (palavra muito usada para expressar bem-estar)",
    "Kitoko": "[ki-tó-co] (o primeiro 'o' é semi-aberto)",
    "Mposa": "[mpó-sa] (o 'm' inicial é colado no 'p' sem vogal entre eles)",
    "Mosika": "[mo-sí-ka] (pronúncia limpa)",
    "Pene": "[pé-ne] (ambas as vogais fechadas)",
    "Tongo": "[tón-go] (o 'n' e o 'g' são fundidos de forma anasalada)",
    "Pokwa": "[pó-kua] (o 'o' é aberto e o 'w' soa como 'u')",
    "Lobi": "[ló-bi] (o 'o' é aberto)",
    "Lelo": "[lé-lo] (o 'e' é aberto e o 'o' é fechado)",
    "Mokolo": "[mo-kó-lo] (pronúncia simétrica)",

    // Kimbundu
    "Kuxima": "[ku-chí-ma] (o 'x' tem som de 'ch' de chuva)",
    "Kizola": "[ki-zó-la] (o 'z' é vibrado de zebra e o 'o' é aberto)",
    "Kikalaku": "[ki-ka-lá-ku] (o 'u' final é muito curto e suave)",
    "Kusumba": "[ku-súm-ba] (o 'm' e o 'b' são pronunciados de forma colada)",
    "Kudia": "[ku-dí-a] (pronúncia direta e aberta)",
    "Kubaka": "[ku-bá-ka] (pronúncia limpa)",
    "Kuzuela": "[ku-zu-é-la] (o 'z' é limpo e vibrado)",
    "Kuimba": "[ku-ím-ba] (o 'm' é pré-nasalizado colado no 'b')",
    "Kubina": "[ku-bí-na] (pronúncia melódica)",
    "Kufuita": "[ku-fu-í-ta] (pronúncia direta)",
    "Kiambote": "[ki-am-bó-te] (o 'm' e 'b' são fundidos, o 'e' final soa quase como 'i')",
    "Kidi": "[kí-di] (pronúncia curta e direta)",
    "Kitadi": "[ki-tá-di] (as vogais são abertas)",
    "Mbolo": "[mbó-lo] (o 'm' inicial colado ao 'b', e o 'o' é fechado)",
    "Njila": "[ndjí-la] (o 'nj' soa como 'di' de 'dia' em algumas regiões ou 'dj' suave)",
    "Lero": "[lé-ro] (o 'e' é aberto)",
    "Mazuda": "[ma-zú-da] (as vogais são muito abertas e limpas)",
    "Nzo": "[ndzó] (o 'n' inicial é pré-nasalizado colado ao 'z')",
    "Muenhu": "[mu-é-nhu] (o 'nh' soa como o 'nh' de ninho, com som de u final fechado)",

    // Italiano
    "Migliorare": "[mi-ljo-rá-re] (o 'gli' soa como o 'lh' em português)",
    "Raccogliere": "[rak-kó-lje-re] (o 'gli' soa como 'lh', o 'c' duplo é mais forte)",
    "Fiorire": "[fjo-rí-re] (pronúncia fluida e aberta)",
    "Riconoscere": "[ri-co-nó-che-re] (o 'sc' antes de 'e' soa como 'ch' de chuva)",
    "Determinare": "[de-ter-mi-ná-re] (pronúncia direta)",
    "Acquisire": "[ac-kui-zí-re] (o 's' tem som de 'z')",
    "Affrontare": "[af-fron-tá-re] (consoantes duplas pronunciadas com mais força)",
    "Risolvere": "[ri-zól-ve-re] (o 's' soa suave entre as vogais)",
    "Evidenziare": "[e-vi-den-tsjá-re] (o 'z' soa como 'ts')",
    "Sostenere": "[sos-te-né-re] (pronúncia ritmada)",
    "Sforzo": "[sfór-tso] (o 'z' soa como 'ts')",
    "Fattibile": "[fat-tí-bi-le] (o 'tt' duplo é pronunciado de forma alongada/pausada)",
    "Riluttante": "[ri-lut-tán-te] (o 'tt' duplo é forte)",
    "Difendere": "[di-fén-de-re] (pronúncia fluida)",
    "Ambiguo": "[am-bí-guo] (pronúncia direta)",
    "Coerente": "[co-e-rén-te] (pronúncia limpa)",
    "Deviare": "[de-vjá-re] (pronúncia fluida)",
    "Inevitabile": "[i-ne-vi-tá-bi-le] (pronúncia rítmica)",
    "Reciproco": "[re-chí-pro-co] (o 'c' antes de 'i' soa como 'ch' de chuva)",
    "Successivo": "[such-ches-sí-vo] (o 'cc' antes de 'e' soa como 'tch' em português)"
  };

  const pronuncia = pronunciaDict[item.term] || `[${item.term.toLowerCase()}] (pronúncia standard)`;

  return {
    id_vocabulario,
    id_licao,
    termo_original: item.term,
    traducao: item.trad,
    pronuncia,
    exemplo_contexto_1: item.ex1,
    exemplo_contexto_2: item.ex2,
    exemplo_contexto_3: item.ex3
  };
}

function getGeneratedGrammar(
  idioma: string,
  level: string,
  lessonIndex: number,
  id_licao: number,
  id_gramatica: number
): Gramatica {
  const rulesDb: Record<string, Array<{title: string, exp: string, challenge: any}>> = {
    "Inglês": [
      {
        title: "Modals of Necessity (Must / Have to)",
        exp: "Em inglês, usamos 'must' para obrigações internas (sentimento próprio) e 'have to' para obrigações externas (regras, leis, circunstâncias). Ex: 'I must study.' / 'I have to wear a uniform.'",
        challenge: {
          tipo: "multipla-escolha",
          pergunta: "Complete properly: 'At our school, we ____ wear a uniform.'",
          opcoes: ["must", "have to", "should", "might"],
          resposta_correta: "have to"
        }
      },
      {
        title: "First Conditional for Future Plans",
        exp: "O 'First Conditional' (if + present simple, will + infinitivo) expressa uma possibilidade real e provável no futuro. Ex: 'If it rains, we will stay at home.'",
        challenge: {
          tipo: "completar-lacuna",
          pergunta: "Complete with the correct form of study: 'If you ___, you will pass the exam.'",
          frase_com_lacuna: "If you ___, you will pass the exam.",
          resposta_correta: "study"
        }
      },
      {
        title: "Active vs. Passive Voice in Technical Reports",
        exp: "A voz passiva é amplamente usada em textos técnicos e científicos para dar ênfase à ação em vez do agente. Ex: 'The sample was analyzed' em vez de 'The scientist analyzed the sample'.",
        challenge: {
          tipo: "multipla-escolha",
          pergunta: "Which sentence is in the passive voice?",
          opcoes: [
            "The team developed a new program.",
            "A new program was developed by the team.",
            "The team is developing a new program.",
            "The team has developed a new program."
          ],
          resposta_correta: "A new program was developed by the team."
        }
      },
      {
        title: "Inversion in Negative Sentences",
        exp: "Para dar ênfase dramática ou formal, podemos iniciar a frase com expressões negativas (ex: 'Never', 'Seldom', 'Hardly') e inverter a ordem do sujeito e do verbo auxiliar. Ex: 'Never have I seen such a beautiful sunrise.'",
        challenge: {
          tipo: "ordenar-palavras",
          pergunta: "Reorder to form an inverted sentence:",
          frase_embaralhada: ["have", "Never", "I", "met", "him"],
          resposta_correta: "Never have I met him"
        }
      }
    ],
    "Espanhol": [
      {
        title: "Uso del Subjuntivo para deseos (Que...)",
        exp: "En español, para expresar un deseo o buen augurio, utilizamos frecuentemente el presente de subjuntivo introducido por 'que'. Ej: '¡Que tengas un buen día!'",
        challenge: {
          tipo: "multipla-escolha",
          pergunta: "Selecciona el verbo correcto para desear un buen viaje: '¡Que ___ un buen viaje!'",
          opcoes: ["tienes", "tengas", "tendrás", "tuviste"],
          resposta_correta: "tengas"
        }
      },
      {
        title: "Por vs. Para en Expresiones de Tiempo",
        exp: "Usamos 'para' para indicar un plazo límite (ex: 'para el lunes') o destino. Usamos 'por' para indicar duración de tempo aproximada (ex: 'por la tarde') o causa.",
        challenge: {
          tipo: "completar-lacuna",
          pergunta: "Completa la frase: 'El informe debe estar listo ___ el lunes.'",
          frase_com_lacuna: "El informe debe estar listo ___ el lunes.",
          resposta_correta: "para"
        }
      }
    ],
    "Francês": [
      {
        title: "Le Futur Simple",
        exp: "O futuro simples em francês expressa projetos, previsões ou planos futuros. É formado a partir do infinitivo do verbo adicionando as desinências -ai, -as, -a, -ons, -ez, -ont. Ex: 'Je parlerai français' (Eu falarei francês).",
        challenge: {
          tipo: "multipla-escolha",
          pergunta: "Choisissez la conjugaison correcte au futur : 'Demain, nous ___ (voyager) à Lyon.'",
          opcoes: ["voyageons", "voyagerons", "voyagerions", "voyagions"],
          resposta_correta: "voyagerons"
        }
      }
    ],
    "Alemão": [
      {
        title: "Nebensätze mit 'weil'",
        exp: "Em alemão, a conjunção explicativa 'weil' (porque) inicia uma oração subordinada, o que força o verbo conjugado a ir obrigatoriamente para a última posição da frase. Ex: 'Ich lerne Deutsch, weil ich in Berlin wohne.'",
        challenge: {
          tipo: "ordenar-palavras",
          pergunta: "Ordene as palavras da oração subordinada com weil: '..., weil ich Deutsch lerne.'",
          frase_embaralhada: ["Deutsch", "weil", "ich", "lerne"],
          resposta_correta: "weil ich Deutsch lerne"
        }
      }
    ],
    "Latim": [
      {
        title: "O Caso Nominativo para Sujeito",
        exp: "Em latim, a função gramatical de sujeito da oração é marcada pelo Caso Nominativo. Ex: 'Marcus domum redit' (Marcos retorna para casa).",
        challenge: {
          tipo: "multipla-escolha",
          pergunta: "Na frase 'Augustus imperator est', qual palavra está no Nominativo atuando como sujeito?",
          opcoes: ["Augustus", "est", "mea", "patris"],
          resposta_correta: "Augustus"
        }
      }
    ],
    "Lingala": [
      {
        title: "O Prefixo de Concordância Verbal 'E-'",
        exp: "Em Lingala, os verbos concordam com o sujeito. Para substantivos da classe de coisas (não humanas), usamos o prefixo de concordância 'E-' antes do verbo. Ex: 'Nzela ezali malamu' (O caminho é bom).",
        challenge: {
          tipo: "completar-lacuna",
          pergunta: "Complete a frase para 'O caminho é (ezali) bom': 'Nzela ___ malamu.'",
          frase_com_lacuna: "Nzela ___ malamu.",
          resposta_correta: "ezali"
        }
      }
    ],
    "Kimbundu": [
      {
        title: "O Prefixo Concordante de Sujeito 'U-'",
        exp: "Em Kimbundu, para verbos na terceira pessoa do singular que concordam com sujeitos humanos ou de classes afins, usa-se o prefixo 'u-' no radical verbal. Ex: 'Tata wami udia' (Meu pai come).",
        challenge: {
          tipo: "multipla-escolha",
          pergunta: "Como se diz 'O menino come o pão' (Mona = menino, dia = comer, mbolo = pão)?",
          opcoes: ["O mona udia o mbolo", "O mona kudia o mbolo", "O mona tudia o mbolo", "O mona kufuita o mbolo"],
          resposta_correta: "O mona udia o mbolo"
        }
      }
    ],
    "Italiano": [
      {
        title: "Uso di Verbi Ausiliari nel Passato Prossimo",
        exp: "Em italiano, o passado próximo é formado pelo presente de um dos verbos auxiliares (essere ou avere) seguido do particípio passado. Avere é usado para a maioria dos verbos transitivos. Essere é usado para verbos de movimento, mudança de estado e reflexivos, e o particípio concorda com o sujeito. Ex: 'Sono andato' (Fui/Estive - masculino), 'Sono andata' (Fui/Estive - feminino).",
        challenge: {
          tipo: "multipla-escolha",
          pergunta: "Se uma mulher diz 'Eu fui ao cinema ontem', qual é a frase correta em italiano?",
          opcoes: ["Sono andata al cinema ieri.", "Sono andato al cinema ieri.", "Ho andato al cinema ieri.", "Ho andata al cinema ieri."],
          resposta_correta: "Sono andata al cinema ieri."
        }
      }
    ]
  };

  const list = rulesDb[idioma] || rulesDb["Inglês"];
  const item = list[(lessonIndex - 1) % list.length];

  return {
    id_gramatica,
    id_licao,
    regra_titulo: `${item.title} (L${lessonIndex})`,
    explicacao: item.exp,
    desafio_json: item.challenge
  };
}

function getInitialSeed(): AppDatabase {
  const idiomas: Idioma[] = [
    { id_idioma: 1, nome_idioma: "Inglês" },
    { id_idioma: 2, nome_idioma: "Espanhol" },
    { id_idioma: 3, nome_idioma: "Francês" },
    { id_idioma: 4, nome_idioma: "Lingala" },
    { id_idioma: 5, nome_idioma: "Kimbundu" },
    { id_idioma: 6, nome_idioma: "Alemão" },
    { id_idioma: 7, nome_idioma: "Latim" },
    { id_idioma: 8, nome_idioma: "Italiano" }
  ];

  // Níveis (Ordem: 1 = Intermediário, 2 = Médio, 3 = Avançado)
  const niveis: Nivel[] = [
    // Inglês
    { id_nivel: 1, id_idioma: 1, nivel_atual: "Intermediario", ordem_nivel: 1 },
    { id_nivel: 2, id_idioma: 1, nivel_atual: "Medio", ordem_nivel: 2 },
    { id_nivel: 3, id_idioma: 1, nivel_atual: "Avancado", ordem_nivel: 3 },
    // Espanhol
    { id_nivel: 4, id_idioma: 2, nivel_atual: "Intermediario", ordem_nivel: 1 },
    { id_nivel: 5, id_idioma: 2, nivel_atual: "Medio", ordem_nivel: 2 },
    { id_nivel: 6, id_idioma: 2, nivel_atual: "Avancado", ordem_nivel: 3 },
    // Francês
    { id_nivel: 7, id_idioma: 3, nivel_atual: "Intermediario", ordem_nivel: 1 },
    { id_nivel: 8, id_idioma: 3, nivel_atual: "Medio", ordem_nivel: 2 },
    { id_nivel: 9, id_idioma: 3, nivel_atual: "Avancado", ordem_nivel: 3 },
    // Lingala
    { id_nivel: 10, id_idioma: 4, nivel_atual: "Intermediario", ordem_nivel: 1 },
    { id_nivel: 11, id_idioma: 4, nivel_atual: "Medio", ordem_nivel: 2 },
    { id_nivel: 12, id_idioma: 4, nivel_atual: "Avancado", ordem_nivel: 3 },
    // Kimbundu
    { id_nivel: 13, id_idioma: 5, nivel_atual: "Intermediario", ordem_nivel: 1 },
    { id_nivel: 14, id_idioma: 5, nivel_atual: "Medio", ordem_nivel: 2 },
    { id_nivel: 15, id_idioma: 5, nivel_atual: "Avancado", ordem_nivel: 3 },
    // Alemão
    { id_nivel: 16, id_idioma: 6, nivel_atual: "Intermediario", ordem_nivel: 1 },
    { id_nivel: 17, id_idioma: 6, nivel_atual: "Medio", ordem_nivel: 2 },
    { id_nivel: 18, id_idioma: 6, nivel_atual: "Avancado", ordem_nivel: 3 },
    // Latim
    { id_nivel: 19, id_idioma: 7, nivel_atual: "Intermediario", ordem_nivel: 1 },
    { id_nivel: 20, id_idioma: 7, nivel_atual: "Medio", ordem_nivel: 2 },
    { id_nivel: 21, id_idioma: 7, nivel_atual: "Avancado", ordem_nivel: 3 },
    // Italiano
    { id_nivel: 22, id_idioma: 8, nivel_atual: "Intermediario", ordem_nivel: 1 },
    { id_nivel: 23, id_idioma: 8, nivel_atual: "Medio", ordem_nivel: 2 },
    { id_nivel: 24, id_idioma: 8, nivel_atual: "Avancado", ordem_nivel: 3 }
  ];

  const licoes: Licao[] = [
    // Inglês Intermediário
    { id_licao: 1, id_nivel: 1, titulo: "Expressões de Conversação e Trabalho", ordem_licao: 1 },
    { id_licao: 2, id_nivel: 1, titulo: "Como Expressar Opiniões e Debater", ordem_licao: 2 },
    { id_licao: 23, id_nivel: 1, titulo: "Expressões de Viagem e Direções Básicas", ordem_licao: 3 },
    // Inglês Médio
    { id_licao: 3, id_nivel: 2, titulo: "Entendendo Notícias e Reportagens", ordem_licao: 1 },
    { id_licao: 24, id_nivel: 2, titulo: "Redação de E-mails Comerciais e Correspondência", ordem_licao: 2 },
    // Inglês Avançado
    { id_licao: 4, id_nivel: 3, titulo: "Idiomatismos e Inglês Acadêmico", ordem_licao: 1 },
    { id_licao: 25, id_nivel: 3, titulo: "Debates Acadêmicos e Escrita Científica", ordem_licao: 2 },

    // Espanhol Intermediário
    { id_licao: 5, id_nivel: 4, titulo: "La rutina diaria y expresiones de tiempo", ordem_licao: 1 },
    { id_licao: 26, id_nivel: 4, titulo: "Viajes, Hoteles y Direcciones en la Ciudad", ordem_licao: 2 },
    { id_licao: 27, id_nivel: 4, titulo: "Compras y Comer en Restaurantes", ordem_licao: 3 },
    // Espanhol Médio
    { id_licao: 6, id_nivel: 5, titulo: "Debatir sobre tecnología y sociedad", ordem_licao: 1 },
    { id_licao: 28, id_nivel: 5, titulo: "Redación Comercial y Reuniones de Trabajo", ordem_licao: 2 },
    // Espanhol Avançado
    { id_licao: 7, id_nivel: 6, titulo: "Literatura, modismos y redacción formal", ordem_licao: 1 },
    { id_licao: 29, id_nivel: 6, titulo: "Modismos Regionales y Literatura Clásica", ordem_licao: 2 },

    // Francês Intermediário
    { id_licao: 8, id_nivel: 7, titulo: "Parler du futur et de projets personnels", ordem_licao: 1 },
    { id_licao: 30, id_nivel: 7, titulo: "Les voyages et la réservation d'hôtels", ordem_licao: 2 },
    { id_licao: 31, id_nivel: 7, titulo: "Faire des achats et commander au restaurant", ordem_licao: 3 },
    // Francês Médio
    { id_licao: 9, id_nivel: 8, titulo: "L'art, le cinéma et la culture française", ordem_licao: 1 },
    { id_licao: 32, id_nivel: 8, titulo: "La correspondance professionnelle et e-mails", ordem_licao: 2 },
    // Francês Avançado
    { id_licao: 10, id_nivel: 9, titulo: "Débats complexes et langage idiomatique", ordem_licao: 1 },
    { id_licao: 33, id_nivel: 9, titulo: "La philosophie, politique et l'histoire", ordem_licao: 2 },

    // Lingala Intermediário
    { id_licao: 11, id_nivel: 10, titulo: "Koyekola Lingala: Saudações e Conversa Básica", ordem_licao: 1 },
    { id_licao: 34, id_nivel: 10, titulo: "Kolia na Ndaku: Alimentação e Refeições", ordem_licao: 2 },
    { id_licao: 35, id_nivel: 10, titulo: "Kozwa nzela: Direções e Viagens", ordem_licao: 3 },
    // Lingala Médio
    { id_licao: 12, id_nivel: 11, titulo: "Kosolola na Lingala: Expressões do Cotidiano", ordem_licao: 1 },
    { id_licao: 36, id_nivel: 11, titulo: "Kosala na Ndaku: Comércio e Negócios", ordem_licao: 2 },
    // Lingala Avançado
    { id_licao: 13, id_nivel: 12, titulo: "Cultura e Ditados Populares em Lingala", ordem_licao: 1 },
    { id_licao: 37, id_nivel: 12, titulo: "Nzembo na Lingala: Música e Poesia", ordem_licao: 2 },

    // Kimbundu Intermediário
    { id_licao: 14, id_nivel: 13, titulo: "Saudações da Manhã", ordem_licao: 1 },
    { id_licao: 38, id_nivel: 13, titulo: "Kudia: Refeições e Alimentos", ordem_licao: 2 },
    { id_licao: 39, id_nivel: 13, titulo: "Kukita: Direções e Localização", ordem_licao: 3 },
    // Kimbundu Médio
    { id_licao: 15, id_nivel: 14, titulo: "Ondaka na Kizomba: Frases e Interações", ordem_licao: 1 },
    { id_licao: 40, id_nivel: 14, titulo: "Usumbilo: Comércio e Trocas", ordem_licao: 2 },
    // Kimbundu Avançado
    { id_licao: 16, id_nivel: 15, titulo: "Provérbios e Expressões Avançadas em Kimbundu", ordem_licao: 1 },
    { id_licao: 41, id_nivel: 15, titulo: "Kuimbi: Cantos, Contos e Tradição Oral", ordem_licao: 2 },

    // Alemão Intermediário
    { id_licao: 17, id_nivel: 16, titulo: "Alltägliche Ausdrücke (Expressões do dia a dia)", ordem_licao: 1 },
    { id_licao: 42, id_nivel: 16, titulo: "Einkaufen und Essen gehen (Compras)", ordem_licao: 2 },
    { id_licao: 43, id_nivel: 16, titulo: "Reisen und Wegbeschreibungen (Viagens)", ordem_licao: 3 },
    // Alemão Médio
    { id_licao: 18, id_nivel: 17, titulo: "Kultur und Redewendungen (Cultura e Expressões)", ordem_licao: 1 },
    { id_licao: 44, id_nivel: 17, titulo: "Arbeitswelt und E-Mails (Trabalho)", ordem_licao: 2 },
    // Alemão Avançado
    { id_licao: 19, id_nivel: 18, titulo: "Beruf und Fortgeschrittene Grammatik (Trabalho)", ordem_licao: 1 },
    { id_licao: 45, id_nivel: 18, titulo: "Politik, Philosophie und Wissenschaftliche Debatte", ordem_licao: 2 },

    // Latim Intermediário
    { id_licao: 20, id_nivel: 19, titulo: "Sententiae Antiquae (Provérbios e Expressões)", ordem_licao: 1 },
    { id_licao: 46, id_nivel: 19, titulo: "De Familia et Domo (Família e Lar Romano)", ordem_licao: 2 },
    { id_licao: 47, id_nivel: 19, titulo: "De Cibo et Convivio (Comida e Banquetes)", ordem_licao: 3 },
    // Latim Médio
    { id_licao: 21, id_nivel: 20, titulo: "Philosophia et Historia (Textos Clássicos Intermediários)", ordem_licao: 1 },
    { id_licao: 48, id_nivel: 20, titulo: "De Bello et Historia (Guerra e Narrativa Histórica)", ordem_licao: 2 },
    // Latim Avançado
    { id_licao: 22, id_nivel: 21, titulo: "Poesis et Res Publica (Poesia e Discursos Avançados)", ordem_licao: 1 },
    { id_licao: 49, id_nivel: 21, titulo: "De Philosophia et Legibus (Leis e Filosofia)", ordem_licao: 2 },
    // Italiano Intermediário
    { id_licao: 50, id_nivel: 22, titulo: "Espressioni di Conversazione e Saluti", ordem_licao: 1 },
    // Italiano Médio
    { id_licao: 51, id_nivel: 23, titulo: "Arte, Musica e la Cultura Italiana", ordem_licao: 1 },
    // Italiano Avançado
    { id_licao: 52, id_nivel: 24, titulo: "Letteratura, Modi di Dire e Dialetti", ordem_licao: 1 }
  ];

  const vocabularios: Vocabulario[] = [
    // Inglês Intermediário - Lição 1
    {
      id_vocabulario: 1,
      id_licao: 1,
      termo_original: "Accomplish",
      traducao: "Realizar / Conquistar / Concluir",
      url_imagem: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "We can accomplish anything if we stay focused.",
      exemplo_contexto_2: "She accomplished her target in record time.",
      exemplo_contexto_3: "It is highly rewarding to accomplish your childhood dreams."
    },
    {
      id_vocabulario: 2,
      id_licao: 1,
      termo_original: "Breakthrough",
      traducao: "Avanço significativo / Descoberta inovadora",
      url_imagem: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "The new vaccine represents a scientific breakthrough.",
      exemplo_contexto_2: "We are on the verge of a major software breakthrough.",
      exemplo_contexto_3: "After months of struggle, the design team made a breakthrough."
    },
    {
      id_vocabulario: 3,
      id_licao: 1,
      termo_original: "Postpone",
      traducao: "Adiar / Postergar",
      url_imagem: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "The coordinator decided to postpone the meeting until Thursday.",
      exemplo_contexto_2: "Do not postpone what you can easily do today.",
      exemplo_contexto_3: "Due to heavy rain, they had to postpone the final tennis match."
    },

    // Inglês Intermediário - Lição 2
    {
      id_vocabulario: 4,
      id_licao: 2,
      termo_original: "Persuade",
      traducao: "Persuadir / Convencer",
      url_imagem: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "He tried to persuade the board to increase the marketing budget.",
      exemplo_contexto_2: "It is hard to persuade someone who has already made up their mind.",
      exemplo_contexto_3: "Great speakers know how to persuade human hearts easily."
    },

    // Inglês Médio - Lição 3
    {
      id_vocabulario: 5,
      id_licao: 3,
      termo_original: "Overwhelming",
      traducao: "Avassalador / Esmagador",
      url_imagem: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "The response from our global community was truly overwhelming.",
      exemplo_contexto_2: "She felt an overwhelming sense of relief when she got the grade.",
      exemplo_contexto_3: "The amount of new information on the server was overwhelming."
    },

    // Inglês Avançado - Lição 4
    {
      id_vocabulario: 6,
      id_licao: 4,
      termo_original: "Inquisitive",
      traducao: "Curioso / Inquisitivo",
      url_imagem: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "The young student had an inquisitive mind and constantly asked questions.",
      exemplo_contexto_2: "To learn complex sciences, you must maintain an inquisitive attitude.",
      exemplo_contexto_3: "Journalists are naturally inquisitive about political events."
    },

    // Espanhol Intermediário - Lição 5
    {
      id_vocabulario: 7,
      id_licao: 5,
      termo_original: "Desayunar",
      traducao: "Tomar café da manhã",
      url_imagem: "https://images.unsplash.com/photo-1496042300830-85216d73a177?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Siempre me gusta desayunar café caliente con tostadas.",
      exemplo_contexto_2: "¿A qué hora sueles desayunar durante los fines de semana?",
      exemplo_contexto_3: "Es muy importante desayunar bien antes de un examen largo."
    },
    {
      id_vocabulario: 8,
      id_licao: 5,
      termo_original: "Acontecimiento",
      traducao: "Acontecimento / Evento marcante",
      url_imagem: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "La boda de mi hermana fue el acontecimiento más lindo del año.",
      exemplo_contexto_2: "Los historiadores discuten la importancia de aquel gran acontecimiento.",
      exemplo_contexto_3: "Queremos reportar en directo cada acontecimiento del festival."
    },

    // Espanhol Médio - Lição 6
    {
      id_vocabulario: 9,
      id_licao: 6,
      termo_original: "Inalámbrico",
      traducao: "Sem fio / Wireless",
      url_imagem: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Prefiero usar auriculares inalámbricos cuando voy a correr.",
      exemplo_contexto_2: "La tecnología de carga inalámbrica es cada vez más rápida.",
      exemplo_contexto_3: "Los ratones inalámbricos ahorran mucho espaço en el escritorio."
    },

    // Espanhol Avançado - Lição 7
    {
      id_vocabulario: 10,
      id_licao: 7,
      termo_original: "Desafortunadamente",
      traducao: "Infelizmente / Desafortunadamente",
      url_imagem: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Desafortunadamente, todas las entradas para el concierto ya están agotadas.",
      exemplo_contexto_2: "El vuelo se retrasó y desafortunadamente perdimos la conexión.",
      exemplo_contexto_3: "Desafortunadamente, el tiempo para completar el test se ha terminado."
    },

    // Francês Intermediário - Lição 8
    {
      id_vocabulario: 11,
      id_licao: 8,
      termo_original: "Améliorer",
      traducao: "Melhorar / Aperfeiçoar",
      url_imagem: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Je veux pratiquer tous les jours pour améliorer mon français.",
      exemplo_contexto_2: "Cette nouvelle mise à jour va améliorer les performances de l'application.",
      exemplo_contexto_3: "Il cherche des moyens d'améliorer sa technique de natation."
    },
    {
      id_vocabulario: 12,
      id_licao: 8,
      termo_original: "Quotidien",
      traducao: "Diário / Cotidiano",
      url_imagem: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Le café est un élément essentiel de mon rituel quotidien.",
      exemplo_contexto_2: "Lire un chapitre de livre fait partie de son entraînement quotidien.",
      exemplo_contexto_3: "La routine quotidienne peut parfois sembler un peu monotone."
    },

    // Francês Médio - Lição 9
    {
      id_vocabulario: 13,
      id_licao: 9,
      termo_original: "Chef-d'œuvre",
      traducao: "Obra-prima",
      url_imagem: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "La Joconde est considérée comme un chef-d'œuvre de la Renaissance.",
      exemplo_contexto_2: "Ce film d'auteur est un véritable chef-d'œuvre cinématographique.",
      exemplo_contexto_3: "L'architecte a consacré toute sa vie à concevoir ce chef-d'œuvre."
    },

    // Francês Avançado - Lição 10
    {
      id_vocabulario: 14,
      id_licao: 10,
      termo_original: "Épouvantable",
      traducao: "Terrível / Assustador / Medonho",
      url_imagem: "https://images.unsplash.com/photo-1475116127127-e3607e15a4b0?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "La tempête d'hier soir a causé des dégâts épouvantables dans la região.",
      exemplo_contexto_2: "Il y avait un bruit épouvantable qui venait du sous-sol.",
      exemplo_contexto_3: "Le trafic durant l'heure de pointe était tout simplement épouvantable."
    },

    // Lingala Vocabulários
    {
      id_vocabulario: 15,
      id_licao: 11,
      termo_original: "Mbote",
      traducao: "Olá / Saudações",
      url_imagem: "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Mbote na bino nyonso! (Olá a todos vocês!)",
      exemplo_contexto_2: "Mbote ndeko, sango nini? (Olá irmão, quais as novidades?)",
      exemplo_contexto_3: "Pesela ngai ye mbote! (Diga olá a ele por mim!)"
    },
    {
      id_vocabulario: 16,
      id_licao: 12,
      termo_original: "Sango nini?",
      traducao: "Quais as novidades? / Como vai?",
      url_imagem: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Sango nini ndeko na ngai? (Como vai meu irmão?)",
      exemplo_contexto_2: "Sango te, malamu mpenza! (Nenhuma novidade, muito bem!)",
      exemplo_contexto_3: "Oyaki kosolola, sango nini? (Você veio conversar, quais as novidades?)"
    },
    {
      id_vocabulario: 17,
      id_licao: 13,
      termo_original: "Malamu",
      traducao: "Bom / Bem",
      url_imagem: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Nazali malamu, mersi. (Estou bem, obrigado.)",
      exemplo_contexto_2: "Eloko malamu mpenza! (Uma coisa muito boa!)",
      exemplo_contexto_3: "Kozala malamu ezali likabo ya Nzambe. (Estar bem é um presente de Deus.)"
    },

    // Kimbundu Vocabulários
    {
      id_vocabulario: 18,
      id_licao: 14,
      termo_original: "Wazekele kyebhi?",
      traducao: "Como amanheceu? / Bom dia!",
      pronuncia: "u-a-ze-ké-le ki-é-bhi?",
      url_imagem: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Wazekele kyebhi, tata! (Como amanheceu, pai!)",
      exemplo_contexto_2: "Wazekele kyebhi, dikamba! (Como amanheceu, amigo!)"
    },
    {
      id_vocabulario: 1801,
      id_licao: 14,
      termo_original: "Ngazekele kyambote",
      traducao: "Amanheci bem. / Estou bem (resposta ao bom dia).",
      pronuncia: "nga-ze-ké-le ki-am-bó-te",
      url_imagem: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "Ngazekele kyambote, ndenge yami. (Amanheci bem, meu irmão caçula.)",
      exemplo_contexto_2: "Ngazekele kyambote, muenhu uami. (Amanheci bem, minha vida.)"
    },
    {
      id_vocabulario: 1802,
      id_licao: 14,
      termo_original: "Dikamba",
      traducao: "Amigo / Companheiro",
      pronuncia: "di-kám-ba",
      url_imagem: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80",
      exemplo_contexto_1: "O dikamba dyami diambote. (Meu bom amigo.)",
      exemplo_contexto_2: "Dikamba dya kidi. (Amigo de verdade.)"
    },
    {
      id_vocabulario: 19,
      id_licao: 15,
      termo_original: "Ondaka",
      traducao: "Palavra / Assunto / Notícia",
      exemplo_contexto_1: "Ngana, ngala ni ondaka ya mbote. (Senhor, tenho uma boa palavra.)",
      exemplo_contexto_2: "Ondaka yé yazubila. (A sua palavra foi cumprida.)",
      exemplo_contexto_3: "Kuzuela ni ondaka ya kidi. (Fale com uma palavra de verdade.)"
    },
    {
      id_vocabulario: 20,
      id_licao: 16,
      termo_original: "Kizomba",
      traducao: "Festa / Encontro / Confraternização",
      exemplo_contexto_1: "Lelo tuaza ku kizomba! (Hoje vamos para a festa!)",
      exemplo_contexto_2: "O kizomba kiambote mpenza kieny. (A festa de vocês foi muito boa.)",
      exemplo_contexto_3: "Mu kizomba mutubina mbote. (Dançamos bem na festa.)"
    },

    // Alemão Vocabulários
    {
      id_vocabulario: 21,
      id_licao: 17,
      termo_original: "Hervorragend",
      traducao: "Excelente / Fantástico",
      exemplo_contexto_1: "Das Wetter heute ist einfach hervorragend.",
      exemplo_contexto_2: "Ihre Deutschkenntnisse sind bereits hervorragend.",
      exemplo_contexto_3: "Er hat eine hervorragende Präsentation gehalten."
    },
    {
      id_vocabulario: 22,
      id_licao: 18,
      termo_original: "Feierabend",
      traducao: "Fim do expediente / Descanso",
      exemplo_contexto_1: "Endlich Feierabend! Ich gehe nach Hause.",
      exemplo_contexto_2: "Schönen Feierabend! Bis morgen.",
      exemplo_contexto_3: "Nach dem Feierabend trinken wir ein kühles Bier."
    },
    {
      id_vocabulario: 23,
      id_licao: 19,
      termo_original: "Entscheidung",
      traducao: "Decisão / Escolha",
      exemplo_contexto_1: "Das ist eine sehr wichtige Entscheidung für das Projekt.",
      exemplo_contexto_2: "Ich muss heute eine schwierige Entscheidung treffen.",
      exemplo_contexto_3: "Ihre Entscheidung wurde vom Team voll unterstützt."
    },

    // Latim Vocabulários
    {
      id_vocabulario: 24,
      id_licao: 20,
      termo_original: "Carpe diem",
      traducao: "Aproveite o dia / Colha o dia",
      exemplo_contexto_1: "Memento mori, ergo carpe diem. (Lembre-se da morte, portanto aproveite o dia.)",
      exemplo_contexto_2: "Carpe diem quam minimum credula postero. (Aproveite o dia confiando o mínimo no amanhã.)",
      exemplo_contexto_3: "Sapientes semper carpe diem colunt. (Os sábios sempre aproveitam o dia.)"
    },
    {
      id_vocabulario: 25,
      id_licao: 21,
      termo_original: "Veritas",
      traducao: "Verdade",
      exemplo_contexto_1: "In vino veritas. (Na bebida/no vinho está a verdade.)",
      exemplo_contexto_2: "Veritas odium parit, obsequium amicos. (A verdade gera ódio, a complacência gera amigos.)",
      exemplo_contexto_3: "Magna est veritas et praevalebit. (Grande é a verdade e ela prevalecerá.)"
    },
    {
      id_vocabulario: 26,
      id_licao: 22,
      termo_original: "Scientia",
      traducao: "Conhecimento / Ciência",
      exemplo_contexto_1: "Scientia potentia est. (O conhecimento é poder.)",
      exemplo_contexto_2: "Sine scientia ars nihil est. (Sem conhecimento, a arte não é nada.)",
      exemplo_contexto_3: "Scientia et fides hominem illuminant. (Ciência e fé iluminam o homem.)"
    },
    // Inglês Intermediário - Lição 23
    {
      id_vocabulario: 27,
      id_licao: 23,
      termo_original: "Luggage",
      traducao: "Bagagem / Malas",
      exemplo_contexto_1: "Please keep an eye on your luggage at the station.",
      exemplo_contexto_2: "Do you have any liquid items in your hand luggage?",
      exemplo_contexto_3: "The airline lost my luggage on my way to London."
    },
    {
      id_vocabulario: 28,
      id_licao: 23,
      termo_original: "Itinerary",
      traducao: "Itinerário / Roteiro de viagem",
      exemplo_contexto_1: "We need to follow the travel itinerary to avoid delays.",
      exemplo_contexto_2: "Our current itinerary includes a three-day stop in Paris.",
      exemplo_contexto_3: "He shared his detailed itinerary with his family before leaving."
    },
    // Inglês Médio - Lição 24
    {
      id_vocabulario: 29,
      id_licao: 24,
      termo_original: "Negotiate",
      traducao: "Negociar / Entrar em acordo",
      exemplo_contexto_1: "The procurement team is trying to negotiate a better deal.",
      exemplo_contexto_2: "It is essential to negotiate terms before signing any contract.",
      exemplo_contexto_3: "She knows how to negotiate with difficult clients."
    },
    // Inglês Avançado - Lição 25
    {
      id_vocabulario: 30,
      id_licao: 25,
      termo_original: "Hypothesis",
      traducao: "Hipótese / Suposição científica",
      exemplo_contexto_1: "The scientist proposed a bold hypothesis to explain the results.",
      exemplo_contexto_2: "We need more empirical data to test our hypothesis.",
      exemplo_contexto_3: "Their theory was built on a very solid hypothesis."
    },

    // Espanhol Intermediário - Lição 26
    {
      id_vocabulario: 31,
      id_licao: 26,
      termo_original: "Alojamiento",
      traducao: "Hospedagem / Alojamento",
      exemplo_contexto_1: "Buscamos un alojamiento barato cerca del centro histórico.",
      exemplo_contexto_2: "El precio del tour ya incluye el alojamiento de cinco noches.",
      exemplo_contexto_3: "Este hotel ofrece un alojamiento muy cómodo y seguro."
    },
    // Espanhol Intermediário - Lição 27
    {
      id_vocabulario: 32,
      id_licao: 27,
      termo_original: "Cuenta",
      traducao: "Conta (em restaurante/banco)",
      exemplo_contexto_1: "Camarero, por favor, ¿me trae la cuenta cuando pueda?",
      exemplo_contexto_2: "Queremos pagar la cuenta por separado.",
      exemplo_contexto_3: "Olvidé mi tarjeta y no pude pagar la cuenta."
    },
    // Espanhol Médio - Lição 28
    {
      id_vocabulario: 33,
      id_licao: 28,
      termo_original: "Presupuesto",
      traducao: "Orçamento",
      exemplo_contexto_1: "El presupuesto asignado al proyecto es muy limitado.",
      exemplo_contexto_2: "Necesitamos un presupuesto detallado para las obras.",
      exemplo_contexto_3: "No podemos exceder nuestro presupuesto mensual."
    },
    // Espanhol Avançado - Lição 29
    {
      id_vocabulario: 34,
      id_licao: 29,
      termo_original: "Coyuntura",
      traducao: "Conjuntura / Situação momentânea",
      exemplo_contexto_1: "La coyuntura económica mundial exige decisiones prudentes.",
      exemplo_contexto_2: "Analizamos la coyuntura política antes de invertir en la região.",
      exemplo_contexto_3: "Es un gran desafío prosperar en esta compleja coyuntura."
    },

    // Francês Intermediário - Lição 30
    {
      id_vocabulario: 35,
      id_licao: 30,
      termo_original: "Hébergement",
      traducao: "Hospedagem / Alojamento",
      exemplo_contexto_1: "Nous avons réservé un hébergement insolite en pleine nature.",
      exemplo_contexto_2: "Le coût de l'hébergement a augmenté pendant la haute saison.",
      exemplo_contexto_3: "Trouver un hébergement à Paris peut s'avérer difficile."
    },
    // Francês Intermediário - Lição 31
    {
      id_vocabulario: 36,
      id_licao: 31,
      termo_original: "L'addition",
      traducao: "A conta (no restaurante)",
      exemplo_contexto_1: "S'il vous plaît, monsieur, je voudrais l'addition.",
      exemplo_contexto_2: "Nous allons partager l'addition en trois.",
      exemplo_contexto_3: "L'addition était plus élevée que prévu."
    },
    // Francês Médio - Lição 32
    {
      id_vocabulario: 37,
      id_licao: 32,
      termo_original: "Fournisseur",
      traducao: "Fornecedor",
      exemplo_contexto_1: "Nous devons contacter notre fournisseur de matières premières.",
      exemplo_contexto_2: "Ce fournisseur propose des tarifs très compétitifs.",
      exemplo_contexto_3: "Il est important de maintenir une bonne relation avec chaque fournisseur."
    },
    // Francês Avançado - Lição 33
    {
      id_vocabulario: 38,
      id_licao: 33,
      termo_original: "Paradigme",
      traducao: "Paradigma / Modelo de pensamento",
      exemplo_contexto_1: "Cette découverte scientifique marque un changement de paradigme.",
      exemplo_contexto_2: "Nous devons adapter notre paradigme de développement urbain.",
      exemplo_contexto_3: "Le nouveau paradigme économique met l'accent sur la durabilité."
    },

    // Lingala Intermediário - Lição 34
    {
      id_vocabulario: 39,
      id_licao: 34,
      termo_original: "Mampa",
      traducao: "Pão",
      exemplo_contexto_1: "Nalingi kolia mampa lelo na tongo. (Quero comer pão hoje de manhã.)",
      exemplo_contexto_2: "Sombela ngai mampa mibale na wenze. (Compre-me dois pães no mercado.)",
      exemplo_contexto_3: "Mampa oyo ezali ya kosila na tongo. (Este pão está fresco de manhã.)"
    },
    // Lingala Intermediário - Lição 35
    {
      id_vocabulario: 40,
      id_licao: 35,
      termo_original: "Nzela",
      traducao: "Caminho / Estrada / Via",
      exemplo_contexto_1: "Nzela oyo ezali malamu mpo na kokende kuna. (Esta estrada é boa para ir lá.)",
      exemplo_contexto_2: "Nazali na nzela ya kokenda mosala. (Estou a caminho do trabalho.)",
      exemplo_contexto_3: "Nzela ya lola ezali monene. (O caminho do céu é grande.)"
    },
    // Lingala Médio - Lição 36
    {
      id_vocabulario: 41,
      id_licao: 36,
      termo_original: "Momongo",
      traducao: "Negócio / Comércio",
      exemplo_contexto_1: "Momongo na ye ezali kokende malamu. (O comércio dele está indo bem.)",
      exemplo_contexto_2: "Nalingi kosala momongo na Kinsasa. (Quero fazer negócios em Kinshasa.)",
      exemplo_contexto_3: "Momongo malamu esengeli motema molai. (Bons negócios exigem paciência.)"
    },
    // Lingala Avançado - Lição 37
    {
      id_vocabulario: 42,
      id_licao: 37,
      termo_original: "Nzembo",
      traducao: "Música / Canção",
      exemplo_contexto_1: "Nzembo oyo ezali kitoko mpenza. (Esta música é muito bonita.)",
      exemplo_contexto_2: "Bana bazali koyemba nzembo ya mbotama. (As crianças estão cantando canções de natal.)",
      exemplo_contexto_3: "Nzembo ya Congo eyebani na mokili mobimba. (A música do Congo é conhecida no mundo inteiro.)"
    },

    // Kimbundu Intermediário - Lição 38
    {
      id_vocabulario: 43,
      id_licao: 38,
      termo_original: "Mbolo",
      traducao: "Pão",
      exemplo_contexto_1: "Ngandala kudia o mbolo. (Eu quero comer o pão.)",
      exemplo_contexto_2: "Sumbela eme o mbolo ja lelo. (Compre para mim o pão de hoje.)",
      exemplo_contexto_3: "O mbolo kiki yambote mpenza. (Este pão é muito bom.)"
    },
    // Kimbundu Intermediário - Lição 39
    {
      id_vocabulario: 44,
      id_licao: 39,
      termo_original: "Njila",
      traducao: "Caminho / Estrada",
      exemplo_contexto_1: "Njila yambote mu nzo yé. (Bom caminho até a sua casa.)",
      exemplo_contexto_2: "O njila ia Luanda ialula. (A estrada de Luanda é longa.)",
      exemplo_contexto_3: "Njila ia kidi inene mpenza. (O caminho da verdade é muito grande.)"
    },
    // Kimbundu Médio - Lição 40
    {
      id_vocabulario: 45,
      id_licao: 40,
      termo_original: "Kitadi",
      traducao: "Dinheiro / Riqueza",
      exemplo_contexto_1: "Eme ngala ni kitadi kia soso. (Eu tenho pouco dinheiro.)",
      exemplo_contexto_2: "O kitadi kizuila mbote kieny. (O dinheiro ajuda vocês.)",
      exemplo_contexto_3: "Kubaka kitadi mu kikalaku kiambote. (Conseguir dinheiro em um bom trabalho.)"
    },
    // Kimbundu Avançado - Lição 41
    {
      id_vocabulario: 46,
      id_licao: 41,
      termo_original: "Muxima",
      traducao: "Coração / Sentimento",
      exemplo_contexto_1: "O muxima wami wasola ué. (O meu coração te ama também.)",
      exemplo_contexto_2: "Kubandula o muxima ni kizola kia kidi. (Curar o coração com amor de verdade.)",
      exemplo_contexto_3: "Muxima wé wazala ni ndenge. (O coração dele se encheu de paz.)"
    },

    // Alemão Intermediário - Lição 42
    {
      id_vocabulario: 47,
      id_licao: 42,
      termo_original: "Lebensmittel",
      traducao: "Alimentos / Mantimentos",
      exemplo_contexto_1: "Wir müssen frische Lebensmittel auf dem Markt kaufen.",
      exemplo_contexto_2: "Lebensmittel sind in den letzten Monaten teurer geworden.",
      exemplo_contexto_3: "Der Supermarkt hat eine große Auswahl an Bio-Lebensmitteln."
    },
    // Alemão Intermediário - Lição 43
    {
      id_vocabulario: 48,
      id_licao: 43,
      termo_original: "Flughafen",
      traducao: "Aeroporto",
      exemplo_contexto_1: "Wie komme ich am schnellsten zum Flughafen?",
      exemplo_contexto_2: "Der Flughafen ist wegen des schlechten Wetters gesperrt.",
      exemplo_contexto_3: "Wir treffen uns morgen direkt am Flughafen."
    },
    // Alemão Médio - Lição 44
    {
      id_vocabulario: 49,
      id_licao: 44,
      termo_original: "Besprechung",
      traducao: "Reunião / Encontro profissional",
      exemplo_contexto_1: "Die Besprechung beginnt pünktlich um zehn Uhr.",
      exemplo_contexto_2: "Wir müssen die Details in einer kurzen Besprechung klären.",
      exemplo_contexto_3: "Ich habe heute eine wichtige Besprechung mit dem Chef."
    },
    // Alemão Avançado - Lição 45
    {
      id_vocabulario: 50,
      id_licao: 45,
      termo_original: "Wissenschaft",
      traducao: "Ciência",
      exemplo_contexto_1: "Die Wissenschaft hat enorme Fortschritte gemacht.",
      exemplo_contexto_2: "Sie arbeitet in der medizinischen Wissenschaft.",
      exemplo_contexto_3: "Wissenschaft und Forschung sind für unsere Zukunft sehr wichtig."
    },

    // Latim Intermediário - Lição 46
    {
      id_vocabulario: 51,
      id_licao: 46,
      termo_original: "Domus",
      traducao: "Casa / Lar",
      exemplo_contexto_1: "Domus mea parva sed pulchra est. (Minha casa é pequena mas bonita.)",
      exemplo_contexto_2: "Domum redire semper iucundum est. (Retornar para casa é sempre agradável.)",
      exemplo_contexto_3: "In domo patris mei mansiones multae sunt. (Na casa de meu pai há muitas moradas.)"
    },
    // Latim Intermediário - Lição 47
    {
      id_vocabulario: 52,
      id_licao: 47,
      termo_original: "Convivium",
      traducao: "Banquete / Festa",
      exemplo_contexto_1: "Magnum convivium apud amicos celebrabamus. (Celebrávamos um grande banquete entre amigos.)",
      exemplo_contexto_2: "In convivio cibi et vina abundant. (No banquete, abundam comidas e vinhos.)",
      exemplo_contexto_3: "Convivium hilaritate plenum erat. (O banquete estava repleto de alegria.)"
    },
    // Latim Médio - Lição 48
    {
      id_vocabulario: 53,
      id_licao: 48,
      termo_original: "Exercitus",
      traducao: "Exército",
      exemplo_contexto_1: "Exercitus romanus ad pugnam se parat. (O exército romano se prepara para a batalha.)",
      exemplo_contexto_2: "Dux fortis exercitum in hostem duxit. (O líder corajoso conduziu o exército contra o inimigo.)",
      exemplo_contexto_3: "Exercitus virtute sua patriam defendit. (O exército defende a pátria com sua virtude.)"
    },
    // Latim Avançado - Lição 49
    {
      id_vocabulario: 54,
      id_licao: 49,
      termo_original: "Ratio",
      traducao: "Razão / Método / Proporção",
      exemplo_contexto_1: "Homines a bestiis ratione differunt. (Os homens diferem das feras pela razão.)",
      exemplo_contexto_2: "Ratio et oratio homines inter se conciliant. (A razão e a fala conciliam os homens entre si.)",
      exemplo_contexto_3: "In omni re ratio sequenda est. (Em todas as coisas, a razão deve ser seguida.)"
    }
  ];

  const gramaticas: Gramatica[] = [
    // Inglês Intermediário - Lição 1
    {
      id_gramatica: 1,
      id_licao: 1,
      regra_titulo: "Present Perfect vs. Simple Past",
      explicacao: "O 'Present Perfect' (have/has + past participle) liga o passado ao presente, expressando ações ocorridas em momentos não especificados. Já o 'Simple Past' expressa ações concluídas em tempos específicos passados (yesterday, last year, in 2020).",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Selecione a forma correta: 'I ____ my keys yesterday, but I ____ them now.'",
        opcoes: [
          "lost / lost",
          "lost / have found",
          "have lost / found",
          "have lost / have found"
        ],
        resposta_correta: "lost / have found"
      }
    },
    // Inglês Intermediário - Lição 2
    {
      id_gramatica: 2,
      id_licao: 2,
      regra_titulo: "First Conditional with Will vs Present Sequence",
      explicacao: "Estruturas condicionais (If + Present Simple, Will + Verb) descrevem uma situação futura provável baseada em condições reais.",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complete a frase condicional: 'If it rains tomorrow, we ___ the soccer match.'",
        frase_com_lacuna: "If it rains tomorrow, we ___ the soccer match.",
        resposta_correta: "will postpone"
      }
    },
    // Inglês Médio - Lição 3
    {
      id_gramatica: 3,
      id_licao: 3,
      regra_titulo: "Indirect Speech / Discurso Indireto",
      explicacao: "Ao relatar o que alguém disse indiretamente, geralmente movemos o tempo verbal um passo no passado (ex: present vira past, can vira could).",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Reordene a frase para formar o discurso indireto correto para: She said, 'I want to study.'",
        frase_embaralhada: ["said", "she", "study", "wanted", "She", "that", "to"],
        resposta_correta: "She said that she wanted to study"
      }
    },
    // Inglês Avançado - Lição 4
    {
      id_gramatica: 4,
      id_licao: 4,
      regra_titulo: "Inversion after negative adverbials",
      explicacao: "Para ênfase literária ou formal, colocamos um advérbio negativo ou limitante (Rarely, Seldom, Little, Under no circumstances) no início da frase, invertendo a ordem do sujeito e do verbo auxiliar.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Escolha a frase gramaticalmente correta em inglês formal:",
        opcoes: [
          "Rarely we accomplish our goals without hard work.",
          "Rarely do we accomplish our goals without hard work.",
          "Rarely we do accomplish our goals without hard work.",
          "Rarely accomplish we our goals without hard work."
        ],
        resposta_correta: "Rarely do we accomplish our goals without hard work."
      }
    },

    // Espanhol Intermediário - Lição 5
    {
      id_gramatica: 5,
      id_licao: 5,
      regra_titulo: "Verbos Reflexivos y Pronombres en Presente",
      explicacao: "Em espanhol, ações diárias usam verbos reflexivos (levantarse, ducharse, peinarse). O pronome reflexivo (me, te, se, nos, os, se) se posiciona antes do verbo conjugado.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Elige la forma reflexiva correcta: 'Mis hermanos siempre ___ a las siete de la mañana.'",
        opcoes: [
          "me levanto",
          "se levantan",
          "te levantas",
          "nos levantamos"
        ],
        resposta_correta: "se levantan"
      }
    },

    // Espanhol Médio - Lição 6
    {
      id_gramatica: 6,
      id_licao: 6,
      regra_titulo: "El Imperfecto de Subjuntivo",
      explicacao: "Utiliza-se para expressar desejos improváveis ou condições hipotéticas em orações com 'si' (Se eu pudesse..., se você quisesse...). Terminações: -ara/-ase, -iera/-iese.",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Completa la frase: 'Si yo ___ (tener) más tiempo libre, estudiaría italiano.'",
        frase_com_lacuna: "Si yo ___ más tiempo libre, estudiaría italiano.",
        resposta_correta: "tuviera"
      }
    },

    // Espanhol Avançado - Lição 7
    {
      id_gramatica: 7,
      id_licao: 7,
      regra_titulo: "El uso del adverbio terminante '-mente'",
      explicacao: "Adverbios de modo criados adicionando '-mente' ao adjetivo feminino (ex: rápida -> rápidamente, desafortunada -> desafortunadamente). Se o adjetivo original tem acento, o advérbio mantém.",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordena las palabras para formar la frase correcta:",
        frase_embaralhada: ["desafortunadamente", "terminó", "tiempo", "El", "ya"],
        resposta_correta: "El tiempo desafortunadamente ya terminó"
      }
    },

    // Francês Intermediário - Lição 8
    {
      id_gramatica: 8,
      id_licao: 8,
      regra_titulo: "Le Futur Simple et ses régularités",
      explicacao: "O futuro simples francês expressa uma ação futura. É formado pelo infinitivo do verbo seguido pelas terminações: -ai, -as, -a, -ons, -ez, -ont. Verbos em '-re' perdem a letra 'e' final.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Choisissez la conjugaison future correcte : 'Demain, je ___ (faire) mes examens.'",
        opcoes: [
          "ferai",
          "fais",
          "faisais",
          "feras"
        ],
        resposta_correta: "ferai"
      }
    },

    // Francês Médio - Lição 9
    {
      id_gramatica: 9,
      id_licao: 9,
      regra_titulo: "Le Gérondif en français (En + Participe Présent)",
      explicacao: "O gerúndio expressa simultaneidade, causa ou modo (ex: En mangeant = comendo/enquanto come). Forma-se removendo o radical da 1ª pessoa plural do presente e adicionando '-ant', precedido de 'en'.",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complétez l'expression : 'C'est ___ (apprendre) tous les jours qu'on s'améliore.'",
        frase_com_lacuna: "C'est ___ tous les jours qu'on s'améliore.",
        resposta_correta: "en apprenant"
      }
    },

    // Francês Avançado - Lição 10
    {
      id_gramatica: 10,
      id_licao: 10,
      regra_titulo: "Le Subjonctif Plus-que-parfait",
      explicacao: "Empregado na literatura ou no francês extremamente formal após conjunções de dúvida ou desejo ocorridos no passado. Forma-se com o subjonctif imparfait do auxiliar (avoir/être) + o particípio passado.",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordonnez la phrase élégante : Bien qu'il ___ (eût fini) son chef-d'œuvre...",
        frase_embaralhada: ["eût", "son", "qu'il", "fini", "Bien", "chef-d'œuvre"],
        resposta_correta: "Bien qu'il eût fini son chef-d'œuvre"
      }
    },

    // Lingala Gramaticas
    {
      id_gramatica: 11,
      id_licao: 11,
      regra_titulo: "Prefixos Pessoais de Sujeito em Lingala",
      explicacao: "Em Lingala, os verbos concordam com o sujeito por meio de prefixos simples: 'Na-' (Eu), 'O-' (Tu), 'A-' (Ele/Ela). Para dizer 'Eu quero', usamos 'Nalingi' (Na + lingi). Para 'Você quer', 'Olingi'.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Como se diz 'Ele quer' (verbo: lingi) em Lingala?",
        opcoes: [
          "Nalingi",
          "Olingi",
          "Alingi",
          "Tulingi"
        ],
        resposta_correta: "Alingi"
      }
    },
    {
      id_gramatica: 12,
      id_licao: 12,
      regra_titulo: "O Tempo Futuro Próximo",
      explicacao: "Para expressar uma ação no futuro no Lingala coloquial, é comum utilizar o auxiliar 'kokende' (ir) conjugado seguido do infinitivo do verbo (ex: 'Nazo kende kosala' - Vou trabalhar).",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complete a frase para dizer 'Eu vou comer' (com funciona com 'Nazo kende' + 'kolia'): 'Nazo kende ___'",
        frase_com_lacuna: "Nazo kende ___",
        resposta_correta: "kolia"
      }
    },
    {
      id_gramatica: 13,
      id_licao: 13,
      regra_titulo: "Ditados Populares e Enfatizadores",
      explicacao: "Em Lingala, a palavra 'mpenza' serve para dar ênfase (muito, realmente, de fato). Ela se posiciona imediatamente depois do adjetivo ou substantivo.",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Reordene a frase para formar 'Eu estou muito bem' em Lingala (Nazali = estou, malamu = bem, mpenza = muito):",
        frase_embaralhada: ["malamu", "Nazali", "mpenza"],
        resposta_correta: "Nazali malamu mpenza"
      }
    },

    // Kimbundu Gramaticas
    {
      id_gramatica: 14,
      id_licao: 14,
      regra_titulo: "Saudações Matinais e Diálogo",
      explicacao: "Para saudar alguém pela manhã em Kimbundu, perguntamos 'Wazekele kyebhi?' (Como você amanheceu? / Bom dia!). A resposta educada padrão é 'Ngazekele kyambote' (Amanheci bem). Essa interação reforça o respeito e a afeição mútua.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Se alguém lhe cumprimentar com 'Wazekele kyebhi?', qual é a resposta correta?",
        opcoes: [
          "Ngazekele kyambote",
          "Kizola kia usendo",
          "Muxima wa ngola",
          "Kiambote ndenge"
        ],
        resposta_correta: "Ngazekele kyambote"
      }
    },
    {
      id_gramatica: 15,
      id_licao: 15,
      regra_titulo: "O Prefixo da Classe Nominal de Coisas e Idiomas",
      explicacao: "O prefixo 'Ki-' ou 'Kie-' é usado em Kimbundu para referir-se a objetos, línguas e qualidades (ex: Kimbundu, kiambote - bom/saudação, kizomba - festa/confraternização).",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complete a frase para 'Olá amigo' em Kimbundu, preenchendo o termo 'Kiambote': '___ mukoetu!'",
        frase_com_lacuna: "___ mukoetu!",
        resposta_correta: "Kiambote"
      }
    },
    {
      id_gramatica: 16,
      id_licao: 16,
      regra_titulo: "Estruturas de Posse em Kimbundu",
      explicacao: "A posse em Kimbundu é indicada pelos determinantes possessivos após o substantivo. Os pronomes possessivos de primeira e segunda pessoa do singular são '-ami' (meu) e '-é' (teu/seu). Exemplo: 'ondaka yami' (minha palavra).",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Reordene a frase 'ondaka yami ya kidi' (minha palavra de verdade):",
        frase_embaralhada: ["ya", "ondaka", "kidi", "yami"],
        resposta_correta: "ondaka yami ya kidi"
      }
    },

    // Alemão Gramaticas
    {
      id_gramatica: 17,
      id_licao: 17,
      regra_titulo: "O Verbo no final com 'weil' (Conjunção causal)",
      explicacao: "Em alemão, a conjunção 'weil' (porque/pois) introduz uma oração subordinada, o que significa que o verbo conjugado deve ser enviado obrigatoriamente para o final da frase.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Escolha a frase gramaticalmente correta em alemão:",
        opcoes: [
          "Ich bin müde, weil ich habe gearbeitet viel.",
          "Ich bin müde, weil ich viel gearbeitet habe.",
          "Ich bin müde, weil habe ich viel gearbeitet.",
          "Ich bin müde, weil ich gearbeitet habe viel."
        ],
        resposta_correta: "Ich bin müde, weil ich viel gearbeitet habe."
      }
    },
    {
      id_gramatica: 18,
      id_licao: 18,
      regra_titulo: "Adjetivos substantivados e Gêneros Nominativos",
      explicacao: "Na oração alemã, substantivos e palavras que funcionam como substantivos devem sempre começar com letra maiúscula (ex: Feierabend, Entscheidung, Deutsch).",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Escreva a palavra correspondente à 'descanso após trabalho' (Feierabend) com letra maiúscula correspondente: 'Endlich ___!'",
        frase_com_lacuna: "Endlich ___!",
        resposta_correta: "Feierabend"
      }
    },
    {
      id_gramatica: 19,
      id_licao: 19,
      regra_titulo: "A Estrutura de Inversão Temporal (V2)",
      explicacao: "O alemão obedece rigidamente à regra 'V2' (o verbo conjugado deve ser o segundo elemento sintático). Se começarmos a frase com uma indicativa de tempo (ex: 'Heute' - hoje), o verbo deve preceder o sujeito.",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordene as palavras para dizer 'Hoje eu vou para casa' (Heute = Hoje, gehe = vou, ich = eu, nach Hause = para casa):",
        frase_embaralhada: ["Heute", "ich", "nach Hause", "gehe"],
        resposta_correta: "Heute gehe ich nach Hause"
      }
    },

    // Latim Gramaticas
    {
      id_gramatica: 20,
      id_licao: 20,
      regra_titulo: "O Caso Acusativo e Objeto Direto latino",
      explicacao: "Em latim, as funções sintáticas são indicadas por casos (declinações). O objeto direto geralmente termina em '-m' no singular (Caso Acusativo). Ex: 'diem' é o acusativo de 'dies' (dia). Daí o famoso ditado: 'Carpe diem'.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Na frase famosa 'Carpe diem', qual palavra é o verbo imperativo?",
        opcoes: [
          "Carpe",
          "diem",
          "Nenhuma das duas"
        ],
        resposta_correta: "Carpe"
      }
    },
    {
      id_gramatica: 21,
      id_licao: 21,
      regra_titulo: "O Verbo 'Esse' (Copulativo / Ser e Estar)",
      explicacao: "O verbo 'esse' (ser/estar) tem formas comuns no presente indicativo: 'sum' (sou/estou), 'es' (és/estás), 'est' (é/está). Quase sempre fica no fim da frase. Ex: 'Scientia potentia est'.",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complete a célebre frase de René Descartes 'Cogito, ergo ___' (Penso, logo existo/sou):",
        frase_com_lacuna: "Cogito, ergo ___",
        resposta_correta: "sum"
      }
    },
    {
      id_gramatica: 22,
      id_licao: 22,
      regra_titulo: "A Ordem Das Palavras em Latim",
      explicacao: "O latim é uma língua altamente flexionada, de modo que a ordem das palavras é extremamente flexível. No entanto, a estrutura mais comum na prosa clássica coloca o verbo no final da frase. Exemplo: 'Veritas hominem liberat' (A verdade liberta o homem).",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordenando as palavras de forma clássica para 'O conhecimento é poder':",
        frase_embaralhada: ["est", "potentia", "Scientia"],
        resposta_correta: "Scientia potentia est"
      }
    },
    // Inglês Intermediário - Lição 23
    {
      id_gramatica: 23,
      id_licao: 23,
      regra_titulo: "Asking directions: Prepositions of place",
      explicacao: "Para pedir e dar direções, usamos preposições de lugar como 'next to' (ao lado de), 'behind' (atrás de) ou 'across from' (do outro lado de).",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Select the correct preposition: 'The hotel is ____ the train station, just 2 meters away.'",
        opcoes: ["under", "next to", "inside", "above"],
        resposta_correta: "next to"
      }
    },
    // Inglês Médio - Lição 24
    {
      id_gramatica: 24,
      id_licao: 24,
      regra_titulo: "Formal Greetings in Business Emails",
      explicacao: "Em e-mails profissionais formais, quando não sabemos o nome do destinatário, usamos 'Dear Sir or Madam' ou 'To whom it may concern'.",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complete with the correct formal greeting: '___ Sir or Madam, I am writing to inquire about...'",
        frase_com_lacuna: "___ Sir or Madam, I am writing to inquire about...",
        resposta_correta: "Dear"
      }
    },
    // Inglês Avançado - Lição 25
    {
      id_gramatica: 25,
      id_licao: 25,
      regra_titulo: "Subjunctive Mood for Urgency",
      explicacao: "O modo subjuntivo em inglês é usado para expressar demandas, urgências ou sugestões importantes (ex: 'I insist that he be present', usando 'be' no infinitivo sem 'to' em vez de 'is').",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Choose the correct verb form: 'The committee recommends that the researcher ____ the hypothesis immediately.'",
        opcoes: ["tests", "test", "tested", "testing"],
        resposta_correta: "test"
      }
    },

    // Espanhol Intermediário - Lição 26
    {
      id_gramatica: 26,
      id_licao: 26,
      regra_titulo: "Pretérito Indefinido vs. Imperfecto",
      explicacao: "O pretérito indefinido relata ações pontuais ocorridas no passado (ex: 'Ayer viajé a Madrid'). O pretérito imperfecto descreve circunstâncias, rotinas ou estados passados (ex: 'Cuando era niño, viajaba mucho').",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Elige la opción correcta: 'El año pasado, nosotros ___ (ir) de vacaciones a Barcelona.'",
        opcoes: ["íbamos", "fuimos", "vamos", "iremos"],
        resposta_correta: "fuimos"
      }
    },
    // Espanhol Intermediário - Lição 27
    {
      id_gramatica: 27,
      id_licao: 27,
      regra_titulo: "Uso de los Pronombres de Objeto Directo",
      explicacao: "Os pronomes de objeto direto (lo, la, los, las) substituem o substantivo que recebe diretamente a ação do verbo para evitar redundâncias.",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Completa la frase: '¿Traes la cuenta, por favor? Sí, señor, ya ___ traigo.'",
        frase_com_lacuna: "¿Traes la cuenta, por favor? Sí, señor, ya ___ traigo.",
        resposta_correta: "la"
      }
    },
    // Espanhol Médio - Lição 28
    {
      id_gramatica: 28,
      id_licao: 28,
      regra_titulo: "El Condicional Simple en Negociaciones",
      explicacao: "Usamos o condicional simples (ex: gustaría, desearía) para suavizar petições e fazer propostas de forma educada em reuniões de negócios.",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordena la frase para expresar deseo educadamente:",
        frase_embaralhada: ["gustaría", "Nosotros", "negociar", "el", "presupuesto"],
        resposta_correta: "Nosotros gustaría negociar el presupuesto"
      }
    },
    // Espanhol Avançado - Lição 29
    {
      id_gramatica: 29,
      id_licao: 29,
      regra_titulo: "La Voz Pasiva Refleja con 'Se'",
      explicacao: "A passiva com 'se' (se + verbo em 3ª pessoa) é muito usada para dar ênfase à ação e não ao sujeito que a realiza (ex: 'Se analizó la coyuntura económica').",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Selecciona la forma correcta para decir 'Decisions are made':",
        opcoes: ["Se toman decisiones", "Se toman decisión", "Decisión se toma", "Tomar decisiones se"],
        resposta_correta: "Se toman decisiones"
      }
    },

    // Francês Intermediário - Lição 30
    {
      id_gramatica: 30,
      id_licao: 30,
      regra_titulo: "Passé Composé vs. Imparfait",
      explicacao: "O passé composé indica ações pontuais concluídas no passado (ex: 'Hier, j'ai réservé un hôtel'). O imparfait indica descrições, estados de espírito ou hábitos passados (ex: 'Quand j'étais jeune, je voyageais beaucoup').",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Choisissez la conjugaison correcte : 'Pendant mon séjour à Paris, il ___ (faire) très beau.'",
        opcoes: ["a fait", "faisait", "faisons", "fera"],
        resposta_correta: "faisait"
      }
    },
    // Francês Intermediário - Lição 31
    {
      id_gramatica: 31,
      id_licao: 31,
      regra_titulo: "Les Articles Partitifs (du, de la, de l')",
      explicacao: "Os artigos partitivos indicam uma quantidade indeterminada de algo que não podemos contar (ex: 'Je mange du pain' - Eu como pão).",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complétez la phrase : 'Je voudrais boire ___ eau fraîche, s'il vous plaît.'",
        frase_com_lacuna: "Je voudrais boire ___ eau fraîche, s'il vous plaît.",
        resposta_correta: "de l'"
      }
    },
    // Francês Médio - Lição 32
    {
      id_gramatica: 32,
      id_licao: 32,
      regra_titulo: "Le Conditionnel Présent de Politesse",
      explicacao: "Em correspondência profissional e e-mails, usamos o condicional presente do verbo 'vouloir' (je voudrais) para fazer pedidos formais e educados.",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordonnez la phrase de politesse : 'Je voudrais contacter mon fournisseur.'",
        frase_embaralhada: ["contacter", "fournisseur", "mon", "voudrais", "Je"],
        resposta_correta: "Je voudrais contacter mon fournisseur"
      }
    },
    // Francês Avançado - Lição 33
    {
      id_gramatica: 33,
      id_licao: 33,
      regra_titulo: "Le Subjonctif Présent après 'Bien que'",
      explicacao: "A conjunção de concessão 'bien que' (embora) exige obrigatoriamente que o verbo subsequente esteja no modo subjonctif.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Choisissez le verbe correct au subjonctif : 'Bien que ce paradigme ___ (être) difficile, nous devons l'apprendre.'",
        opcoes: ["est", "soit", "était", "sera"],
        resposta_correta: "soit"
      }
    },

    // Lingala Intermediário - Lição 34
    {
      id_gramatica: 34,
      id_licao: 34,
      regra_titulo: "O tempo presente progressivo do verbo Kolia (Comer)",
      explicacao: "Para dizer que está fazendo uma ação no momento em Lingala, usamos o prefixo de presente contínuo 'nazo' antes do verbo principal sem o prefixo 'ko-' (ex: 'Nazo lia' - Estou comendo, derivado de 'kolia').",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complete a frase para 'Estou comendo pão (mampa)': 'Nazo ___ mampa.'",
        frase_com_lacuna: "Nazo ___ mampa.",
        resposta_correta: "lia"
      }
    },
    // Lingala Intermediário - Lição 35
    {
      id_gramatica: 35,
      id_licao: 35,
      regra_titulo: "O uso da partícula locativa 'Kuna' (Lá)",
      explicacao: "A palavra 'kuna' em Lingala é usada para indicar um local distante do falante, equivalente a 'lá' ou 'acolá'. Quase sempre vai no fim da frase.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Como se diz 'A estrada é boa lá' em Lingala?",
        opcoes: ["Nzela ezali malamu kuna", "Kuna nzela ezali malamu", "Nzela malamu kuna ezali", "Nzela kuna malamu ezali"],
        resposta_correta: "Nzela ezali malamu kuna"
      }
    },
    // Lingala Médio - Lição 36
    {
      id_gramatica: 36,
      id_licao: 36,
      regra_titulo: "O Passado Simples e Concluído",
      explicacao: "No Lingala, o passado de uma ação concluída é marcado pelo sufixo verbal '-aki' (ex: 'nasombaki' - eu comprei, derivado do verbo 'kosomba' - comprar).",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Se 'kosomba' é comprar, complete com 'eu comprei': 'Ngai ___ mampa lobi.' (lobi = ontem)",
        frase_com_lacuna: "Ngai ___ mampa lobi.",
        resposta_correta: "nasombaki"
      }
    },
    // Lingala Avançado - Lição 37
    {
      id_gramatica: 37,
      id_licao: 37,
      regra_titulo: "Uso do Conectivo Causal 'Mpo' (Porque)",
      explicacao: "Em Lingala, usamos a palavra 'mpo' ou 'mpo na' para introduzir explicações, motivos ou causas, agindo como o 'porque' explicativo.",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Reordene a frase para formar: 'Canto porque estou feliz' (Nazo yemba = estou cantando, mpo = porque, nazali na esengo = estou feliz):",
        frase_embaralhada: ["mpo", "Nazo yemba", "nazali na esengo"],
        resposta_correta: "Nazo yemba mpo nazali na esengo"
      }
    },

    // Kimbundu Intermediário - Lição 38
    {
      id_gramatica: 38,
      id_licao: 38,
      regra_titulo: "O modo imperativo de consumo",
      explicacao: "Em Kimbundu, para formar o imperativo direto de ação para a segunda pessoa (ex: 'Coma!'), remove-se o prefixo infinitivo 'ku-' (ex: de 'kudia' - comer, temos 'dia!' - coma!).",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Como se diz de forma imperativa direta 'Coma o pão (mbolo)' em Kimbundu?",
        opcoes: ["Dila o mbolo!", "Dia o mbolo!", "Kudia o mbolo!", "Udia o mbolo!"],
        resposta_correta: "Dia o mbolo!"
      }
    },
    // Kimbundu Intermediário - Lição 39
    {
      id_gramatica: 39,
      id_licao: 39,
      regra_titulo: "Uso do locativo de proximidade 'Kuku'",
      explicacao: "Em Kimbundu, o termo demonstrativo locativo 'kuku' ou 'baba' indica proximidade do falante, correspondendo a 'aqui' ou 'neste lugar'.",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complete a frase para 'O caminho é aqui': 'O njila ezala ___'",
        frase_com_lacuna: "O njila ezala ___",
        resposta_correta: "kuku"
      }
    },
    // Kimbundu Médio - Lição 40
    {
      id_gramatica: 40,
      id_licao: 40,
      regra_titulo: "O tempo passado do indicativo em Kimbundu",
      explicacao: "Ações completas no passado em Kimbundu levam frequentemente a desinência temporal '-ele' ou '-ile' anexada ao radical do verbo, além do prefixo pessoal.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Para o verbo 'kusumba' (comprar), qual a forma correta para 'Eu comprei' (radical sumb + temporal ile)?",
        opcoes: ["Ngasumbile", "Ngasumbila", "Tusumbile", "Usumbila"],
        resposta_correta: "Ngasumbile"
      }
    },
    // Kimbundu Avançado - Lição 41
    {
      id_gramatica: 41,
      id_licao: 41,
      regra_titulo: "A Partícula de Ligação de Posse e Origem",
      explicacao: "Em Kimbundu, para conectar dois substantivos indicando posse ou origem, usamos as partículas concordantes como 'ya' ou 'wa' (ex: 'muxima wa ngola' - coração de Angola).",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordene as palavras para formar 'Coração de Angola':",
        frase_embaralhada: ["Angola", "wa", "Muxima"],
        resposta_correta: "Muxima wa Angola"
      }
    },

    // Alemão Intermediário - Lição 42
    {
      id_gramatica: 42,
      id_licao: 42,
      regra_titulo: "A Declinação do Acusativo Masculino (den)",
      explicacao: "Em alemão, quando um substantivo masculino (ex: der Apfel) sofre a ação direta do verbo (objeto direto), seu artigo 'der' muda para 'den' (ex: 'Ich esse den Apfel'). Artigos neutros e femininos não mudam.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Wählen Sie den richtigen Artikel: 'Ich kaufe ____ Fisch.' (der Fisch ist maskulin)",
        opcoes: ["den", "dem", "das", "die"],
        resposta_correta: "den"
      }
    },
    // Alemão Intermediário - Lição 43
    {
      id_gramatica: 43,
      id_licao: 43,
      regra_titulo: "Wechselpräpositionen mit Akkusativ",
      explicacao: "As preposições bidirecionais (ex: in, an, auf) exigem o caso ACUSATIVO quando expressam movimento em direção a um destino (ex: 'Ich gehe in den Flughafen' - estou me movendo para lá). Exigem o dativo quando indicam local fixo.",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Vervollständigen Sie den Satz für Bewegung: 'Ich gehe in ___ Flughafen.' (Flughafen ist maskulin)",
        frase_com_lacuna: "Ich gehe in ___ Flughafen.",
        resposta_correta: "den"
      }
    },
    // Alemão Médio - Lição 44
    {
      id_gramatica: 44,
      id_licao: 44,
      regra_titulo: "Der Konjunktiv II für Höfliche Bitten",
      explicacao: "Para fazer pedidos formais ou expressar desejos educadamente no trabalho, usamos o Konjunktiv II do verbo 'haben' (hätte gern) ou 'werden' (würde gern).",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordene as palavras para pedir um café educadamente no escritório:",
        frase_embaralhada: ["einen", "hätte", "gern", "Ich", "Kaffee"],
        resposta_correta: "Ich hätte gern einen Kaffee"
      }
    },
    // Alemão Avançado - Lição 45
    {
      id_gramatica: 45,
      id_licao: 45,
      regra_titulo: "Passiv Präteritum",
      explicacao: "A voz passiva no passado em alemão é formada pelo verbo auxiliar 'werden' conjugado no Präteritum (wurde / wurden) + o particípio passado (Partizip II) no final da oração.",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Wählen Sie den Satz im Passiv Präteritum:",
        opcoes: [
          "Das Projekt wurde gestern erfolgreich abgeschlossen.",
          "Das Projekt hat gestern erfolgreich abgeschlossen.",
          "Das Projekt wird erfolgreich abgeschlossen sein.",
          "Das Projekt war gestern abgeschlossen."
        ],
        resposta_correta: "Das Projekt wurde gestern erfolgreich abgeschlossen."
      }
    },

    // Latim Intermediário - Lição 46
    {
      id_gramatica: 46,
      id_licao: 46,
      regra_titulo: "O Caso Ablativo de Localidade",
      explicacao: "Em latim, a preposição 'in' (em/dentro de) exige que o substantivo subsequente esteja no Caso Ablativo para expressar local onde se está (ex: 'in domo' - em casa).",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Na frase 'In domo mea', qual o caso da palavra 'domo'?",
        opcoes: ["Ablativo", "Acusativo", "Nominativo", "Dativo"],
        resposta_correta: "Ablativo"
      }
    },
    // Latim Intermediário - Lição 47
    {
      id_gramatica: 47,
      id_licao: 47,
      regra_titulo: "O Caso Genitivo para Indicar Posse",
      explicacao: "O caso genitivo em latim serve primordialmente para indicar posse ou relação (equivalente a 'de' no português). Ex: 'Patris' é o genitivo de 'Pater' (pai). Logo: 'In domo patris' (Na casa do pai).",
      desafio_json: {
        tipo: "completar-lacuna",
        pergunta: "Complete para dizer 'Na casa do pai': 'In domo ___'",
        frase_com_lacuna: "In domo ___",
        resposta_correta: "patris"
      }
    },
    // Latim Médio - Lição 48
    {
      id_gramatica: 48,
      id_licao: 48,
      regra_titulo: "O Pretérito Perfeito Indicativo Ativo",
      explicacao: "O pretérito perfeito indica ações concluídas no passado (ex: 'vici' - eu venci/conquistei, do verbo 'vincere'). As desinências diferem do presente clássico.",
      desafio_json: {
        tipo: "ordenar-palavras",
        pergunta: "Ordene a famosa frase de Júlio César 'Vim, vi, venci' (Veni, vidi, vici):",
        frase_embaralhada: ["vidi", "Veni", "vici"],
        resposta_correta: "Veni vidi vici"
      }
    },
    // Latim Avançado - Lição 49
    {
      id_gramatica: 49,
      id_licao: 49,
      regra_titulo: "A Oração Final com 'Ut' e Subjuntivo",
      explicacao: "Para indicar finalidade (com o objetivo de, para que), usamos a conjunção 'ut' seguida de um verbo conjugado no modo Subjuntivo (ex: 'ut legas' - para que leias).",
      desafio_json: {
        tipo: "multipla-escolha",
        pergunta: "Qual das conjunções abaixo introduz uma oração final de propósito em latim?",
        opcoes: ["ut", "ergo", "sine", "quod"],
        resposta_correta: "ut"
      }
    }
  ];

  const provas_finais: ProvaFinal[] = [
    { id_prova: 1, id_nivel: 1 }, // Inglês Intermediário
    { id_prova: 2, id_nivel: 2 }, // Inglês Médio
    { id_prova: 3, id_nivel: 3 }, // Inglês Avançado

    { id_prova: 4, id_nivel: 4 }, // Espanhol Intermediário
    { id_prova: 5, id_nivel: 5 }, // Espanhol Médio
    { id_prova: 6, id_nivel: 6 }, // Espanhol Avançado

    { id_prova: 7, id_nivel: 7 }, // Francês Intermediário
    { id_prova: 8, id_nivel: 8 }, // Francês Médio
    { id_prova: 9, id_nivel: 9 },  // Francês Avançado

    { id_prova: 10, id_nivel: 10 }, // Lingala Intermediário
    { id_prova: 11, id_nivel: 11 }, // Lingala Médio
    { id_prova: 12, id_nivel: 12 }, // Lingala Avançado

    { id_prova: 13, id_nivel: 13 }, // Kimbundu Intermediário
    { id_prova: 14, id_nivel: 14 }, // Kimbundu Médio
    { id_prova: 15, id_nivel: 15 }, // Kimbundu Avançado

    { id_prova: 16, id_nivel: 16 }, // Alemão Intermediário
    { id_prova: 17, id_nivel: 17 }, // Alemão Médio
    { id_prova: 18, id_nivel: 18 }, // Alemão Avançado

    { id_prova: 19, id_nivel: 19 }, // Latim Intermediário
    { id_prova: 20, id_nivel: 20 }, // Latim Médio
    { id_prova: 21, id_nivel: 21 }, // Latim Avançado
    { id_prova: 22, id_nivel: 22 }, // Italiano Intermediário
    { id_prova: 23, id_nivel: 23 }, // Italiano Médio
    { id_prova: 24, id_nivel: 24 }  // Italiano Avançado
  ];

  const questoes_prova: QuestaoProva[] = [
    // Inglês Intermediário - Prova 1 (Nível 1)
    {
      id_questao: 1,
      id_prova: 1,
      pergunta: "Complete with the correct verb forms: 'She ___ at our company since 2018, and she ___ many breakthrough projects.'",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "has worked / has accomplished" },
        { id: 2, texto: "worked / accomplished" },
        { id: 3, texto: "has been working / has postpone" },
        { id: 4, texto: "works / accomplishes" }
      ],
      resposta_correta_id: 1
    },
    {
      id_questao: 2,
      id_prova: 1,
      pergunta: "What is the best translation for 'Breakthrough' and its correct usage?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Significa 'quebrar algo' e se usa para xícaras quebradas." },
        { id: 2, texto: "Significa 'descoberta inovadora' ou 'avanço significativo' em um projeto ou ciência." },
        { id: 3, texto: "Significa 'postergar compromissos' até o próximo dia." },
        { id: 4, texto: "Significa 'romper fronteiras físicas'." }
      ],
      resposta_correta_id: 2
    },
    {
      id_questao: 3,
      id_prova: 1,
      pergunta: "Read the context: 'The manager decided to postpone the kickoff meeting because key developers had other tasks to accomplish.' According to this, why was the meeting delayed?",
      categoria: "Interpretacao",
      opcoes_resposta: [
        { id: 1, texto: "Because the developers were too busy with other critical objectives." },
        { id: 2, texto: "Because the office had to stay closed on Thursday." },
        { id: 3, texto: "Because the breakthrough was already announced." },
        { id: 4, texto: "Because they lost interest in the project." }
      ],
      resposta_correta_id: 1
    },

    // Inglês Médio - Prova 2
    {
      id_questao: 4,
      id_prova: 2,
      pergunta: "Convert to indirect speech: John said, 'I can see the overwhelming results.'",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "John said that he could see the overwhelming results." },
        { id: 2, texto: "John says that he can see the overwhelming results." },
        { id: 3, texto: "John said that he has seen the overwhelming results." },
        { id: 4, texto: "John said that he will see the overwhelming results." }
      ],
      resposta_correta_id: 1
    },
    {
      id_questao: 5,
      id_prova: 2,
      pergunta: "What does 'Overwhelming' mean in Portuguese?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Tranquilo e calmo" },
        { id: 2, texto: "Demasiado simples de concluir" },
        { id: 3, texto: "Esmagador, avassalador ou desmesurado" },
        { id: 4, texto: "Fácil e trivial" }
      ],
      resposta_correta_id: 3
    },

    // Espanhol Intermediário - Prova 4
    {
      id_questao: 6,
      id_prova: 4,
      pergunta: "Indique la frase que utiliza adecuadamente el verbo reflexivo:",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Nosotros levanto muy temprano para desayunar." },
        { id: 2, texto: "Ellos se desayunan huevos fritos todos los días." },
        { id: 3, texto: "Yo me ducho y luego preparo el desayuno para el equipo." },
        { id: 4, texto: "A las ocho, tú duchas alegremente con agua fría." }
      ],
      resposta_correta_id: 3
    },
    {
      id_questao: 7,
      id_prova: 4,
      pergunta: "¿Cuál es el significado de la palabra 'Acontecimiento'?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Un lugar geográfico específico" },
        { id: 2, texto: "Un suceso o evento de relativa importancia" },
        { id: 3, texto: "Una rutina que ocurre cada cinco minutos" },
        { id: 4, texto: "Algo que es de color azul" }
      ],
      resposta_correta_id: 2
    },

    // Francês Intermediário - Prova 7
    {
      id_questao: 8,
      id_prova: 7,
      pergunta: "Complétez la phrase au futur simple : 'La semaine prochaine, nous ___ (améliorer) notre vocabulaire quotidien.'",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "améliorerons" },
        { id: 2, texto: "améliorons" },
        { id: 3, texto: "améliorer" },
        { id: 4, texto: "amélioreraient" }
      ],
      resposta_correta_id: 1
    },
    {
      id_questao: 9,
      id_prova: 7,
      pergunta: "Quel mot français signifie 'diário' ou 'relatif à chaque jour' ?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Grandir" },
        { id: 2, texto: "Quotidien" },
        { id: 3, texto: "Améliorer" },
        { id: 4, texto: "Hebdomadaire" }
      ],
      resposta_correta_id: 2
    },

    // Lingala Intermediário (id_prova 10)
    {
      id_questao: 10,
      id_prova: 10,
      pergunta: "Como expressamos a saudação padrão 'Olá' em Lingala?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Mbote" },
        { id: 2, texto: "Sango nini" },
        { id: 3, texto: "Malamu" },
        { id: 4, texto: "Olingi" }
      ],
      resposta_correta_id: 1
    },
    // Lingala Médio (id_prova 11)
    {
      id_questao: 11,
      id_prova: 11,
      pergunta: "Para se informar sobre as novidades em Lingala, como você pergunta 'Quais as novidades?' ?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Sango nini?" },
        { id: 2, texto: "Malamu mpenza" },
        { id: 3, texto: "Mbote ndeko" },
        { id: 4, texto: "Kolia" }
      ],
      resposta_correta_id: 1
    },
    // Lingala Avançado (id_prova 12)
    {
      id_questao: 12,
      id_prova: 12,
      pergunta: "No ditado em Lingala, a palavra 'mpenza' serve para enfatizar um adjetivo. Onde ela se posiciona?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Imediatamente após o termo que se deseja intensificar." },
        { id: 2, texto: "No início da oração." },
        { id: 3, texto: "Antes do sujeito obrigatoriamente." },
        { id: 4, texto: "Nenhuma das anteriores." }
      ],
      resposta_correta_id: 1
    },

    // Kimbundu Intermediário (id_prova 13)
    {
      id_questao: 13,
      id_prova: 13,
      pergunta: "Qual prefixo de concordância pessoal usamos em Kimbundu para referir à primeira pessoa do plural ('Nós')?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Nga-" },
        { id: 2, texto: "U-" },
        { id: 3, texto: "Tu-" },
        { id: 4, texto: "Ba-" }
      ],
      resposta_correta_id: 3
    },
    // Kimbundu Médio (id_prova 14)
    {
      id_questao: 14,
      id_prova: 14,
      pergunta: "Em Kimbundu, qual prefixo introduz classes de objetos, línguas e qualidades?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Prefixos Ki- ou Kie-" },
        { id: 2, texto: "Prefixos Nga-" },
        { id: 3, texto: "Desinência -ami" },
        { id: 4, texto: "Sufixo -é" }
      ],
      resposta_correta_id: 1
    },
    // Kimbundu Avançado (id_prova 15)
    {
      id_questao: 15,
      id_prova: 15,
      pergunta: "Na frase 'ondaka yami ya kidi' em Kimbundu, qual é o significado do possessivo 'yami'?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Minha" },
        { id: 2, texto: "Tua" },
        { id: 3, texto: "Nossa" },
        { id: 4, texto: "Deles" }
      ],
      resposta_correta_id: 1
    },

    // Alemão Intermediário (id_prova 16)
    {
      id_questao: 16,
      id_prova: 16,
      pergunta: "Com a conjunção causal 'weil', para onde deve ir o verbo conjugado na oração subordinada em alemão?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Para a primeira posição." },
        { id: 2, texto: "Para o final absoluto da oração subordinada." },
        { id: 3, texto: "Antes do sujeito." },
        { id: 4, texto: "Desaparece na frase." }
      ],
      resposta_correta_id: 2
    },
    // Alemão Médio (id_prova 17)
    {
      id_questao: 17,
      id_prova: 17,
      pergunta: "Qual das regras ortográficas abaixo é mandatória para substantivos (Nomen) em alemão?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Devem sempre ser grafados com a primeira letra em maiúscula." },
        { id: 2, texto: "Devem terminar apenas em letras vogais." },
        { id: 3, texto: "Devem ser usados somente no início de orações." },
        { id: 4, texto: "Nenhuma das anteriores." }
      ],
      resposta_correta_id: 1
    },
    // Alemão Avançado (id_prova 18)
    {
      id_questao: 18,
      id_prova: 18,
      pergunta: "Em alemão, qual das seguintes expressa o momento de descanso após o fim do expediente de trabalho?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Feierabend" },
        { id: 2, texto: "Entscheidung" },
        { id: 3, texto: "Hervorragend" },
        { id: 4, texto: "Arbeit" }
      ],
      resposta_correta_id: 1
    },

    // Latim Intermediário (id_prova 19)
    {
      id_questao: 19,
      id_prova: 19,
      pergunta: "Na célebre locução latina 'Carpe diem', a palavra 'diem' encontra-se em qual caso gramatical?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Caso Nominativo (Sujeito)" },
        { id: 2, texto: "Caso Acusativo (Objeto Direto)" },
        { id: 3, texto: "Caso Vocativo" },
        { id: 4, texto: "Caso Genitivo" }
      ],
      resposta_correta_id: 2
    },
    // Latim Médio (id_prova 20)
    {
      id_questao: 20,
      id_prova: 20,
      pergunta: "O verbo 'esse' no presente do indicativo latino é copulativo. Qual forma expressa 'é' ou 'está'?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "sum" },
        { id: 2, texto: "es" },
        { id: 3, texto: "est" },
        { id: 4, texto: "sunt" }
      ],
      resposta_correta_id: 3
    },
    // Latim Avançado (id_prova 21)
    {
      id_questao: 21,
      id_prova: 21,
      pergunta: "Qual provérbio latino traduz-se classicamente como 'conhecimento é poder'?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "In vino veritas" },
        { id: 2, texto: "Scientia potentia est" },
        { id: 3, texto: "Carpe diem" },
        { id: 4, texto: "Cogito ergo sum" }
      ],
      resposta_correta_id: 2
    },
    // Inglês Intermediário - Prova 1 (Nível 1)
    {
      id_questao: 22,
      id_prova: 1,
      pergunta: "Where would you typically keep your liquid items during a flight?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "In your hand luggage." },
        { id: 2, texto: "In your main suitcase only." },
        { id: 3, texto: "In your itinerary." },
        { id: 4, texto: "At home." }
      ],
      resposta_correta_id: 1
    },
    // Inglês Médio - Prova 2 (Nível 2)
    {
      id_questao: 23,
      id_prova: 2,
      pergunta: "What is the most appropriate formal greeting in an email when you don't know the name of the recipient?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Dear Sir or Madam" },
        { id: 2, texto: "Hey there" },
        { id: 3, texto: "Hi team" },
        { id: 4, texto: "To my friend" }
      ],
      resposta_correta_id: 1
    },
    // Inglês Avançado - Prova 3 (Nível 3)
    {
      id_questao: 24,
      id_prova: 3,
      pergunta: "Identify the sentence that correctly uses the subjunctive mood for urgency:",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "The doctor recommends that he takes the medicine." },
        { id: 2, texto: "The doctor recommends that he take the medicine." },
        { id: 3, texto: "The doctor recommends that he is taking the medicine." },
        { id: 4, texto: "The doctor recommends that he took the medicine." }
      ],
      resposta_correta_id: 2
    },
    {
      id_questao: 25,
      id_prova: 3,
      pergunta: "What is a 'hypothesis' in a scientific research context?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "An absolute, unchangeable truth." },
        { id: 2, texto: "A proposed explanation or assumption that needs to be tested." },
        { id: 3, texto: "The final result of an experiment." },
        { id: 4, texto: "A type of laboratory equipment." }
      ],
      resposta_correta_id: 2
    },
    // Espanhol Intermediário - Prova 4 (Nível 4)
    {
      id_questao: 26,
      id_prova: 4,
      pergunta: "Traduzca la frase: 'El año pasado, nosotros fuimos de vacaciones a Sevilla.'",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "No ano passado, nós íamos de férias para Sevilha." },
        { id: 2, texto: "No ano passado, nós fomos de férias para Sevilha." },
        { id: 3, texto: "No ano passado, nós iremos de férias para Sevilha." },
        { id: 4, texto: "No ano passado, nós vamos de férias para Sevilha." }
      ],
      resposta_correta_id: 2
    },
    // Espanhol Médio - Prova 5 (Nível 5)
    {
      id_questao: 27,
      id_prova: 5,
      pergunta: "En una negociación comercial, ¿para qué se utiliza el condicional simple del verbo gustar (me gustaría)?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Para exigir de forma agresiva." },
        { id: 2, texto: "Para suavizar peticiones y hacer propuestas educadas." },
        { id: 3, texto: "Para hablar del pasado lejano." },
        { id: 4, texto: "Para describir una rutina." }
      ],
      resposta_correta_id: 2
    },
    {
      id_questao: 28,
      id_prova: 5,
      pergunta: "¿Cuál es la traducción correcta de la palabra 'Presupuesto'?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Suposição" },
        { id: 2, texto: "Orçamento" },
        { id: 3, texto: "Reunião" },
        { id: 4, texto: "Contrato" }
      ],
      resposta_correta_id: 2
    },
    // Espanhol Avançado - Prova 6 (Nível 6)
    {
      id_questao: 29,
      id_prova: 6,
      pergunta: "En la frase 'Se analizó la coyuntura económica', la palabra 'coyuntura' significa:",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Uma decisão definitiva." },
        { id: 2, texto: "A conjunção de fatores ou situação momentânea." },
        { id: 3, texto: "Uma dívida financeira anterior." },
        { id: 4, texto: "Um tipo de contrato de trabalho." }
      ],
      resposta_correta_id: 2
    },
    {
      id_questao: 30,
      id_prova: 6,
      pergunta: "¿Cuál es la forma correcta de expresar la voz pasiva refleja para 'decisiones are made'?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Se toma decisiones." },
        { id: 2, texto: "Se toman decisiones." },
        { id: 3, texto: "Se tomaron decisión." },
        { id: 4, texto: "Se tomando decisiones." }
      ],
      resposta_correta_id: 2
    },
    // Francês Intermediário - Prova 7 (Nível 7)
    {
      id_questao: 31,
      id_prova: 7,
      pergunta: "Dans la phrase 'Je voudrais de l'eau', quel type d'article est 'de l''?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Article défini" },
        { id: 2, texto: "Article indéfini" },
        { id: 3, texto: "Article partitif" },
        { id: 4, texto: "Article démonstratif" }
      ],
      resposta_correta_id: 3
    },
    // Francês Médio - Prova 8 (Nível 8)
    {
      id_questao: 32,
      id_prova: 8,
      pergunta: "Comment dit-on 'fornecedor' en français ?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Chef-d'œuvre" },
        { id: 2, texto: "Fournisseur" },
        { id: 3, texto: "Directeur" },
        { id: 4, texto: "Client" }
      ],
      resposta_correta_id: 2
    },
    {
      id_questao: 33,
      id_prova: 8,
      pergunta: "Pour faire une demande de manière extrêmement polie par e-mail, quel temps utilise-t-on ?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Le futur simple" },
        { id: 2, texto: "Le conditionnel présent" },
        { id: 3, texto: "L'imparfait" },
        { id: 4, texto: "Le subjonctif présent" }
      ],
      resposta_correta_id: 2
    },
    // Francês Avançado - Prova 9 (Nível 9)
    {
      id_questao: 34,
      id_prova: 9,
      pergunta: "Qu'est-ce qu'un 'paradigme' ?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Une erreur de grammaire." },
        { id: 2, texto: "Un modèle de pensée ou de représentation du monde." },
        { id: 3, texto: "Un type de poème français." },
        { id: 4, texto: "Une réunion d'affaires." }
      ],
      resposta_correta_id: 2
    },
    {
      id_questao: 35,
      id_prova: 9,
      pergunta: "Choisissez la bonne forme verbale : 'Bien que ce ___ difficile, nous réussirons.'",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "est" },
        { id: 2, texto: "soit" },
        { id: 3, texto: "était" },
        { id: 4, texto: "sera" }
      ],
      resposta_correta_id: 2
    },
    // Lingala Intermediário - Prova 10 (Nível 10)
    {
      id_questao: 36,
      id_prova: 10,
      pergunta: "Como se diz 'pão' em Lingala?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Mbote" },
        { id: 2, texto: "Mampa" },
        { id: 3, texto: "Kolia" },
        { id: 4, texto: "Nzela" }
      ],
      resposta_correta_id: 2
    },
    // Lingala Médio - Prova 11 (Nível 11)
    {
      id_questao: 37,
      id_prova: 11,
      pergunta: "O sufixo verbal '-aki' (como em 'nasombaki') em Lingala expressa:",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "O tempo futuro próximo." },
        { id: 2, texto: "O tempo passado simples concluído." },
        { id: 3, texto: "Uma ação contínua no presente." },
        { id: 4, texto: "Uma negação absoluta." }
      ],
      resposta_correta_id: 2
    },
    // Lingala Avançado - Prova 12 (Nível 12)
    {
      id_questao: 38,
      id_prova: 12,
      pergunta: "Qual é o significado do termo 'Nzembo' em Lingala?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Moeda" },
        { id: 2, texto: "Música / Canção" },
        { id: 3, texto: "Cultura" },
        { id: 4, texto: "Caminho" }
      ],
      resposta_correta_id: 2
    },
    // Kimbundu Intermediário - Prova 13 (Nível 13)
    {
      id_questao: 39,
      id_prova: 13,
      pergunta: "Qual a tradução para 'Mbolo' em Kimbundu?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Água" },
        { id: 2, texto: "Pão" },
        { id: 3, texto: "Coração" },
        { id: 4, texto: "Caminho" }
      ],
      resposta_correta_id: 2
    },
    // Kimbundu Médio - Prova 14 (Nível 14)
    {
      id_questao: 40,
      id_prova: 14,
      pergunta: "A desinência temporal '-ile' (como em 'ngasumbile') em Kimbundu indica:",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "O tempo futuro." },
        { id: 2, texto: "O tempo passado." },
        { id: 3, texto: "O modo imperativo." },
        { id: 4, texto: "O gerúndio." }
      ],
      resposta_correta_id: 2
    },
    // Kimbundu Avançado - Prova 15 (Nível 15)
    {
      id_questao: 41,
      id_prova: 15,
      pergunta: "O que significa o termo 'Muxima' em Kimbundu?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Trabalho" },
        { id: 2, texto: "Coração" },
        { id: 3, texto: "Dinheiro" },
        { id: 4, texto: "Festa" }
      ],
      resposta_correta_id: 2
    },
    // Alemão Intermediário - Prova 16 (Nível 16)
    {
      id_questao: 42,
      id_prova: 16,
      pergunta: "No acusativo alemão, qual o artigo correto para um substantivo masculino (objeto direto)?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "der" },
        { id: 2, texto: "den" },
        { id: 3, texto: "dem" },
        { id: 4, texto: "das" }
      ],
      resposta_correta_id: 2
    },
    // Alemão Médio - Prova 17 (Nível 17)
    {
      id_questao: 43,
      id_prova: 17,
      pergunta: "Como se diz 'reunião profissional' em alemão?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Feierabend" },
        { id: 2, texto: "Besprechung" },
        { id: 3, texto: "Entscheidung" },
        { id: 4, texto: "Arbeit" }
      ],
      resposta_correta_id: 2
    },
    // Alemão Avançado - Prova 18 (Nível 18)
    {
      id_questao: 44,
      id_prova: 18,
      pergunta: "Identifique a frase no Passiv Präteritum em alemão:",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Das Projekt wurde abgeschlossen." },
        { id: 2, texto: "Das Projekt wird abgeschlossen." },
        { id: 3, texto: "Das Projekt hat abgeschlossen." },
        { id: 4, texto: "Das Projekt war abgeschlossen." }
      ],
      resposta_correta_id: 1
    },
    // Latim Intermediário - Prova 19 (Nível 19)
    {
      id_questao: 45,
      id_prova: 19,
      pergunta: "Na expressão 'In domo mea', qual o caso gramatical de 'domo'?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Nominativo" },
        { id: 2, texto: "Ablativo (Localidade)" },
        { id: 3, texto: "Acusativo" },
        { id: 4, texto: "Genitivo" }
      ],
      resposta_correta_id: 2
    },
    // Latim Médio - Prova 20 (Nível 20)
    {
      id_questao: 46,
      id_prova: 20,
      pergunta: "A frase clássica de Júlio César 'Veni, vidi, vici' traduz-se como:",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Penso, logo existo." },
        { id: 2, texto: "Vim, vi, venci." },
        { id: 3, texto: "Aproveite o dia." },
        { id: 4, texto: "A verdade liberta." }
      ],
      resposta_correta_id: 2
    },
    // Latim Avançado - Prova 21 (Nível 21)
    {
      id_questao: 47,
      id_prova: 21,
      pergunta: "Na frase filosófica romana, o que significa o substantivo 'Ratio'?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Vento" },
        { id: 2, texto: "Razão / Método" },
        { id: 3, texto: "Guerra" },
        { id: 4, texto: "Lei" }
      ],
      resposta_correta_id: 2
    },
    // Italiano Intermediário - Prova 22 (Nível 22)
    {
      id_questao: 48,
      id_prova: 22,
      pergunta: "Qual è la traduzione corretta di 'Migliorare' in italiano?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Migliorare" },
        { id: 2, texto: "Capire" },
        { id: 3, texto: "Mangiare" },
        { id: 4, texto: "Dormire" }
      ],
      resposta_correta_id: 1
    },
    // Italiano Médio - Prova 23 (Nível 23)
    {
      id_questao: 49,
      id_prova: 23,
      pergunta: "Quale delle seguenti frasi contiene un verbo al passato prossimo?",
      categoria: "Gramatica",
      opcoes_resposta: [
        { id: 1, texto: "Ho mangiato una mela." },
        { id: 2, texto: "Mangio una mela." },
        { id: 3, texto: "Mangerò una mela." },
        { id: 4, texto: "Mangiavo una mela." }
      ],
      resposta_correta_id: 1
    },
    // Italiano Avançado - Prova 24 (Nível 24)
    {
      id_questao: 50,
      id_prova: 24,
      pergunta: "Cosa significa la parola 'Inestimabile'?",
      categoria: "Vocabulario",
      opcoes_resposta: [
        { id: 1, texto: "Di scarso valore" },
        { id: 2, texto: "Che non ha prezzo / Preziosissimo" },
        { id: 3, texto: "Inutile" },
        { id: 4, texto: "Facile da stimare" }
      ],
      resposta_correta_id: 2
    }
  ];

  // Calendário seed para o usuário padrão
  const calendario_estudos: CalendarioEstudos[] = [
    { id_agenda: 1, id_usuario: 1, id_idioma: 1, dia_semana: 1, hora_estudo: "19:00", minutos_meta: 30 }, // Segunda Inglês
    { id_agenda: 2, id_usuario: 1, id_idioma: 1, dia_semana: 3, hora_estudo: "19:00", minutos_meta: 30 }, // Quarta Inglês
    { id_agenda: 3, id_usuario: 1, id_idioma: 1, dia_semana: 5, hora_estudo: "19:00", minutos_meta: 30 }  // Sexta Inglês
  ];

  // Usuário padrão
  const usuarios: Usuario[] = [
    {
      id_usuario: 1,
      nome: "Teríus",
      email: "luthercadete24@gmail.com",
      senha_hash: "123", // Armazenado de forma simples para facilitar o teste no Applet
      data_criacao: new Date().toISOString()
    }
  ];

  // Progresso do Usuário
  // Desbloqueia os níveis intermediários por padrão para dar uma experiência fluida no início
  const progresso_usuario: ProgressoUsuario[] = [
    // Usuário 1 - Inglês
    { id_progresso: 1, id_usuario: 1, id_nivel: 1, bloqueado: false, concluido: false, nota_prova_final: 0 },
    { id_progresso: 2, id_usuario: 1, id_nivel: 2, bloqueado: true, concluido: false, nota_prova_final: 0 },
    { id_progresso: 3, id_usuario: 1, id_nivel: 3, bloqueado: true, concluido: false, nota_prova_final: 0 },
    // Usuário 1 - Espanhol
    { id_progresso: 4, id_usuario: 1, id_nivel: 4, bloqueado: false, concluido: false, nota_prova_final: 0 },
    { id_progresso: 5, id_usuario: 1, id_nivel: 5, bloqueado: true, concluido: false, nota_prova_final: 0 },
    { id_progresso: 6, id_usuario: 1, id_nivel: 6, bloqueado: true, concluido: false, nota_prova_final: 0 },
    // Usuário 1 - Francês
    { id_progresso: 7, id_usuario: 1, id_nivel: 7, bloqueado: false, concluido: false, nota_prova_final: 0 },
    { id_progresso: 8, id_usuario: 1, id_nivel: 8, bloqueado: true, concluido: false, nota_prova_final: 0 },
    { id_progresso: 9, id_usuario: 1, id_nivel: 9, bloqueado: true, concluido: false, nota_prova_final: 0 },
    // Usuário 1 - Lingala
    { id_progresso: 10, id_usuario: 1, id_nivel: 10, bloqueado: false, concluido: false, nota_prova_final: 0 },
    { id_progresso: 11, id_usuario: 1, id_nivel: 11, bloqueado: true, concluido: false, nota_prova_final: 0 },
    { id_progresso: 12, id_usuario: 1, id_nivel: 12, bloqueado: true, concluido: false, nota_prova_final: 0 },
    // Usuário 1 - Kimbundu
    { id_progresso: 13, id_usuario: 1, id_nivel: 13, bloqueado: false, concluido: false, nota_prova_final: 0 },
    { id_progresso: 14, id_usuario: 1, id_nivel: 14, bloqueado: true, concluido: false, nota_prova_final: 0 },
    { id_progresso: 15, id_usuario: 1, id_nivel: 15, bloqueado: true, concluido: false, nota_prova_final: 0 },
    // Usuário 1 - Alemão
    { id_progresso: 16, id_usuario: 1, id_nivel: 16, bloqueado: false, concluido: false, nota_prova_final: 0 },
    { id_progresso: 17, id_usuario: 1, id_nivel: 17, bloqueado: true, concluido: false, nota_prova_final: 0 },
    { id_progresso: 18, id_usuario: 1, id_nivel: 18, bloqueado: true, concluido: false, nota_prova_final: 0 },
    // Usuário 1 - Latim
    { id_progresso: 19, id_usuario: 1, id_nivel: 19, bloqueado: false, concluido: false, nota_prova_final: 0 },
    { id_progresso: 20, id_usuario: 1, id_nivel: 20, bloqueado: true, concluido: false, nota_prova_final: 0 },
    { id_progresso: 21, id_usuario: 1, id_nivel: 21, bloqueado: true, concluido: false, nota_prova_final: 0 },
    // Usuário 1 - Italiano
    { id_progresso: 22, id_usuario: 1, id_nivel: 22, bloqueado: false, concluido: false, nota_prova_final: 0 },
    { id_progresso: 23, id_usuario: 1, id_nivel: 23, bloqueado: true, concluido: false, nota_prova_final: 0 },
    { id_progresso: 24, id_usuario: 1, id_nivel: 24, bloqueado: true, concluido: false, nota_prova_final: 0 }
  ];

  // Dynamically fill each level up to exactly 10 lessons
  for (let lvl = 1; lvl <= 24; lvl++) {
    const existingForLevel = licoes.filter(l => l.id_nivel === lvl);
    const existingCount = existingForLevel.length;
    
    if (existingCount < 10) {
      const levelObj = niveis.find(n => n.id_nivel === lvl);
      const id_idioma = levelObj ? levelObj.id_idioma : 1;
      const level_atual = levelObj ? levelObj.nivel_atual : "Intermediario";
      
      const idiomaObj = idiomas.find(i => i.id_idioma === id_idioma);
      const nome_idioma = idiomaObj ? idiomaObj.nome_idioma : "Inglês";
      
      let nextLicaoId = licoes.length > 0 ? Math.max(...licoes.map(l => l.id_licao)) + 1 : 1;
      
      for (let i = existingCount + 1; i <= 10; i++) {
        const licao_titulo = getGeneratedLicaoTitle(nome_idioma, level_atual, i);
        
        const newLicao: Licao = {
          id_licao: nextLicaoId,
          id_nivel: lvl,
          titulo: licao_titulo,
          ordem_licao: i
        };
        licoes.push(newLicao);
        
        const nextVocabId1 = vocabularios.length > 0 ? Math.max(...vocabularios.map(v => v.id_vocabulario)) + 1 : 1;
        const vocab1 = getGeneratedVocab(nome_idioma, level_atual, i, 1, nextLicaoId, nextVocabId1);
        vocabularios.push(vocab1);
        
        const nextVocabId2 = vocabularios.length > 0 ? Math.max(...vocabularios.map(v => v.id_vocabulario)) + 1 : 1;
        const vocab2 = getGeneratedVocab(nome_idioma, level_atual, i, 2, nextLicaoId, nextVocabId2);
        vocabularios.push(vocab2);
        
        const nextGrammarId = gramaticas.length > 0 ? Math.max(...gramaticas.map(g => g.id_gramatica)) + 1 : 1;
        const grammar = getGeneratedGrammar(nome_idioma, level_atual, i, nextLicaoId, nextGrammarId);
        gramaticas.push(grammar);
        
        nextLicaoId++;
      }
    }
  }

  return {
    usuarios,
    idiomas,
    niveis,
    progresso_usuario,
    licoes,
    vocabularios,
    gramaticas,
    provas_finais,
    questoes_prova,
    calendario_estudos
  };
}

export class DatabaseManager {
  private data: AppDatabase;

  constructor() {
    this.data = getInitialSeed();
    this.load();
    this.ensureTenLessonsPerLevel();
  }

  // Load database from file if exists, otherwise save initial seed
  public load(): void {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Erro ao carregar o banco de dados, utilizando sementes iniciais:", e);
      this.data = getInitialSeed();
    }
  }

  // Ensure every level (1 to 24) has exactly 10 lessons, each with its own vocabulary and grammar
  public ensureTenLessonsPerLevel(): void {
    const { licoes, vocabularios, gramaticas, niveis, idiomas } = this.data;

    for (let lvl = 1; lvl <= 24; lvl++) {
      const existingForLevel = licoes.filter(l => l.id_nivel === lvl);
      const existingCount = existingForLevel.length;

      const levelObj = niveis.find(n => n.id_nivel === lvl);
      if (!levelObj) continue;

      const id_idioma = levelObj.id_idioma;
      const level_atual = levelObj.nivel_atual;

      const idiomaObj = idiomas.find(i => i.id_idioma === id_idioma);
      const nome_idioma = idiomaObj ? idiomaObj.nome_idioma : "Inglês";

      // 1. Generate missing lessons if count < 10
      if (existingCount < 10) {
        let nextLicaoId = licoes.length > 0 ? Math.max(...licoes.map(l => l.id_licao)) + 1 : 1;

        for (let i = existingCount + 1; i <= 10; i++) {
          const licao_titulo = getGeneratedLicaoTitle(nome_idioma, level_atual, i);
          const deepExp = getGeneratedExplicacaoProfunda(nome_idioma, level_atual, i);

          const newLicao: Licao = {
            id_licao: nextLicaoId,
            id_nivel: lvl,
            titulo: licao_titulo,
            ordem_licao: i,
            explicacao_profunda: deepExp
          };
          licoes.push(newLicao);

          const nextVocabId1 = vocabularios.length > 0 ? Math.max(...vocabularios.map(v => v.id_vocabulario)) + 1 : 1;
          const vocab1 = getGeneratedVocab(nome_idioma, level_atual, i, 1, nextLicaoId, nextVocabId1);
          vocabularios.push(vocab1);

          const nextVocabId2 = vocabularios.length > 0 ? Math.max(...vocabularios.map(v => v.id_vocabulario)) + 1 : 1;
          const vocab2 = getGeneratedVocab(nome_idioma, level_atual, i, 2, nextLicaoId, nextVocabId2);
          vocabularios.push(vocab2);

          const nextGrammarId = gramaticas.length > 0 ? Math.max(...gramaticas.map(g => g.id_gramatica)) + 1 : 1;
          const grammar = getGeneratedGrammar(nome_idioma, level_atual, i, nextLicaoId, nextGrammarId);
          gramaticas.push(grammar);

          nextLicaoId++;
        }
      }

      // 2. Double check existing lessons of this level to make sure each has vocab and grammar
      const finalLevelLessons = licoes.filter(l => l.id_nivel === lvl);
      finalLevelLessons.forEach((licao) => {
        const licaoVocabs = vocabularios.filter(v => v.id_licao === licao.id_licao);
        if (licaoVocabs.length === 0) {
          const nextVocabId1 = vocabularios.length > 0 ? Math.max(...vocabularios.map(v => v.id_vocabulario)) + 1 : 1;
          const vocab1 = getGeneratedVocab(nome_idioma, level_atual, licao.ordem_licao, 1, licao.id_licao, nextVocabId1);
          vocabularios.push(vocab1);

          const nextVocabId2 = vocabularios.length > 0 ? Math.max(...vocabularios.map(v => v.id_vocabulario)) + 1 : 1;
          const vocab2 = getGeneratedVocab(nome_idioma, level_atual, licao.ordem_licao, 2, licao.id_licao, nextVocabId2);
          vocabularios.push(vocab2);
        }

        const licaoGrammars = gramaticas.filter(g => g.id_licao === licao.id_licao);
        if (licaoGrammars.length === 0) {
          const nextGrammarId = gramaticas.length > 0 ? Math.max(...gramaticas.map(g => g.id_gramatica)) + 1 : 1;
          const grammar = getGeneratedGrammar(nome_idioma, level_atual, licao.ordem_licao, licao.id_licao, nextGrammarId);
          gramaticas.push(grammar);
        }
      });
    }

    // 3. Backfill any missing explicacao_profunda on all lessons in the database
    licoes.forEach((licao) => {
      if (!licao.explicacao_profunda) {
        const levelObj = niveis.find(n => n.id_nivel === licao.id_nivel);
        if (levelObj) {
          const level_atual = levelObj.nivel_atual;
          const idiomaObj = idiomas.find(i => i.id_idioma === levelObj.id_idioma);
          const nome_idioma = idiomaObj ? idiomaObj.nome_idioma : "Inglês";
          licao.explicacao_profunda = getGeneratedExplicacaoProfunda(nome_idioma, level_atual, licao.ordem_licao);
        }
      }
    });

    this.save();
  }

  // Save changes to file
  public save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Erro ao persistir o banco de dados:", e);
    }
  }

  // Access core tables
  public getUsuarios(): Usuario[] { return this.data.usuarios; }
  public getIdiomas(): Idioma[] { return this.data.idiomas; }
  public getNiveis(): Nivel[] { return this.data.niveis; }
  public getProgressoUsuario(): ProgressoUsuario[] { return this.data.progresso_usuario; }
  public getLicoes(): Licao[] { return this.data.licoes; }
  public getVocabularios(): Vocabulario[] { return this.data.vocabularios; }
  public getGramaticas(): Gramatica[] { return this.data.gramaticas; }
  public getProvasFinais(): ProvaFinal[] { return this.data.provas_finais; }
  public getQuestoesProva(): QuestaoProva[] { return this.data.questoes_prova; }
  public getCalendarioEstudos(): CalendarioEstudos[] { return this.data.calendario_estudos; }

  // Authentication Helpers
  public authenticate(email: string, senha_hash: string): Usuario | null {
    const user = this.data.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.senha_hash === senha_hash) {
      return user;
    }
    return null;
  }

  public register(nome: string, email: string, senha_hash: string): Usuario {
    const existing = this.data.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("Email já cadastrado.");
    }
    
    const id_usuario = this.data.usuarios.length > 0 ? Math.max(...this.data.usuarios.map(u => u.id_usuario)) + 1 : 1;
    const newUser: Usuario = {
      id_usuario,
      nome,
      email,
      senha_hash,
      data_criacao: new Date().toISOString()
    };
    this.data.usuarios.push(newUser);

    // Inicializar progresso para todos os níveis disponíveis
    this.data.niveis.forEach(n => {
      // Intermediário (ordem_nivel 1) fica desbloqueado por padrão (bloqueado = false)
      const isIntermed = n.ordem_nivel === 1;
      this.data.progresso_usuario.push({
        id_progresso: this.data.progresso_usuario.length + 1,
        id_usuario,
        id_nivel: n.id_nivel,
        bloqueado: !isIntermed,
        concluido: false,
        nota_prova_final: 0
      });
    });

    this.save();
    return newUser;
  }

  // Fetch complete structure for user
  public getProgressoCompletoParaUsuario(id_usuario: number): any {
    return this.data.progresso_usuario.filter(p => p.id_usuario === id_usuario);
  }

  // Update study schedule
  public setCalendarioEntry(id_usuario: number, id_idioma: number, dia_semana: number, hora_estudo: string, minutos_meta: number): CalendarioEstudos {
    const existingIndex = this.data.calendario_estudos.findIndex(
      c => c.id_usuario === id_usuario && c.id_idioma === id_idioma && c.dia_semana === dia_semana
    );

    if (existingIndex !== -1) {
      this.data.calendario_estudos[existingIndex].hora_estudo = hora_estudo;
      this.data.calendario_estudos[existingIndex].minutos_meta = minutos_meta;
      this.save();
      return this.data.calendario_estudos[existingIndex];
    } else {
      const id_agenda = this.data.calendario_estudos.length > 0 ? Math.max(...this.data.calendario_estudos.map(c => c.id_agenda)) + 1 : 1;
      const newEntry: CalendarioEstudos = {
        id_agenda,
        id_usuario,
        id_idioma,
        dia_semana,
        hora_estudo,
        minutos_meta
      };
      this.data.calendario_estudos.push(newEntry);
      this.save();
      return newEntry;
    }
  }

  public deleteCalendarioEntry(id_usuario: number, id_idioma: number, dia_semana: number): boolean {
    const initialLen = this.data.calendario_estudos.length;
    this.data.calendario_estudos = this.data.calendario_estudos.filter(
      c => !(c.id_usuario === id_usuario && c.id_idioma === id_idioma && c.dia_semana === dia_semana)
    );
    if (this.data.calendario_estudos.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Submit Exam score
  public submitProvaNota(id_usuario: number, id_nivel: number, nota: number): { progresso: ProgressoUsuario, proximo_nivel_desbloqueado?: Nivel } {
    const progCopy = this.data.progresso_usuario.find(p => p.id_usuario === id_usuario && p.id_nivel === id_nivel);
    if (!progCopy) {
      throw new Error("Progresso não encontrado para este nível.");
    }

    progCopy.nota_prova_final = parseFloat(nota.toFixed(2));
    let proximo_nivel_desbloqueado: Nivel | undefined;

    if (nota >= 7.00) {
      progCopy.concluido = true;

      // Desbloquear próximo nível para este idioma
      const nivelAtualObj = this.data.niveis.find(n => n.id_nivel === id_nivel);
      if (nivelAtualObj) {
        const proximaOrdem = nivelAtualObj.ordem_nivel + 1;
        const proximoNivelObj = this.data.niveis.find(
          n => n.id_idioma === nivelAtualObj.id_idioma && n.ordem_nivel === proximaOrdem
        );

        if (proximoNivelObj) {
          const proximoProgresso = this.data.progresso_usuario.find(
            p => p.id_usuario === id_usuario && p.id_nivel === proximoNivelObj.id_nivel
          );
          if (proximoProgresso) {
            proximoProgresso.bloqueado = false;
          }
          proximo_nivel_desbloqueado = proximoNivelObj;
        }
      }
    }

    this.save();
    return { progresso: progCopy, proximo_nivel_desbloqueado };
  }

  // Custom AI-Generated Lesson injection
  public injectCustomLicao(
    id_nivel: number,
    titulo: string,
    vocabs: Omit<Vocabulario, "id_vocabulario" | "id_licao">[],
    gram: Omit<Gramatica, "id_gramatica" | "id_licao">,
    explicacao_profunda?: string
  ): Licao {
    // 1. Criar lição
    const id_licao = this.data.licoes.length > 0 ? Math.max(...this.data.licoes.map(l => l.id_licao)) + 1 : 1;
    const ordem_licao = this.data.licoes.filter(l => l.id_nivel === id_nivel).length + 1;

    let finalExp = explicacao_profunda;
    if (!finalExp) {
      const levelObj = this.data.niveis.find(n => n.id_nivel === id_nivel);
      if (levelObj) {
        const level_atual = levelObj.nivel_atual;
        const idiomaObj = this.data.idiomas.find(i => i.id_idioma === levelObj.id_idioma);
        const nome_idioma = idiomaObj ? idiomaObj.nome_idioma : "Inglês";
        finalExp = getGeneratedExplicacaoProfunda(nome_idioma, level_atual, ordem_licao);
      }
    }

    const newLicao: Licao = {
      id_licao,
      id_nivel,
      titulo,
      ordem_licao,
      explicacao_profunda: finalExp
    };
    this.data.licoes.push(newLicao);

    // 2. Inserir vocabulários
    vocabs.forEach(v => {
      const id_vocabulario = this.data.vocabularios.length > 0 ? Math.max(...this.data.vocabularios.map(vo => vo.id_vocabulario)) + 1 : 1;
      this.data.vocabularios.push({
        ...v,
        id_vocabulario,
        id_licao
      });
    });

    // 3. Inserir gramática
    const id_gramatica = this.data.gramaticas.length > 0 ? Math.max(...this.data.gramaticas.map(g => g.id_gramatica)) + 1 : 1;
    this.data.gramaticas.push({
      ...gram,
      id_gramatica,
      id_licao
    });

    this.save();
    return newLicao;
  }

  // Admin: Add a language
  public addIdioma(nome_idioma: string): Idioma {
    const existing = this.data.idiomas.find(i => i.nome_idioma.toLowerCase() === nome_idioma.toLowerCase());
    if (existing) {
      throw new Error("Idioma já cadastrado.");
    }
    const id_idioma = this.data.idiomas.length > 0 ? Math.max(...this.data.idiomas.map(i => i.id_idioma)) + 1 : 1;
    const newIdioma: Idioma = { id_idioma, nome_idioma };
    this.data.idiomas.push(newIdioma);

    // Create 3 levels (Intermediario, Medio, Avancado) for this new language
    const currentMaxNivelId = this.data.niveis.length > 0 ? Math.max(...this.data.niveis.map(n => n.id_nivel)) : 0;
    const n1: Nivel = { id_nivel: currentMaxNivelId + 1, id_idioma, nivel_atual: "Intermediario", ordem_nivel: 1 };
    const n2: Nivel = { id_nivel: currentMaxNivelId + 2, id_idioma, nivel_atual: "Medio", ordem_nivel: 2 };
    const n3: Nivel = { id_nivel: currentMaxNivelId + 3, id_idioma, nivel_atual: "Avancado", ordem_nivel: 3 };
    this.data.niveis.push(n1, n2, n3);

    // Create final exams for these 3 levels
    const currentMaxProvaId = this.data.provas_finais.length > 0 ? Math.max(...this.data.provas_finais.map(p => p.id_prova)) : 0;
    this.data.provas_finais.push(
      { id_prova: currentMaxProvaId + 1, id_nivel: n1.id_nivel },
      { id_prova: currentMaxProvaId + 2, id_nivel: n2.id_nivel },
      { id_prova: currentMaxProvaId + 3, id_nivel: n3.id_nivel }
    );

    // For all existing users, create progresso entries
    this.data.usuarios.forEach(u => {
      this.data.progresso_usuario.push(
        { id_progresso: this.data.progresso_usuario.length + 1, id_usuario: u.id_usuario, id_nivel: n1.id_nivel, bloqueado: false, concluido: false, nota_prova_final: 0 },
        { id_progresso: this.data.progresso_usuario.length + 1, id_usuario: u.id_usuario, id_nivel: n2.id_nivel, bloqueado: true, concluido: false, nota_prova_final: 0 },
        { id_progresso: this.data.progresso_usuario.length + 1, id_usuario: u.id_usuario, id_nivel: n3.id_nivel, bloqueado: true, concluido: false, nota_prova_final: 0 }
      );
    });

    this.save();
    return newIdioma;
  }

  // Admin: Add a lesson manually
  public addLicao(id_nivel: number, titulo: string): Licao {
    const id_licao = this.data.licoes.length > 0 ? Math.max(...this.data.licoes.map(l => l.id_licao)) + 1 : 1;
    const ordem_licao = this.data.licoes.filter(l => l.id_nivel === id_nivel).length + 1;
    const newLicao: Licao = { id_licao, id_nivel, titulo, ordem_licao };
    this.data.licoes.push(newLicao);
    this.save();
    return newLicao;
  }

  // Admin: Delete a lesson
  public deleteLicao(id_licao: number): void {
    this.data.licoes = this.data.licoes.filter(l => l.id_licao !== id_licao);
    this.data.vocabularios = this.data.vocabularios.filter(v => v.id_licao !== id_licao);
    this.data.gramaticas = this.data.gramaticas.filter(g => g.id_licao !== id_licao);
    this.save();
  }

  // Admin: Add vocabulary
  public addVocabulario(id_licao: number, termo_original: string, traducao: string, exemplo1: string, exemplo2?: string, exemplo3?: string, url_audio?: string, url_imagem?: string): Vocabulario {
    const id_vocabulario = this.data.vocabularios.length > 0 ? Math.max(...this.data.vocabularios.map(v => v.id_vocabulario)) + 1 : 1;
    const newVocab: Vocabulario = {
      id_vocabulario,
      id_licao,
      termo_original,
      traducao,
      exemplo_contexto_1: exemplo1,
      exemplo_contexto_2: exemplo2,
      exemplo_contexto_3: exemplo3,
      url_audio,
      url_imagem
    };
    this.data.vocabularios.push(newVocab);
    this.save();
    return newVocab;
  }

  // Admin: Add grammar rule
  public addGramatica(id_licao: number, regra_titulo: string, explicacao: string, desafio_json: any): Gramatica {
    // Delete existing grammar for this lesson if exists
    this.data.gramaticas = this.data.gramaticas.filter(g => g.id_licao !== id_licao);
    const id_gramatica = this.data.gramaticas.length > 0 ? Math.max(...this.data.gramaticas.map(g => g.id_gramatica)) + 1 : 1;
    const newGrammar: Gramatica = {
      id_gramatica,
      id_licao,
      regra_titulo,
      explicacao,
      desafio_json
    };
    this.data.gramaticas.push(newGrammar);
    this.save();
    return newGrammar;
  }

  // Admin: Add a question to a level's final exam
  public addQuestaoProva(id_nivel: number, pergunta: string, categoria: "Vocabulario" | "Gramatica" | "Interpretacao", opcoes: string[], resposta_correta_index: number): QuestaoProva {
    let prova = this.data.provas_finais.find(p => p.id_nivel === id_nivel);
    if (!prova) {
      const currentMaxProvaId = this.data.provas_finais.length > 0 ? Math.max(...this.data.provas_finais.map(p => p.id_prova)) : 0;
      prova = { id_prova: currentMaxProvaId + 1, id_nivel };
      this.data.provas_finais.push(prova);
    }

    const id_questao = this.data.questoes_prova.length > 0 ? Math.max(...this.data.questoes_prova.map(q => q.id_questao)) + 1 : 1;
    const opcoes_resposta = opcoes.map((o, idx) => ({ id: idx + 1, texto: o }));
    const newQuestao: QuestaoProva = {
      id_questao,
      id_prova: prova.id_prova,
      pergunta,
      categoria,
      opcoes_resposta,
      resposta_correta_id: resposta_correta_index + 1
    };
    this.data.questoes_prova.push(newQuestao);
    this.save();
    return newQuestao;
  }

  // Admin: Reset progress of a user
  public resetProgressoUsuario(id_usuario: number): void {
    this.data.progresso_usuario = this.data.progresso_usuario.filter(p => p.id_usuario !== id_usuario);
    // Initialize again
    this.data.niveis.forEach(n => {
      const isIntermed = n.ordem_nivel === 1;
      this.data.progresso_usuario.push({
        id_progresso: this.data.progresso_usuario.length + 1,
        id_usuario,
        id_nivel: n.id_nivel,
        bloqueado: !isIntermed,
        concluido: false,
        nota_prova_final: 0
      });
    });
    this.save();
  }

  // Admin: Unlock all levels of a user
  public desbloquearTudoUsuario(id_usuario: number): void {
    this.data.progresso_usuario.forEach(p => {
      if (p.id_usuario === id_usuario) {
        p.bloqueado = false;
      }
    });
    this.save();
  }

  // Admin: Reset to seed
  public resetToSeeds(): void {
    this.data = getInitialSeed();
    this.save();
  }

  // Admin: Synchronize, update, and backfill all database data (all languages, levels, lessons, vocabularies, grammars, exams)
  public sincronizarTodosOsDados(): {
    totalIdiomas: number;
    totalNiveis: number;
    totalLicoes: number;
    totalVocabularios: number;
    totalGramaticas: number;
    totalQuestoes: number;
    totalUsuarios: number;
  } {
    const seed = getInitialSeed();

    // 1. Ensure all languages from seed exist
    seed.idiomas.forEach((seedIdioma) => {
      const exists = this.data.idiomas.some(i => i.nome_idioma.toLowerCase() === seedIdioma.nome_idioma.toLowerCase() || i.id_idioma === seedIdioma.id_idioma);
      if (!exists) {
        this.data.idiomas.push(seedIdioma);
      }
    });

    // 2. Ensure all 24 levels from seed exist
    seed.niveis.forEach((seedNivel) => {
      const exists = this.data.niveis.some(n => n.id_nivel === seedNivel.id_nivel);
      if (!exists) {
        this.data.niveis.push(seedNivel);
      }
    });

    // 3. Ensure all final exams from seed exist
    seed.provas_finais.forEach((seedProva) => {
      const exists = this.data.provas_finais.some(p => p.id_prova === seedProva.id_prova);
      if (!exists) {
        this.data.provas_finais.push(seedProva);
      }
    });

    // 4. Ensure all exam questions from seed exist
    seed.questoes_prova.forEach((seedQ) => {
      const exists = this.data.questoes_prova.some(q => q.id_questao === seedQ.id_questao);
      if (!exists) {
        this.data.questoes_prova.push(seedQ);
      }
    });

    // 5. Ensure 10 lessons per level and backfill rich explanations
    this.ensureTenLessonsPerLevel();

    // 6. Ensure all users have progress entries for all levels
    this.data.usuarios.forEach((u) => {
      this.data.niveis.forEach((n) => {
        const hasProg = this.data.progresso_usuario.some(p => p.id_usuario === u.id_usuario && p.id_nivel === n.id_nivel);
        if (!hasProg) {
          const isIntermed = n.ordem_nivel === 1;
          this.data.progresso_usuario.push({
            id_progresso: this.data.progresso_usuario.length + 1,
            id_usuario: u.id_usuario,
            id_nivel: n.id_nivel,
            bloqueado: !isIntermed,
            concluido: false,
            nota_prova_final: 0
          });
        }
      });
    });

    this.save();

    return {
      totalIdiomas: this.data.idiomas.length,
      totalNiveis: this.data.niveis.length,
      totalLicoes: this.data.licoes.length,
      totalVocabularios: this.data.vocabularios.length,
      totalGramaticas: this.data.gramaticas.length,
      totalQuestoes: this.data.questoes_prova.length,
      totalUsuarios: this.data.usuarios.length
    };
  }
}

// Export singleton instance for server-side usage
export const db = new DatabaseManager();
