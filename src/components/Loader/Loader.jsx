function Loader({ size = "md", text = "Loading...", fullScreen = false }) {
  const dotSizes = {
    sm: "8px",
    md: "12px",
    lg: "16px",
  };

  const container = (
    <div style={{ textAlign: "center" }}>
      {/* Modern bouncing dots */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="bg-black rounded-full animate-pulse"
          style={{
            width: dotSizes[size],
            height: dotSizes[size],
            animationDuration: "0.6s",
          }}
        ></div>

        <div
          className="bg-black rounded-full animate-pulse"
          style={{
            width: dotSizes[size],
            height: dotSizes[size],
            animationDelay: "0.15s",
            animationDuration: "0.6s",
          }}
        ></div>

        <div
          className="bg-black rounded-full animate-pulse"
          style={{
            width: dotSizes[size],
            height: dotSizes[size],
            animationDelay: "0.3s",
            animationDuration: "0.6s",
          }}
        ></div>
      </div>

      {/* Text */}
      {text && (
        <p
          className="text-gray-600"
          style={{ marginTop: "16px", fontSize: "14px" }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-white"
        style={{ padding: 0, margin: 0 }}
      >
        {container}
      </div>
    );
  }

  return container;
}

export default Loader;
