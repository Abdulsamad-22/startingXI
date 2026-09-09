export function CircleMarker({
  color,
  number,
  size = 40,
}: {
  color: string;
  number: number;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-sm"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        color: "#0E2F21",
      }}
    >
      {number}
    </div>
  );
}
