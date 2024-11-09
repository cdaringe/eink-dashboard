import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  count?: number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  count = 1,
  className = "",
}) => {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius,
  };

  return (
    <div className={`skeleton-wrapper ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="skeleton-item"
          style={style}
        />
      ))}

      <style>
        {`
        .skeleton-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-item {
          background: #eee;
          background: linear-gradient(
            110deg,
            #ececec 8%,
            #f5f5f5 18%,
            #ececec 33%
          );
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }

        @keyframes shine {
          to {
            background-position-x: -200%;
          }
        }
      `}
      </style>
    </div>
  );
};

export default Skeleton;
