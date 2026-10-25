import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldCheck, RefreshCw, FileText, Clock } from "lucide-react";

interface InstitutionalPagesProps {
  initialTab?: "sobre" | "contato" | "politicas";
}

export const InstitutionalPages: React.FC<InstitutionalPagesProps> = ({
  initialTab = "sobre"
}) => {
  const [activeTab, setActiveTab] = useState<"sobre" | "contato" | "politicas">(initialTab);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "Dúvida sobre Pedido",
    mensagem: ""
  });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setFormData({ nome: "", email: "", assunto: "Dúvida sobre Pedido", mensagem: "" });
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-stone-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("sobre")}
          className={`pb-3 px-5 text-sm font-semibold tracking-wide uppercase font-mono transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "sobre"
              ? "border-[#5A5A40] text-[#5A5A40]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          Sobre Nós (Nossa História)
        </button>

        <button
          onClick={() => setActiveTab("contato")}
          className={`pb-3 px-5 text-sm font-semibold tracking-wide uppercase font-mono transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "contato"
              ? "border-[#5A5A40] text-[#5A5A40]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          Fale Conosco & Atendimento
        </button>

        <button
          onClick={() => setActiveTab("politicas")}
          className={`pb-3 px-5 text-sm font-semibold tracking-wide uppercase font-mono transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "politicas"
              ? "border-[#5A5A40] text-[#5A5A40]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          Políticas, Termos & Reembolso
        </button>
      </div>

      {/* 1. SOBRE NÓS */}
      {activeTab === "sobre" && (
        <div className="space-y-10 animate-fade-in">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C05B33] font-bold">
              Manifesto de Marca
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
              A elegância mora na simplicidade funcional e no respeito à matéria-prima.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Fundada em 2024, a <strong>Teríus</strong> nasceu do desejo de desacelerar o consumo descartável. Acreditamos que os objetos e peças de vestuário que nos acompanham devem durar anos, envelhecendo com dignidade e caráter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-mono font-bold text-[#5A5A40]">01. Origem Consciente</span>
              <h3 className="font-serif text-lg font-bold text-stone-900">Matérias-Primas Nobres</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Linho puro pré-lavado, couro vegetal curtido sem cromo pesado, latão maciço e cerâmica de alta temperatura.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-mono font-bold text-[#5A5A40]">02. Transparência</span>
              <h3 className="font-serif text-lg font-bold text-stone-900">Preço Justo & Ética</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Relação direta com ateliês parceiros, valorizando a mão de obra local e mantendo preços equilibrados o ano todo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-mono font-bold text-[#5A5A40]">03. Sustentabilidade</span>
              <h3 className="font-serif text-lg font-bold text-stone-900">Embalagens Plástico Zero</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Nossos pedidos são despachados em caixas de papelão reciclado e fita gomada ecológica sem adesivos sintéticos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTATO */}
      {activeTab === "contato" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
          {/* Informações de Canais */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#C05B33] font-bold">
                Canais Oficiais
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                Estamos aqui para ajudar
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Nossa equipe de suporte está pronta para responder dúvidas sobre pedidos, trocas, tamanhos e especificações técnicas.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <Mail className="w-4 h-4 text-[#5A5A40]" />
                <div>
                  <span className="text-stone-400 font-mono block">E-mail Comercial & Suporte</span>
                  <span className="font-semibold text-stone-800">suporte@terius.com.br</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <Phone className="w-4 h-4 text-[#5A5A40]" />
                <div>
                  <span className="text-stone-400 font-mono block">WhatsApp Direto</span>
                  <a
                    href="https://wa.me/351963067989?text=Ol%C3%A1!%20Gostaria%20de%20atendimento%20pelo%20WhatsApp%20da%20Ter%C3%ADus%20on."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-stone-800 hover:text-emerald-700 hover:underline"
                  >
                    +351 963 067 989 (963067989)
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <Clock className="w-4 h-4 text-[#5A5A40]" />
                <div>
                  <span className="text-stone-400 font-mono block">Horário de Atendimento</span>
                  <span className="font-semibold text-stone-800">Segunda a Sexta, das 09h às 18h</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <MapPin className="w-4 h-4 text-[#5A5A40]" />
                <div>
                  <span className="text-stone-400 font-mono block">Centro de Distribuição</span>
                  <span className="font-semibold text-stone-800">São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário Interativo */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
              Envie uma Mensagem
            </h3>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Mensagem Enviada com Sucesso!</h4>
                <p className="text-xs text-emerald-700">
                  Recebemos seu contato e retornaremos em até 2 horas úteis no e-mail informado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Beatriz Silveira"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">E-mail para Contato</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="beatriz@exemplo.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assunto</label>
                  <select
                    value={formData.assunto}
                    onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option>Dúvida sobre Pedido em Andamento</option>
                    <option>Solicitação de Troca ou Devolução</option>
                    <option>Informações sobre Produtos & Tamanhos</option>
                    <option>Parcerias e Vendas Corporativas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mensagem</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#5A5A40] hover:bg-[#43432e] text-white font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. POLÍTICAS DA LOJA */}
      {activeTab === "politicas" && (
        <div className="space-y-8 animate-fade-in text-stone-700 text-xs sm:text-sm">
          {/* Reembolso */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-[#5A5A40]">
              <RefreshCw className="w-5 h-5 text-[#C05B33]" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Política de Troca & Reembolso (30 Dias)
              </h3>
            </div>
            <p className="leading-relaxed">
              Em consonância com o Código de Defesa do Consumidor e nosso compromisso de satisfação, oferecemos <strong>30 dias corridos</strong> a partir do recebimento para trocas ou devoluções de qualquer produto em perfeito estado.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
              <li>A primeira troca é totalmente gratuita (frete reverso por nossa conta).</li>
              <li>O reembolso de pagamentos efetuados via Pix ou Google Pay é estornado em até 24 horas úteis.</li>
              <li>Para pagamentos via Cartão de Crédito Visa/Mastercard, o estorno é processado de imediato na fatura.</li>
            </ul>
          </div>

          {/* Privacidade */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-[#5A5A40]">
              <ShieldCheck className="w-5 h-5 text-[#5A5A40]" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Política de Privacidade (Conforme LGPD)
              </h3>
            </div>
            <p className="leading-relaxed">
              Garantimos a total confidencialidade dos seus dados. As informações cadastrais e financeiras nunca são compartilhadas ou comercializadas com terceiros. Utilizamos criptografia TLS 1.3 de 256 bits em todas as transações.
            </p>
          </div>

          {/* Termos de Serviço */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-[#5A5A40]">
              <FileText className="w-5 h-5 text-stone-600" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Termos de Serviço & Entrega
              </h3>
            </div>
            <p className="leading-relaxed">
              Todos os pedidos são despachados acompanhados de Nota Fiscal Eletrônica (DANFE). O prazo de entrega começa a contar a partir da confirmação do pagamento pelo gateway. O cliente recebe o código de rastreamento automaticamente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionalPages;
