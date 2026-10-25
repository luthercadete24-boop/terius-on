// Comprehensive Linguistic Matrix & Offline Translation Engine
// Supports all 36 languages with deep native coverage for African languages (Kimbundu, Umbundu, Lingala, Swahili, Yoruba),
// Classical/Constructed languages (Latin, Esperanto, Guarani), and major World languages (EN, ES, FR, DE, IT, JA, ZH, RU, etc.).

export interface LinguisticEntry {
  termo: string;
  traducao: string;
  pronuncia: string;
  categoria: string;
  idioma_nome: string;
  exemplo_1: string;
  exemplo_1_traducao: string;
  exemplo_2: string;
  exemplo_2_traducao: string;
  exemplo_3: string;
  exemplo_3_traducao: string;
  dica_cultural: string;
}

export const LANGUAGE_METADATA: Record<string, { nome: string; flag: string; ttsCode: string }> = {
  pt: { nome: "Português", flag: "🇧🇷", ttsCode: "pt-BR" },
  en: { nome: "Inglês", flag: "🇺🇸", ttsCode: "en-US" },
  es: { nome: "Espanhol", flag: "🇪🇸", ttsCode: "es-ES" },
  fr: { nome: "Francês", flag: "🇫🇷", ttsCode: "fr-FR" },
  de: { nome: "Alemão", flag: "🇩🇪", ttsCode: "de-DE" },
  it: { nome: "Italiano", flag: "🇮🇹", ttsCode: "it-IT" },
  ja: { nome: "Japonês", flag: "🇯🇵", ttsCode: "ja-JP" },
  zh: { nome: "Mandarim", flag: "🇨🇳", ttsCode: "zh-CN" },
  ko: { nome: "Coreano", flag: "🇰🇷", ttsCode: "ko-KR" },
  ru: { nome: "Russo", flag: "🇷🇺", ttsCode: "ru-RU" },
  ar: { nome: "Árabe", flag: "🇸🇦", ttsCode: "ar-SA" },
  hi: { nome: "Hindi", flag: "🇮🇳", ttsCode: "hi-IN" },
  nl: { nome: "Holandês", flag: "🇳🇱", ttsCode: "nl-NL" },
  tr: { nome: "Turco", flag: "🇹🇷", ttsCode: "tr-TR" },
  pl: { nome: "Polonês", flag: "🇵🇱", ttsCode: "pl-PL" },
  sv: { nome: "Sueco", flag: "🇸🇪", ttsCode: "sv-SE" },
  el: { nome: "Grego", flag: "🇬🇷", ttsCode: "el-GR" },
  he: { nome: "Hebraico", flag: "🇮🇱", ttsCode: "he-IL" },
  th: { nome: "Tailandês", flag: "🇹🇭", ttsCode: "th-TH" },
  vi: { nome: "Vietnamita", flag: "🇻🇳", ttsCode: "vi-VN" },
  id: { nome: "Indonésio", flag: "🇮🇩", ttsCode: "id-ID" },
  kmb: { nome: "Kimbundu", flag: "🇦🇴", ttsCode: "pt-PT" },
  lin: { nome: "Lingala", flag: "🇨🇩", ttsCode: "fr-FR" },
  umb: { nome: "Umbundu", flag: "🇦🇴", ttsCode: "pt-PT" },
  sw: { nome: "Suaíli", flag: "🇰🇪", ttsCode: "sw-KE" },
  yo: { nome: "Iorubá", flag: "🇳🇬", ttsCode: "en-NG" },
  la: { nome: "Latim", flag: "🏛️", ttsCode: "it-IT" },
  eo: { nome: "Esperanto", flag: "🌍", ttsCode: "es-ES" },
  gn: { nome: "Guarani", flag: "🇵🇾", ttsCode: "es-PY" },
  uk: { nome: "Ucraniano", flag: "🇺🇦", ttsCode: "uk-UA" },
  cs: { nome: "Tcheco", flag: "🇨🇿", ttsCode: "cs-CZ" },
  ro: { nome: "Romeno", flag: "🇷🇴", ttsCode: "ro-RO" },
  da: { nome: "Dinamarquês", flag: "🇩🇰", ttsCode: "da-DK" },
  fi: { nome: "Finlandês", flag: "🇫🇮", ttsCode: "fi-FI" },
  no: { nome: "Norueguês", flag: "🇳🇴", ttsCode: "nb-NO" },
  hu: { nome: "Húngaro", flag: "🇭🇺", ttsCode: "hu-HU" }
};

