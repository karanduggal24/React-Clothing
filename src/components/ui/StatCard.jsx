/**
 * Stat card for dashboards
 */
function StatCard({ title, value, icon: Icon, bgColor, textColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow ${onClick ? "cursor-pointer" : ""}`}
      style={{ padding: "24px" }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium" style={{ marginBottom: "4px" }}>
        {title}
      </h3>
      <p className="text-3xl font-bold text-black">{value}</p>
    </div>
  );
}

export default StatCard;
