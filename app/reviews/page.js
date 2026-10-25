// frontend/app/reviews/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Star, MessageSquarePlus, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 5.0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  // Review modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [serviceName, setServiceName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.getReviews();
      setReviews(res.data?.reviews || []);
      setSummary(res.data?.summary || { averageRating: 5.0, totalReviews: 0 });
    } catch (err) {
      console.error('Reviews load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !comment.trim()) {
      setErrorMsg('Please enter your name and a brief review.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitReview({
        customer_name: name,
        rating,
        service_name: serviceName,
        comment
      });

      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          setName('');
          setComment('');
          setServiceName('');
          fetchReviews();
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
          Patron Testimonials
        </span>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-[#181715] mt-2">
          Client Impressions
        </h1>
        <p className="text-sm text-[#736E67] mt-3 font-light leading-relaxed">
          Unfiltered feedback from guests who have experienced our bespoke hair design, clinical facials, and grooming rituals.
        </p>
      </div>

      {/* Rating Overview Card */}
      <div className="max-w-3xl mx-auto bg-white border border-[#ECE7DE] rounded-xs p-8 shadow-xs mb-14 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-center sm:text-left">
          <div className="font-editorial text-6xl font-light text-[#181715]">
            {summary.averageRating}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-[#C5A880] mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs uppercase tracking-wider text-[#736E67]">
              Based on {summary.totalReviews} verified client reviews
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="luxury-button-primary text-xs shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#8C8780]">
          Loading Reviews...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 bg-white border border-[#ECE7DE] rounded-xs shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C5A880]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  {rev.created_at && (
                    <span className="text-[10px] text-[#A6A19A]">
                      {formatDate(rev.created_at.split('T')[0] || rev.created_at)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#4A4744] font-light italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#ECE7DE] flex items-center justify-between">
                <div>
                  <h4 className="font-editorial text-lg text-[#181715] font-normal">
                    {rev.customer_name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-wider text-[#A6A19A] mt-0.5">
                    {rev.service_name || 'Groom & Glow Treatment'}
                  </p>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-semibold border border-[#C5A880]/40 px-2 py-0.5 rounded-full">
                  Verified Visit
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMIT REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#ECE7DE] rounded-xs max-w-lg w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#8C8780] hover:text-[#181715]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Share Your Thoughts
            </span>
            <h3 className="font-editorial text-3xl font-light text-[#181715] mt-1 mb-6">
              Write a Review
            </h3>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#C5A880] mx-auto" />
                <h4 className="font-editorial text-2xl text-[#181715]">
                  Thank You for Your Feedback
                </h4>
                <p className="text-xs text-[#736E67]">
                  Your review has been successfully submitted to Groom & Glow.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-2">
                    Rating Score
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-[#C5A880] focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-gray-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs text-[#736E67] ml-2 font-medium">
                      {rating} of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Nair"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Service Experienced (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Balayage, HydraGlow Facial, Beard Sculpt"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Your Feedback *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your styling experience, ambience, or specialist care..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715] resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="luxury-button-primary w-full py-3.5 text-xs tracking-widest"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
