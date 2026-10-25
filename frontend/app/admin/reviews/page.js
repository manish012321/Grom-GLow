// frontend/app/admin/reviews/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Star, Check, EyeOff, Trash2, ShieldCheck } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.getReviewsAdmin();
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateReviewStatus(id, status);
      await fetchReviews();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      await api.deleteReview(id);
      await fetchReviews();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-light text-[#181715]">
          Client Reviews Moderation
        </h2>
        <p className="text-xs text-[#736E67] font-light">
          Approve, hide, or moderate patron impressions before they appear on the public website.
        </p>
      </div>

      <div className="bg-white border border-[#ECE7DE] rounded-xs shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-[#8C8780]">
            Loading Reviews...
          </div>
        ) : reviews.length > 0 ? (
          <div className="divide-y divide-[#ECE7DE]">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-[#FDFBF7] transition-colors">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-[#C5A880]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-[#181715]">
                      {rev.customer_name}
                    </span>
                    <span className="text-[10px] uppercase text-[#8C8780]">
                      • {rev.service_name || 'General Service'}
                    </span>
                  </div>

                  <p className="text-xs text-[#4A4744] italic leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="text-[10px] text-[#A6A19A]">
                    Submitted {formatDate(rev.created_at?.split('T')[0] || rev.created_at)}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                    rev.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    rev.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {rev.status}
                  </span>

                  {rev.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                      title="Approve to Publish"
                      className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xs transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  {rev.status === 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'HIDDEN')}
                      title="Hide from Public Site"
                      className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xs transition-colors"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    title="Delete permanently"
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-xs text-[#8C8780]">
            No reviews on record.
          </div>
        )}
      </div>
    </div>
  );
}