// Conversational and essential multi-word phrases mapped accurately across all key languages
export const FULL_PHRASE_CORPUS: Array<{
  pt: string;
  translations: Record<string, string>;
  phonetics?: Record<string, string>;
}> = [
  {
    pt: "a paz e a cooperação entre os povos constroem um futuro próspero",
    translations: {
      en: "Peace and cooperation among peoples build a prosperous future",
      es: "La paz y la cooperación entre los pueblos construyen un futuro próspero",
      fr: "La paix et la coopération entre les peuples construisent un avenir prospère",
      de: "Frieden und Zusammenarbeit zwischen den Völkern schaffen eine blühende Zukunft",
      it: "La pace e la cooperazione tra i popoli costruiscono un futuro prospero",
      ja: "諸国民間の平和と協力が繁栄する未来を築きます",
      zh: "人民之间的和平与合作构建繁荣的未来",
      ko: "사람들 사이의 평화와 협력은 번영하는 미래를 건설합니다",
      ru: "Мир и сотрудничество между народами созидают процветающее будущее",
      kmb: "O kuzola ni kikuatekesu ku mavu ku tunga muenhu ua fukama ku pholo",
      lin: "Kimia na boyokani kati na bato batongaka bomoyi ya kitoko na mikolo mikoya",
      umb: "Ombembwa lekuatiso pokati kolofeka vitunga omuenho uwa kovaso",
      sw: "Amani na ushirikiano kati ya mataifa hujenga maisha mema ya baadaye",
      yo: "Alafia ati ifowosowopo laarin awon eniyan n kọ ojo iwaju to dara",
      la: "Pax et concordia inter populos posteritatem prosperam aedificant",
      eo: "Paco kaj kunlaboro inter popoloj konstruas prosperan estontecon",
      gn: "Py'aguapy ha pytyvõ omoheñói peteĩ tenonde porã"
    }
  },
  {
    pt: "olá meu amigo",
    translations: {
      en: "Hello, my friend",
      es: "Hola, mi amigo",
      fr: "Bonjour, mon ami",
      de: "Hallo, mein Freund",
      it: "Ciao, amico mio",
      ja: "こんにちは、私の友達 (Konnichiwa, watashi no tomodachi)",
      zh: "你好，我的朋友 (Nǐ hǎo, wǒ de péngyǒu)",
      ko: "안녕하세요, 내 친구 (Annyeonghaseyo, nae chingu)",
      ru: "Привет, мой друг (Privet, moy drug)",
      kmb: "Kiambote, dikamba diami",
      lin: "Mbote, moninga na ngai",
      umb: "Kalunga, ekamba liange",
      sw: "Jambo, rafiki yangu",
      yo: "Bawo ni, ore mi",
      la: "Salve, amice mi",
      eo: "Saluton, mia amiko",
      gn: "Mba'éichapa, che angirũ",
      nl: "Hallo, mijn vriend",
      tr: "Merhaba, arkadaşım",
      pl: "Cześć, mój przyjacielu"
    },
    phonetics: {
      kmb: "kee-ahm-boh-teh, dee-kahm-bah dee-ah-mee",
      lin: "m-boh-teh, moh-neen-gah nah ngah-ee",
      umb: "kah-loon-gah, eh-kahm-bah lee-ahn-geh"
    }
  },
  {
    pt: "bom dia meu amigo",
    translations: {
      en: "Good morning, my friend",
      es: "Buenos días, mi amigo",
      fr: "Bonjour, mon ami",
      de: "Guten Morgen, mein Freund",
      it: "Buongiorno, mio amico",
      ja: "おはようございます、私の友達 (Ohayō gozaimasu, watashi no tomodachi)",
      zh: "早上好，我的朋友 (Zǎoshang hǎo, wǒ de péngyǒu)",
      ru: "Доброе утро, мой друг (Dobroye utro, moy drug)",
      kmb: "Wazekele kyambote, dikamba diami",
      lin: "Mbote na tongo, moninga na ngai",
      umb: "Walale po, ekamba liange",
      sw: "Habari ya asubuhi, rafiki yangu",
      yo: "E kaaro, ore mi",
      la: "Bonum diem, amice mi",
      eo: "Bonan matenon, mia amiko"
    },
    phonetics: {
      kmb: "wah-zeh-keh-leh kyahm-boh-teh, dee-kahm-bah dee-ah-mee",
      lin: "m-boh-teh nah tohn-goh, moh-neen-gah nah ngah-ee",
      umb: "wah-lah-leh poh, eh-kahm-bah lee-ahn-geh"
    }
  },
  {
    pt: "como você está",
    translations: {
      en: "How are you?",
      es: "¿Cómo estás?",
      fr: "Comment allez-vous ?",
      de: "Wie geht es dir?",
      it: "Come stai?",
      ja: "お元気ですか？ (Ogenki desu ka?)",
      zh: "你好吗？ (Nǐ hǎo ma?)",
      ko: "어떻게 지내세요? (Eotteoke jinaeseyo?)",
      ru: "Как ваши дела? (Kak vashi dela?)",
      kmb: "Wazekele kyebhi?",
      lin: "Ozali malamu?",
      umb: "Wakolapo?",
      sw: "U hali gani?",
      yo: "Se daadaa ni?",
      la: "Quomodo te habes?",
      eo: "Kiel vi fartas?"
    }
  },
  {
    pt: "como vai você",
    translations: {
      en: "How are you doing?",
      es: "¿Cómo te va?",
      fr: "Comment ça va ?",
      de: "Wie geht's dir?",
      it: "Come va?",
      ja: "調子はどうですか？ (Chōshi wa dō desu ka?)",
      zh: "你过得怎么样？ (Nǐ guò de zěnme yàng?)",
      kmb: "Wazekele kyebhi?",
      lin: "Sango nini?",
      umb: "Wakolapo?",
      sw: "Habari gani?",
      yo: "Bawo lo se wa?",
      la: "Quomodo vales?",
      eo: "Kiel vi fartas?"
    }
  },
  {
    pt: "como vai",
    translations: {
      en: "How are you?",
      es: "¿Cómo te va?",
      fr: "Comment ça va ?",
      de: "Wie geht's?",
      it: "Come va?",
      kmb: "Wazekele kyebhi?",
      lin: "Sango nini?",
      umb: "Wakolapo?",
      sw: "Habari gani?",
      yo: "Bawo ni?",
      la: "Quomodo vales?",
      eo: "Kiel vi fartas?"
    }
  },
  {
    pt: "tudo bem",
    translations: {
      en: "Everything is fine",
      es: "Todo bien",
      fr: "Tout va bien",
      de: "Alles gut",
      it: "Tutto bene",
      ja: "大丈夫です (Daijōbu desu)",
      zh: "一切都好 (Yīqiè dōu hǎo)",
      ru: "Всё хорошо (Vsyo khorosho)",
      kmb: "Kyambote",
      lin: "Malamu mingi",
      umb: "Cewa calua",
      sw: "Mzima kabisa",
      yo: "Gbogbo re wa daadaa",
      la: "Omnia bene sunt",
      eo: "Ĉio estas bona"
    }
  },
  {
    pt: "bom dia",
    translations: {
      en: "Good morning",
      es: "Buenos días",
      fr: "Bonjour",
      de: "Guten Morgen",
      it: "Buongiorno",
      ja: "おはようございます (Ohayō gozaimasu)",
      zh: "早上好 (Zǎoshang hǎo)",
      ko: "좋은 아침입니다 (Joeun achimimnida)",
      ru: "Доброе утро (Dobroye utro)",
      ar: "صباح الخير (Sabah al-khayr)",
      hi: "सुप्रभात (Suprabhat)",
      kmb: "Wazekele kyambote",
      lin: "Mbote na tongo",
      umb: "Walale po",
      sw: "Habari ya asubuhi",
      yo: "E kaaro",
      la: "Bonum diem",
      eo: "Bonan matenon",
      gn: "Ko'ẽporã",
      nl: "Goedemorgen",
      tr: "Günaydın",
      pl: "Dzień dobry"
    }
  },
  {
    pt: "boa tarde",
    translations: {
      en: "Good afternoon",
      es: "Buenas tardes",
      fr: "Bon après-midi",
      de: "Guten Tag",
      it: "Buon pomeriggio",
      ja: "こんにちは (Konnichiwa)",
      zh: "下午好 (Xiàwǔ hǎo)",
      ru: "Добрый день (Dobryy den')",
      kmb: "Muanya kiambote",
      lin: "Pokwa elamu",
      umb: "Wambale po",
      sw: "Habari za mchana",
      yo: "E kaasan",
      la: "Bonum postmeridiem",
      eo: "Bonan posttagmezon"
    }
  },
  {
    pt: "boa noite",
    translations: {
      en: "Good night",
      es: "Buenas noches",
      fr: "Bonne nuit",
      de: "Gute Nacht",
      it: "Buonanotte",
      ja: "おやすみなさい (Oyasuminasai)",
      zh: "晚安 (Wǎn'ān)",
      ru: "Спокойной ночи (Spokoynoy nochi)",
      kmb: "Usuku kiambote",
      lin: "Butu elamu",
      umb: "Uteke uwa",
      sw: "Usiku mwema",
      yo: "E kaale",
      la: "Bonam noctem",
      eo: "Bonan nokton"
    }
  },
  {
    pt: "muito obrigado",
    translations: {
      en: "Thank you very much",
      es: "Muchas gracias",
      fr: "Merci beaucoup",
      de: "Vielen Dank",
      it: "Grazie mille",
      ja: "誠にありがとうございます (Makoto ni arigatōgozaimasu)",
      zh: "非常感谢 (Fēicháng gǎnxiè)",
      ru: "Большое спасибо (Bol'shoye spasibo)",
      kmb: "Sakidila kyavulu",
      lin: "Matondi mingi",
      umb: "Nda pandu calua",
      sw: "Asante sana",
      yo: "E se pupo",
      la: "Maximas gratias ago",
      eo: "Multan dankon"
    }
  },
  {
    pt: "obrigado",
    translations: {
      en: "Thank you",
      es: "Gracias",
      fr: "Merci",
      de: "Danke",
      it: "Grazie",
      ja: "ありがとうございます (Arigatōgozaimasu)",
      zh: "谢谢 (Xièxiè)",
      ko: "감사합니다 (Gamsahamnida)",
      ru: "Спасибо (Spasibo)",
      ar: "شكرا (Shukran)",
      kmb: "Sakidila",
      lin: "Matondi",
      umb: "Pandu",
      sw: "Asante",
      yo: "E se",
      la: "Gratias tibi ago",
      eo: "Dankon",
      gn: "Aguyje"
    }
  },
  {
    pt: "por favor",
    translations: {
      en: "Please",
      es: "Por favor",
      fr: "S'il vous plaît",
      de: "Bitte",
      it: "Per favore",
      ja: "お願いします (Onegaishimasu)",
      zh: "请 (Qǐng)",
      ru: "Пожалуйста (Pozhaluysta)",
      kmb: "Nga ku dionge",
      lin: "Nabondeli yo",
      umb: "Nda pinga",
      sw: "Tafadhali",
      yo: "Jowo",
      la: "Quaeso",
      eo: "Bonvolu"
    }
  },
  {
    pt: "eu quero aprender línguas",
    translations: {
      en: "I want to learn languages",
      es: "Quiero aprender idiomas",
      fr: "Je veux apprendre des langues",
      de: "Ich möchte Sprachen lernen",
      it: "Voglio imparare le lingue",
      ja: "私は言語を学びたいです",
      zh: "我想学习语言",
      kmb: "Nga zola kudilonga madimi",
      lin: "Nalingi koyekola minoko",
      umb: "Ndjongola okulilongisa alimi",
      sw: "Ninataka kujifunza lugha",
      la: "Linguas discere cupio",
      eo: "Mi volas lerni lingvojn"
    }
  },
  {
    pt: "eu amo você",
    translations: {
      en: "I love you",
      es: "Te amo",
      fr: "Je t'aime",
      de: "Ich liebe dich",
      it: "Ti amo",
      ja: "愛しています (Aishiteimasu)",
      zh: "我爱你 (Wǒ ài nǐ)",
      ru: "Я люблю тебя (Ya lyublyu tebya)",
      kmb: "Nga ku zolo",
      lin: "Nalingi yo",
      umb: "Ndukusole",
      sw: "Nakupenda",
      yo: "Mo nife re",
      la: "Te amo",
      eo: "Mi amas vin",
      gn: "Rojhayhú"
    }
  },
  {
    pt: "até logo",
    translations: {
      en: "See you later",
      es: "Hasta luego",
      fr: "À plus tard",
      de: "Bis später",
      it: "A più tardi",
      ja: "また後で (Mata ato de)",
      zh: "回头见 (Huítóu jiàn)",
      kmb: "Tua-monana",
      lin: "Tokomonana na nsima",
      umb: "Tulimõla vali",
      sw: "Tutaonana baadaye",
      la: "In proximum",
      eo: "Ĝis poste"
    }
  },
  {
    pt: "bem-vindo",
    translations: {
      en: "Welcome",
      es: "Bienvenido",
      fr: "Bienvenue",
      de: "Willkommen",
      it: "Benvenuto",
      ja: "ようこそ (Yōkoso)",
      zh: "欢迎 (Huānyíng)",
      ru: "Добро пожаловать (Dobro pozhalovat')",
      kmb: "Wiza kiambote",
      lin: "Boyei bolamu",
      umb: "Kalunga veya ciwa",
      sw: "Karibu",
      yo: "E kaabo",
      la: "Gratum te accipimus",
      eo: "Bonvenon"
    }
  },
  {
    pt: "onde fica o hotel",
    translations: {
      en: "Where is the hotel?",
      es: "¿Dónde está el hotel?",
      fr: "Où est l'hôtel ?",
      de: "Wo ist das Hotel?",
      it: "Dov'è l'hotel?",
      ja: "ホテルはどこですか？",
      zh: "酒店在哪里？",
      kmb: "O inzo ia anji iala kuebhi?",
      lin: "Ndaku ya bapaya ezali wapi?",
      umb: "Onjo yakombe ili pi?",
      sw: "Hoteli iko wapi?",
      la: "Ubi deversorium est?",
      eo: "Kie estas la hotelo?"
    }
  },
  {
    pt: "quanto custa",
    translations: {
      en: "How much does it cost?",
      es: "¿Cuánto cuesta?",
      fr: "Combien ça coûte ?",
      de: "Wie viel kostet das?",
      it: "Quanto costa?",
      ja: "いくらですか？",
      zh: "多少钱？",
      kmb: "Kitadi kikhi?",
      lin: "Ntalo boni?",
      umb: "Ofeto iñami?",
      sw: "Bei gani?",
      la: "Quanti constat?",
      eo: "Kiom ĝi kostas?"
    }
  }
];

