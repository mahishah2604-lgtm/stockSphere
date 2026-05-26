export default function Skeleton({ height = 120 }: { height?: number }) {
  return <div className="skeleton" style={{ minHeight: height }} />
}
