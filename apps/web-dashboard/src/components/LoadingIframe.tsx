import React from "react";
import "./LoadingIframe.css";
interface LoadingIframeProps {
  src: string;
  class?: string;
  label: string;
  id: string;
  onLoad?: () => void;
}

const LoadingIframe: React.FC<LoadingIframeProps> = ({
  label,
  src,
  class: className,
  id,
  onLoad,
}) => {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (!loading) {
      onLoad?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <>
      {loading && (
        <div
          id={`${id}${loading ? "" : "_loader"}`}
          className={[className, "lifr-loading-container"].join(" ")}
        >
          <span>{`Loading ${label}...`}</span>
          <div className="lifr-spinner"></div>
        </div>
      )}
      <iframe
        id={`${id}${loading ? "_loading" : ""}`}
        className={className}
        src={src}
        style={{
          display: loading ? "none" : "block",
        }}
        onLoad={() => {
          setLoading(false);
        }}
      >
      </iframe>
    </>
  );
};

export default LoadingIframe;
