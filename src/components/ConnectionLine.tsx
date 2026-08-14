type Props = { start: { x: number; y: number }; end: { x: number; y: number }; width: number; height: number };

export function ConnectionLine({ start, end, width, height }: Props) {
  const bendX = start.x + (end.x - start.x) * 0.48;
  return (
    <svg className="connection-layer" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline className="connection-shadow" points={`${start.x},${start.y} ${bendX},${start.y} ${end.x},${end.y}`} />
      <polyline className="connection-line" points={`${start.x},${start.y} ${bendX},${start.y} ${end.x},${end.y}`} />
      <rect className="anchor-dot" x={start.x - 3} y={start.y - 3} width="6" height="6" />
    </svg>
  );
}