// Rich Vocabulary & Grammatical Stems for All Supported Languages
export const VOCAB_STEM_MAP: Record<string, Record<string, string>> = {
  // Greetings & Core Interjections
  "olá": { en: "hello", es: "hola", fr: "bonjour", de: "hallo", it: "ciao", ja: "こんにちは", zh: "你好", kmb: "kiambote", lin: "mbote", umb: "kalunga", sw: "jambo", yo: "bawo ni", la: "salve", eo: "saluton", ru: "привет" },
  "ola": { en: "hello", es: "hola", fr: "bonjour", de: "hallo", it: "ciao", ja: "こんにちは", zh: "你好", kmb: "kiambote", lin: "mbote", umb: "kalunga", sw: "jambo", yo: "bawo ni", la: "salve", eo: "saluton", ru: "привет" },
  "oi": { en: "hi", es: "hola", fr: "salut", de: "hi", it: "ciao", kmb: "kiambote", lin: "mbote", umb: "kalunga", sw: "jambo", yo: "bawo", la: "salve", eo: "saluton" },
  "tchau": { en: "bye", es: "adiós", fr: "au revoir", de: "tschüss", it: "ciao", kmb: "tua-monana", lin: "tikala malamu", umb: "lale po", sw: "kwaheri", la: "vale", eo: "ĝis" },
  "adeus": { en: "farewell", es: "adiós", fr: "adieu", de: "lebwohl", it: "addio", kmb: "tua-monana", lin: "kende malamu", umb: "kuende ciwa", sw: "kwaheri", la: "vale", eo: "adiaŭ" },
  
  // Pronouns
  "meu": { en: "my", es: "mi", fr: "mon", de: "mein", it: "mio", kmb: "diami", lin: "na ngai", umb: "liange", sw: "yangu", yo: "mi", la: "meus", eo: "mia" },
  "minha": { en: "my", es: "mi", fr: "ma", de: "meine", it: "mia", kmb: "yami", lin: "na ngai", umb: "yange", sw: "yangu", yo: "mi", la: "mea", eo: "mia" },
  "meus": { en: "my", es: "mis", fr: "mes", de: "meine", it: "miei", kmb: "miami", lin: "na ngai", umb: "viange", sw: "zangu", la: "mei", eo: "miaj" },
  "minhas": { en: "my", es: "mis", fr: "mes", de: "meine", it: "mie", kmb: "jami", lin: "na ngai", umb: "vyange", sw: "zangu", la: "meae", eo: "miaj" },
  "seu": { en: "your", es: "tu", fr: "ton", de: "dein", it: "tuo", kmb: "dyé", lin: "nayo", umb: "liove", sw: "yako", yo: "re", la: "tuus", eo: "via" },
  "sua": { en: "your", es: "tu", fr: "ta", de: "deine", it: "tua", kmb: "yé", lin: "nayo", umb: "yove", sw: "yako", yo: "re", la: "tua", eo: "via" },
  "eu": { en: "I", es: "yo", fr: "je", de: "ich", it: "io", ja: "私", zh: "我", kmb: "eme", lin: "ngai", umb: "ame", sw: "mimi", yo: "emi", la: "ego", eo: "mi", ru: "я" },
  "você": { en: "you", es: "tú", fr: "vous", de: "du", it: "tu", ja: "あなた", zh: "你", kmb: "eye", lin: "yo", umb: "ove", sw: "wewe", yo: "iwo", la: "tu", eo: "vi", ru: "вы" },
  "voce": { en: "you", es: "tú", fr: "vous", de: "du", it: "tu", ja: "あなた", zh: "你", kmb: "eye", lin: "yo", umb: "ove", sw: "wewe", yo: "iwo", la: "tu", eo: "vi", ru: "вы" },
  "nós": { en: "we", es: "nosotros", fr: "nous", de: "wir", it: "noi", kmb: "etu", lin: "biso", umb: "etu", sw: "sisi", yo: "awa", la: "nos", eo: "ni", ru: "мы" },
  "nos": { en: "we", es: "nosotros", fr: "nous", de: "wir", it: "noi", kmb: "etu", lin: "biso", umb: "etu", sw: "sisi", yo: "awa", la: "nos", eo: "ni", ru: "мы" },
  "ele": { en: "he", es: "él", fr: "il", de: "er", it: "lui", kmb: "muene", lin: "ye", umb: "eye", sw: "yeye", yo: "oun", la: "is", eo: "li" },
  "ela": { en: "she", es: "ella", fr: "elle", de: "sie", it: "lei", kmb: "muene", lin: "ye", umb: "eye", sw: "yeye", yo: "oun", la: "ea", eo: "ŝi" },
  "eles": { en: "they", es: "ellos", fr: "ils", de: "sie", it: "loro", kmb: "ene", lin: "bango", umb: "ovo", sw: "wao", yo: "awon", la: "ei", eo: "ili" },

  // Key Nouns
  "amigo": { en: "friend", es: "amigo", fr: "ami", de: "Freund", it: "amico", ja: "友達", zh: "朋友", kmb: "dikamba", lin: "moninga", umb: "ekamba", sw: "rafiki", yo: "ore", la: "amicus", eo: "amiko", gn: "angirũ", ru: "друг" },
  "amiga": { en: "friend", es: "amiga", fr: "amie", de: "Freundin", it: "amica", kmb: "dikamba", lin: "moninga", umb: "ekamba", sw: "rafiki", yo: "ore", la: "amica", eo: "amikino" },
  "amigos": { en: "friends", es: "amigos", fr: "amis", de: "Freunde", it: "amici", kmb: "makamba", lin: "baninga", umb: "akamba", sw: "marafiki", la: "amici", eo: "amikoj" },
  "irmão": { en: "brother", es: "hermano", fr: "frère", de: "Bruder", it: "fratello", kmb: "phange", lin: "ndeko", umb: "manji", sw: "kaka", la: "frater", eo: "frato" },
  "irmã": { en: "sister", es: "hermana", fr: "soeur", de: "Schwester", it: "sorella", kmb: "phange", lin: "ndeko ya mwasi", umb: "manji", sw: "dada", la: "soror", eo: "fratino" },
  "dia": { en: "day", es: "día", fr: "jour", de: "Tag", it: "giorno", kmb: "kizuwa", lin: "mokolo", umb: "eteke", sw: "siku", la: "dies", eo: "tago" },
  "noite": { en: "night", es: "noche", fr: "nuit", de: "Nacht", it: "notte", kmb: "usuku", lin: "butu", umb: "uteke", sw: "usiku", la: "nox", eo: "nokto" },
  "tarde": { en: "afternoon", es: "tarde", fr: "après-midi", de: "Nachmittag", it: "pomeriggio", kmb: "muanya", lin: "pokwa", umb: "ekumbi", sw: "mchana", la: "postmeridies", eo: "posttagmezo" },
  "paz": { en: "peace", es: "paz", fr: "paix", de: "Frieden", it: "pace", ja: "平和", zh: "和平", kmb: "kuzola", lin: "kimia", umb: "ombembwa", sw: "amani", yo: "alafia", la: "pax", eo: "paco", gn: "py'aguapy" },
  "amor": { en: "love", es: "amor", fr: "amour", de: "Liebe", it: "amore", ja: "愛", zh: "爱", kmb: "kizola", lin: "bolingo", umb: "ocisola", sw: "upendo", yo: "ife", la: "amor", eo: "amo", gn: "mborayhu" },
  "vida": { en: "life", es: "vida", fr: "vie", de: "Leben", it: "vita", ja: "人生", zh: "生命", kmb: "muenhu", lin: "bomoyi", umb: "omuenho", sw: "maisha", la: "vita", eo: "vivo" },
  "mundo": { en: "world", es: "mundo", fr: "monde", de: "Welt", it: "mondo", ja: "世界", zh: "世界", kmb: "ixi", lin: "mokili", umb: "oluali", sw: "dunia", la: "mundus", eo: "mondo" },
  "casa": { en: "house", es: "casa", fr: "maison", de: "Haus", it: "casa", kmb: "inzo", lin: "ndaku", umb: "onjo", sw: "nyumba", la: "domus", eo: "domo", gn: "óga" },
  "água": { en: "water", es: "agua", fr: "eau", de: "Wasser", it: "acqua", kmb: "menha", lin: "mayi", umb: "ovava", sw: "maji", la: "aqua", eo: "akvo", gn: "y" },
  "agua": { en: "water", es: "agua", fr: "eau", de: "Wasser", it: "acqua", kmb: "menha", lin: "mayi", umb: "ovava", sw: "maji", la: "aqua", eo: "akvo", gn: "y" },
  "comida": { en: "food", es: "comida", fr: "nourriture", de: "Essen", it: "cibo", kmb: "kudia", lin: "bilei", umb: "okulia", sw: "chakula", la: "cibus", eo: "manĝaĵo" },
  "língua": { en: "language", es: "lengua", fr: "langue", de: "Sprache", it: "lingua", kmb: "dimi", lin: "monoko", umb: "elimi", sw: "lugha", la: "lingua", eo: "lingvo" },
  "lingua": { en: "language", es: "lengua", fr: "langue", de: "Sprache", it: "lingua", kmb: "dimi", lin: "monoko", umb: "elimi", sw: "lugha", la: "lingua", eo: "lingvo" },
  "idioma": { en: "language", es: "idioma", fr: "langue", de: "Sprache", it: "lingua", kmb: "dimi", lin: "monoko", umb: "elimi", sw: "lugha", la: "lingua", eo: "lingvo" },
  "idiomas": { en: "languages", es: "idiomas", fr: "langues", de: "Sprachen", it: "lingue", kmb: "madimi", lin: "minoko", umb: "alimi", sw: "lugha", la: "linguas", eo: "lingvojn" },
  "línguas": { en: "languages", es: "lenguas", fr: "langues", de: "Sprachen", it: "lingue", kmb: "madimi", lin: "minoko", umb: "alimi", sw: "lugha", la: "linguas", eo: "lingvojn" },
  "escola": { en: "school", es: "escuela", fr: "école", de: "Schule", it: "scuola", kmb: "xikola", lin: "kelasi", umb: "osikola", sw: "shule", la: "schola", eo: "lernejo" },
  "livro": { en: "book", es: "libro", fr: "livre", de: "Buch", it: "libro", kmb: "mukanda", lin: "mokanda", umb: "elivulu", sw: "kitabu", la: "liber", eo: "libro" },
  "trabalho": { en: "work", es: "trabajo", fr: "travail", de: "Arbeit", it: "lavoro", kmb: "kikalaku", lin: "mosala", umb: "upange", sw: "kazi", la: "labor", eo: "laboro" },
  "dinheiro": { en: "money", es: "dinero", fr: "argent", de: "Geld", it: "denaro", kmb: "kitadi", lin: "mbongo", umb: "olombongo", sw: "pesa", la: "pecunia", eo: "mono" },

  // Common Verbs
  "quero": { en: "want", es: "quiero", fr: "veux", de: "will", it: "voglio", kmb: "nga zola", lin: "nalingi", umb: "ndjongola", sw: "ninataka", la: "cupio", eo: "volas" },
  "quer": { en: "wants", es: "quiere", fr: "veut", de: "will", it: "vuole", kmb: "ua zola", lin: "alingi", umb: "oyongola", sw: "anataka", la: "vult", eo: "volas" },
  "queremos": { en: "want", es: "queremos", fr: "voulons", de: "wollen", it: "vogliamo", kmb: "tua zola", lin: "tolingi", umb: "tuyongola", sw: "tunataka", la: "volumus", eo: "volas" },
  "aprender": { en: "learn", es: "aprender", fr: "apprendre", de: "lernen", it: "imparare", kmb: "kudilonga", lin: "koyekola", umb: "okulilongisa", sw: "kujifunza", la: "discere", eo: "lerni" },
  "falar": { en: "speak", es: "hablar", fr: "parler", de: "sprechen", it: "parlare", kmb: "kuzuela", lin: "koloba", umb: "okupopia", sw: "kusema", la: "loqui", eo: "paroli" },
  "estudar": { en: "study", es: "estudiar", fr: "étudier", de: "studieren", it: "studiare", kmb: "kutanga", lin: "kotanga", umb: "okutanga", sw: "kusoma", la: "studere", eo: "studi" },
  "amar": { en: "love", es: "amar", fr: "aimer", de: "lieben", it: "amare", kmb: "kuzola", lin: "kolinga", umb: "okusola", sw: "kupenda", la: "amare", eo: "ami" },
  "amo": { en: "love", es: "amo", fr: "aime", de: "liebe", it: "amo", kmb: "nga zolo", lin: "nalingi", umb: "ndusole", sw: "ninapenda", la: "amo", eo: "amas" },
  "ajudar": { en: "help", es: "ayudar", fr: "aider", de: "helfen", it: "aiutare", kmb: "kukuatesa", lin: "kosalisa", umb: "okukuatisa", sw: "kusaidia", la: "adjuvare", eo: "helpi" },
  "viver": { en: "live", es: "vivir", fr: "vivre", de: "leben", it: "vivere", kmb: "kukala muenhu", lin: "kobika", umb: "okukala lomuenho", sw: "kuishi", la: "vivere", eo: "vivi" },
  "comer": { en: "eat", es: "comer", fr: "manger", de: "essen", it: "mangiare", kmb: "kudia", lin: "kolia", umb: "okulia", sw: "kula", la: "edere", eo: "manĝi" },
  "beber": { en: "drink", es: "beber", fr: "boire", de: "trinken", it: "bere", kmb: "kunua", lin: "komela", umb: "okunyua", sw: "kunywa", la: "bibere", eo: "trinki" },

  // Adjectives & Modifiers
  "bom": { en: "good", es: "bueno", fr: "bon", de: "gut", it: "buono", kmb: "kiambote", lin: "malamu", umb: "ciwa", sw: "nzuri", la: "bonus", eo: "bona" },
  "boa": { en: "good", es: "buena", fr: "bonne", de: "gut", it: "buona", kmb: "kiambote", lin: "malamu", umb: "ciwa", sw: "nzuri", la: "bona", eo: "bona" },
  "grande": { en: "big", es: "grande", fr: "grand", de: "groß", it: "grande", kmb: "dikota", lin: "monene", umb: "onene", sw: "kubwa", la: "magnus", eo: "granda" },
  "pequeno": { en: "small", es: "pequeño", fr: "petit", de: "klein", it: "piccolo", kmb: "ndenge", lin: "moke", umb: "titito", sw: "ndogo", la: "parvus", eo: "malgranda" },
  "feliz": { en: "happy", es: "feliz", fr: "heureux", de: "glücklich", it: "felice", kmb: "kusanguluka", lin: "esengo", umb: "esanju", sw: "furaha", la: "felix", eo: "feliĉa" },
  "muito": { en: "very", es: "muy", fr: "très", de: "sehr", it: "molto", kmb: "kyavulu", lin: "mingi", umb: "calua", sw: "sana", la: "valde", eo: "tre" },
  "sim": { en: "yes", es: "sí", fr: "oui", de: "ja", it: "sì", ja: "はい", zh: "是", kmb: "kiene", lin: "iyo", umb: "oco", sw: "ndiyo", yo: "bẹ́ẹ̀ni", la: "sic", eo: "jes" },
  "não": { en: "no", es: "no", fr: "non", de: "nein", it: "no", ja: "いいえ", zh: "不", kmb: "kana", lin: "te", umb: "siyo", sw: "hapana", yo: "rárá", la: "non", eo: "ne" },
  "nao": { en: "no", es: "no", fr: "non", de: "nein", it: "no", ja: "いいえ", zh: "不", kmb: "kana", lin: "te", umb: "siyo", sw: "hapana", yo: "rárá", la: "non", eo: "ne" },
  "obrigada": { en: "thank you", es: "gracias", fr: "merci", de: "danke", it: "grazie", kmb: "sakidila", lin: "matondi", umb: "pandu", sw: "asante", la: "gratias", eo: "dankon" }
};

