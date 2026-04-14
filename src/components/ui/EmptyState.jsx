/**
 * Empty state component for lists, tables, and pages
 */
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ padding: "60px 20px" }}>
      {Icon && (
        <Icon
          className="w-16 h-16 text-gray-300"
          style={{ marginBottom: "16px" }}
        />
      )}
      <h3 className="text-xl font-semibold text-gray-700" style={{ marginBottom: "8px" }}>
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 text-sm" style={{ marginBottom: "24px" }}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-black text-white text-sm font-semibold uppercase tracking-wide hover:bg-gray-800 transition"
          style={{ padding: "12px 24px" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
