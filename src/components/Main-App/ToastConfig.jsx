import { ToastContainer } from "react-toastify";

function ToastConfig() {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
      limit={3}
      newestOnTop={true}
      preventDuplicates={true}
      toastStyle={{
        backgroundColor: "#ffffff",
        color: "#000000",
        borderRadius: "8px",
        border: "2px solid #000000",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "14px",
        fontWeight: "500",
        padding: "12px 20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        minHeight: "60px",
      }}
      progressStyle={{
        background: "#000000",
      }}
      style={{
        bottom: "20px",
        left: "20px",
      }}
    />
  );
}

export default ToastConfig;
