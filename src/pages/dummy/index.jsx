import React from "react";
import AntiCopyPattern from "./AntiCopy";

const DocumentPattern = () => {
  return (
    <div style={styles.container}>
      {/* Anti-copy pattern as background */}
      <div style={styles.patternWrapper}>
        <AntiCopyPattern />
      </div>

      {/* Content with anti-copy protection */}
      <div style={styles.content}>
        <h1>Confidential Document</h1>
        <p>
          This is a protected document. Copying or extracting text from this
          section is discouraged using an anti-copy pattern overlay.
        </p>
      </div>

      {/* Transparent overlay to make copying difficult */}
      <div style={styles.overlay}></div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: "80%",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight opacity trick
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  patternWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1, // Places it above the container background but below the content
  },
  content: {
    position: "relative",
    zIndex: 3, // Keeps text above everything
    color: "#333",
    fontSize: "16px",
    userSelect: "none", // Prevents text selection
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.4)", // Transparent layer to interfere with copying
    pointerEvents: "none",
    zIndex: 2, // Above pattern but below text
  },
};

export default DocumentPattern;