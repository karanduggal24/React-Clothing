/**
 * Consistent page header with title, subtitle, and optional action
 */
function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: "32px" }}>
      <div>
        <h1 className="text-3xl font-bold text-black">{title}</h1>
        {subtitle && (
          <p className="text-gray-600" style={{ marginTop: "8px" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default PageHeader;
