import React, { useState } from "react";
import { Star, CheckCircle, ThumbsUp, MessageSquare, Plus, Filter, ShieldCheck, Heart } from "lucide-react";
import { CustomerReview, Product } from "../../types/store";

interface CustomerReviewsSectionProps {
  reviews: CustomerReview[];
  products: Product[];
  onAddReview: (review: Omit<CustomerReview, "id" | "date" | "helpfulCount" | "userLiked">) => void;
  onVoteHelpful: (reviewId: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  products,
  onAddReview,
  onVoteHelpful,
  onSelectProduct
}) => {
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newProductId, setNewProductId] = useState<string>(products[0]?.id || "");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Calculations
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      totalReviews > 0
        ? Math.round((reviews.filter((r) => r.rating === star).length / totalReviews) * 100)
        : 0
  }));

  const filteredReviews = reviews.filter((review) => {
    if (selectedStarFilter === "all") return true;
    return review.rating === selectedStarFilter;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const matchedProduct = products.find((p) => p.id === newProductId);
    const productName = matchedProduct ? matchedProduct.name : "Compra na Teríus on";

    onAddReview({
      authorName: newAuthor.trim(),
      location: newLocation.trim() || "Brasil",
      rating: newRating,
      verifiedPurchase: true,
      productName,
      productId: newProductId,
      title: newTitle.trim() || "Experiência excelente",
      comment: newComment.trim()
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsModalOpen(false);
      setNewAuthor("");
      setNewLocation("");
      setNewTitle("");
      setNewComment("");
      setNewRating(5);
    }, 1200);
  };

  return (
    <section id="avaliacoes-clientes" className="py-16 md:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-mono text-[#5A5A40] shadow-2xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C05B33]" />
              <span className="font-semibold">Transparência & Qualidade Comprovada</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Avaliação dos Clientes
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Depoimentos reais de quem experimentou nosso padrão de acabamento, rapidez de entrega e atendimento.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-[#5A5A40] hover:bg-[#43432e] text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Escrever Avaliação</span>
          </button>
        </div>

        {/* Rating Overview Score & Star Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10 items-center bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs">
          {/* Main Score Block */}
          <div className="lg:col-span-4 text-center lg:text-left lg:border-r lg:border-stone-200 lg:pr-8">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-5xl sm:text-6xl font-serif font-bold text-stone-900">{averageRating}</span>
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs font-medium text-stone-500 mt-1">
                  Média geral baseada em {totalReviews} avaliações
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-center lg:justify-start gap-2 text-xs text-stone-600">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>98%</strong> dos clientes recomendam nossos produtos e entrega</span>
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div className="lg:col-span-8 space-y-2.5">
            {starCounts.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setSelectedStarFilter(selectedStarFilter === star ? "all" : star)}
                  className={`w-16 flex items-center gap-1 font-medium hover:text-[#C05B33] transition-colors cursor-pointer ${
                    selectedStarFilter === star ? "text-[#C05B33] font-bold" : "text-stone-700"
                  }`}
                >
                  <span>{star} estrelas</span>
                </button>
                <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200/60">
                  <div
                    className="h-full bg-[#5A5A40] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-stone-500 font-mono text-[11px]">{count} ({percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase font-mono">Filtrar:</span>
          </div>

          <button
            onClick={() => setSelectedStarFilter("all")}
            className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              selectedStarFilter === "all"
                ? "bg-[#5A5A40] text-white shadow-2xs"
                : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            Todas ({totalReviews})
          </button>

          {[5, 4, 3].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            return (
              <button
                key={star}
                onClick={() => setSelectedStarFilter(selectedStarFilter === star ? "all" : star)}
                className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  selectedStarFilter === star
                    ? "bg-[#5A5A40] text-white shadow-2xs"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span>{star} Estrelas</span>
                <span className="text-[10px] opacity-80 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs flex flex-col justify-between hover:border-stone-300 transition-all hover:shadow-xs group"
            >
              <div>
                {/* Header: Rating & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= review.rating ? "fill-amber-500 text-amber-500" : "text-stone-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400 font-mono">{review.date}</span>
                </div>

                {/* Title & Review Content */}
                <h4 className="font-serif font-bold text-stone-900 text-base mb-2 leading-snug">
                  "{review.title}"
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {review.comment}
                </p>

                {/* Product Tag */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 rounded-md text-[11px] text-stone-700 font-medium border border-stone-200">
                    <span className="text-[#C05B33] font-bold">Item:</span>
                    <span className="truncate max-w-[200px]">{review.productName}</span>
                  </span>
                </div>
              </div>

              {/* Author & Helpful Action Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#5A5A40]/15 text-[#5A5A40] flex items-center justify-center text-xs font-bold font-mono">
                      {review.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-stone-900">{review.authorName}</span>
                      {review.verifiedPurchase && (
                        <CheckCircle
                          className="w-3.5 h-3.5 text-emerald-600"
                          title="Compra Verificada"
                        />
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 block">{review.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => onVoteHelpful(review.id)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    review.userLiked
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-medium"
                      : "text-stone-500 border-stone-200 hover:bg-stone-50 hover:text-stone-800"
                  }`}
                  title="Marcar como avaliação útil"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${review.userLiked ? "fill-emerald-600 text-emerald-600" : ""}`} />
                  <span>{review.helpfulCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para Deixar Avaliação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C05B33]" />
                <h3 className="text-xl font-serif font-bold text-stone-900">Deixar Avaliação</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-serif font-bold text-stone-900">Avaliação Enviada!</h4>
                <p className="text-sm text-stone-600 max-w-xs mx-auto">
                  Obrigado pelo seu feedback. Ele já está visível para toda a comunidade Teríus on.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
                {/* Rating Stars Input */}
                <div>
                  <label className="block text-xs font-mono uppercase font-semibold text-stone-700 mb-1.5">
                    Sua Nota Geral:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="cursor-pointer transition-transform hover:scale-110 p-1"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating ?? newRating)
                              ? "fill-amber-500 text-amber-500"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-semibold text-stone-700 ml-2">
                      {hoverRating ?? newRating} de 5 estrelas
                    </span>
                  </div>
                </div>

                {/* Product Select */}
                <div>
                  <label className="block text-xs font-mono uppercase font-semibold text-stone-700 mb-1">
                    Produto Avaliado:
                  </label>
                  <select
                    value={newProductId}
                    onChange={(e) => setNewProductId(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (R$ {p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase font-semibold text-stone-700 mb-1">
                      Seu Nome:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mariana Silva"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase font-semibold text-stone-700 mb-1">
                      Cidade / Estado:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo, SP"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                    />
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-xs font-mono uppercase font-semibold text-stone-700 mb-1">
                    Título da Avaliação:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tecido e caimento incomparáveis"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-mono uppercase font-semibold text-stone-700 mb-1">
                    Seu Comentário Detalhado:
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Conte o que achou do material, acabamento, entrega e atendimento..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#43432e] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer active:scale-98"
                  >
                    Publicar Avaliação
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default CustomerReviewsSection;
