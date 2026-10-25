// frontend/components/admin/StatCard.jsx

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'champagne' }) {
  const colorMap = {
    champagne: 'text-[#C5A880] bg-[#FDFBF7] border-[#ECE7DE]',
    emerald: 'text-emerald-700 bg-emerald-50/50 border-emerald-100',
    blue: 'text-sky-700 bg-sky-50/50 border-sky-100',
    charcoal: 'text-[#181715] bg-[#F7F4EE] border-[#ECE7DE]'
  };

  return (
    <div className="bg-white border border-[#ECE7DE] rounded-xs p-5 shadow-xs flex items-start justify-between">
      <div>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8780] block">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-bold font-editorial text-[#181715] mt-1">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-[#736E67] mt-1 font-light">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`w-10 h-10 rounded-xs border flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.champagne}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