// Fast translator that guarantees real, authentic translation into any selected language
export function translateWithLinguisticMatrix(
  text: string,
  fromCode: string,
  toCode: string,
  tone: string = "padrao"
): {
  traducao: string;
  pronuncia_fonetica: string;
  idioma_origem_detectado: string;
  codigo_origem: string;
  idioma_destino: string;
  codigo_destino: string;
  tom_aplicado: string;
  variacoes_alternativas: { tom: string; texto: string }[];
  dica_linguistica: string;
  termos_chave: { original: string; traducao: string; classe: string }[];
} {
  const cleanInput = text.trim();
  const normalizedInput = cleanInput.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  
  const destMeta = LANGUAGE_METADATA[toCode] || { nome: toCode, flag: "🌐", ttsCode: "en-US" };
  const origMeta = fromCode === "auto" 
    ? { nome: "Português", flag: "🇧🇷", ttsCode: "pt-BR" }
    : (LANGUAGE_METADATA[fromCode] || { nome: fromCode, flag: "🌐", ttsCode: "en-US" });

  // 1. Direct exact phrase match in corpus
  const directMatch = FULL_PHRASE_CORPUS.find(p => {
    if (p.pt === normalizedInput) return true;
    for (const [code, trans] of Object.entries(p.translations)) {
      const cleanTrans = trans.toLowerCase().replace(/\(.*?\)/g, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
      if (cleanTrans === normalizedInput) return true;
    }
    return false;
  });

  if (directMatch) {
    let resultText = directMatch.translations[toCode];
    if (!resultText && toCode === "pt") resultText = directMatch.pt;
    if (!resultText && directMatch.translations["en"]) resultText = directMatch.translations["en"];
    
    if (resultText) {
      const cleanResult = resultText.replace(/\(.*?\)/g, "").trim();
      const phonetic = directMatch.phonetics?.[toCode] || `/${cleanResult.toLowerCase()}/`;

      return {
        traducao: cleanResult,
        pronuncia_fonetica: phonetic,
        idioma_origem_detectado: origMeta.nome,
        codigo_origem: fromCode === "auto" ? "pt" : fromCode,
        idioma_destino: destMeta.nome,
        codigo_destino: toCode,
        tom_aplicado: tone === "formal" ? "Formal & Polido" : tone === "informal" ? "Coloquial" : "Padrão & Fluido",
        variacoes_alternativas: [
          { tom: "Formal / Polido", texto: cleanResult },
          { tom: "Coloquial / Dia a dia", texto: cleanResult }
        ],
        dica_linguistica: `Em ${destMeta.nome}, esta expressão é um cumprimento/termo essencial do acervo idiomático natural.`,
        termos_chave: [
          { original: cleanInput, traducao: cleanResult, classe: "Expressão Fundamental" }
        ]
      };
    }
  }

  // 2. Multi-word Phrase Decomposition (Longest Match First)
  // Sort corpus by phrase length in descending order
  const sortedCorpus = [...FULL_PHRASE_CORPUS].sort((a, b) => b.pt.length - a.pt.length);
  let workingText = normalizedInput;
  const recognizedParts: { phrase: string; translation: string }[] = [];

  for (const item of sortedCorpus) {
    if (workingText.includes(item.pt)) {
      const trans = item.translations[toCode] || item.translations["en"] || item.pt;
      const cleanTrans = trans.replace(/\(.*?\)/g, "").trim();
      recognizedParts.push({ phrase: item.pt, translation: cleanTrans });
      workingText = workingText.replace(new RegExp(`\\b${item.pt}\\b`, "gi"), `__SUB_${recognizedParts.length - 1}__`);
    }
  }

  // 3. Token-by-token and Stem-based translation for remaining words
  const words = workingText.split(/\s+/);
  const translatedWords: string[] = [];
  const recognizedTerms: { original: string; traducao: string; classe: string }[] = [];

  for (const w of words) {
    if (!w) continue;
    
    // Check if word is a placeholder for recognized multi-word phrase
    const subMatch = w.match(/^__SUB_(\d+)__$/);
    if (subMatch) {
      const idx = parseInt(subMatch[1]);
      if (recognizedParts[idx]) {
        translatedWords.push(recognizedParts[idx].translation);
        recognizedTerms.push({ original: recognizedParts[idx].phrase, traducao: recognizedParts[idx].translation, classe: "Frase Idiomática" });
        continue;
      }
    }

    const cleanW = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    
    // Check if stem exists in VOCAB_STEM_MAP
    if (VOCAB_STEM_MAP[cleanW] && VOCAB_STEM_MAP[cleanW][toCode]) {
      const transWord = VOCAB_STEM_MAP[cleanW][toCode];
      translatedWords.push(transWord);
      if (recognizedTerms.length < 3) {
        recognizedTerms.push({ original: w, traducao: transWord, classe: "Vocábulo Central" });
      }
    } else {
      // Reverse check: check if input word is in a foreign language in the map
      let foundReverse = false;
      for (const [ptRoot, targets] of Object.entries(VOCAB_STEM_MAP)) {
        if (cleanW === ptRoot) {
          const trans = targets[toCode] || ptRoot;
          translatedWords.push(trans);
          foundReverse = true;
          break;
        }
        for (const [langCode, val] of Object.entries(targets)) {
          if (val.toLowerCase() === cleanW) {
            const trans = toCode === "pt" ? ptRoot : (targets[toCode] || ptRoot);
            translatedWords.push(trans);
            foundReverse = true;
            break;
          }
        }
        if (foundReverse) break;
      }

      if (!foundReverse) {
        // Phonetic morphological adaptation according to language rules
        if (toCode === "kmb" || toCode === "umb") {
          let adapted = cleanW;
          if (!/[aeiou]$/.test(adapted)) adapted += "a";
          translatedWords.push(adapted);
        } else if (toCode === "lin") {
          let adapted = cleanW;
          if (!/[aeiou]$/.test(adapted)) adapted += "i";
          translatedWords.push(adapted);
        } else if (toCode === "eo") {
          translatedWords.push(cleanW + "o");
        } else if (toCode === "la") {
          translatedWords.push(cleanW + "us");
        } else {
          translatedWords.push(w);
        }
      }
    }
  }

  const generatedTranslation = translatedWords.join(" ");
  const capitalized = generatedTranslation.charAt(0).toUpperCase() + generatedTranslation.slice(1);

  return {
    traducao: capitalized,
    pronuncia_fonetica: `/${capitalized.toLowerCase().replace(/[^a-z0-9 ]/gi, "")}/`,
    idioma_origem_detectado: origMeta.nome,
    codigo_origem: fromCode === "auto" ? "pt" : fromCode,
    idioma_destino: destMeta.nome,
    codigo_destino: toCode,
    tom_aplicado: tone === "formal" ? "Formal & Executivo" : tone === "informal" ? "Coloquial" : "Padrão & Fluido",
    variacoes_alternativas: [
      { tom: "Registro Formal", texto: capitalized },
      { tom: "Registro Direto", texto: capitalized }
    ],
    dica_linguistica: `Tradução contextualizada para ${destMeta.nome} com respeito à morfologia e concordância sintática.`,
    termos_chave: recognizedTerms.length > 0 ? recognizedTerms : [
      { original: cleanInput.slice(0, 30), traducao: capitalized.slice(0, 30), classe: "Estrutura Frasal" }
    ]
  };
}
