import { Component, createSignal } from "solid-js";
import "./LoadingIframe.css";
interface LoadingIframeProps {
  src: string;
  class?: string;
  label: string;
  id: string;
}

const LoadingIframe: Component<LoadingIframeProps> = ({
  label,
  src,
  class: className,
  id,
}) => {
  const [loading, setLoading] = createSignal(true);

  return (
    <>
      {loading() && (
        <div
          id={`${id}${loading() ? "" : "_loader"}`}
          class={[className, "lifr-loading-container"].join(" ")}
        >
          <span>{`Loading ${label}...`}</span>
          <div class="lifr-spinner"></div>
        </div>
      )}
      <iframe
        id={`${id}${loading() ? "_loading" : ""}`}
        class={className}
        src={src}
        style={{
          display: loading() ? "none" : "block",
        }}
        onLoad={() => setLoading(false)}
      ></iframe>
    </>
  );
};

export default LoadingIframe;
