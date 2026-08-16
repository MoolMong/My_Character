type Props = { start: { x: number; y: number }; end: { x: number; y: number }; width?: number; height?: number };

export function ConnectionLine({ start, end, width = 100, height = 100 }: Props) {
  const bendX = start.x + (end.x - start.x) * 0.48;
  const portraitEdgeX = end.x <= 50 ? 0 : 100;
  const portraitPoints = `${start.x},${start.y} ${portraitEdgeX},${start.y} ${portraitEdgeX},100 50,100`;
  return (
    <svg className="connection-layer" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline className="connection-shadow connection-side" points={`${start.x},${start.y} ${bendX},${start.y} ${end.x},${end.y}`} />
      <polyline className="connection-line connection-side" points={`${start.x},${start.y} ${bendX},${start.y} ${end.x},${end.y}`} />
      <polyline className="connection-shadow connection-portrait" points={portraitPoints} />
      <polyline className="connection-line connection-portrait" points={portraitPoints} />
      <rect className="anchor-dot" x={start.x - 1} y={start.y - 1} width="2" height="2" />
    </svg>
  );
}
