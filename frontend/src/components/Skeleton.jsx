import React from 'react';

const skeletonStyle = {
  backgroundColor: '#e9ecef',
  borderRadius: '6px',
  animation: 'pulse 1.5s ease-in-out infinite',
};

export function Skeleton({ width, height, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        ...skeletonStyle,
        width: width || '100%',
        height: height || '1rem',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card h-100" style={{ overflow: 'hidden' }}>
      <Skeleton height="180px" style={{ borderRadius: 0 }} />
      <div className="card-body">
        <Skeleton width="80%" height="20px" style={{ marginBottom: '8px' }} />
        <Skeleton width="50%" height="16px" style={{ marginBottom: '8px' }} />
        <Skeleton width="40%" height="24px" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <Skeleton height="20px" />
        </td>
      ))}
    </tr>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="d-flex align-items-center gap-3 p-3 border-bottom">
      <Skeleton width="80px" height="80px" style={{ borderRadius: '8px', flexShrink: 0 }} />
      <div className="flex-grow-1">
        <Skeleton width="60%" height="18px" style={{ marginBottom: '8px' }} />
        <Skeleton width="40%" height="14px" />
      </div>
      <Skeleton width="80px" height="36px" style={{ borderRadius: '8px' }} />
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Skeleton width="120px" height="20px" />
          <Skeleton width="80px" height="24px" style={{ borderRadius: '20px' }} />
        </div>
        <Skeleton width="100%" height="14px" style={{ marginBottom: '8px' }} />
        <Skeleton width="70%" height="14px" style={{ marginBottom: '12px' }} />
        <Skeleton width="60px" height="18px" />
      </div>
    </div>
  );
}

export default Skeleton;
