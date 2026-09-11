import { PlusIcon } from "./PlusIcon";

export function CircleMarker({
  color,
  number,
  photoUrl,
  size = 34,
}: {
  color: string;
  number: number;
  photoUrl?: string | null;
  size?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {photoUrl ? (
        <>
          <img
            src={photoUrl}
            crossOrigin="anonymous"
            alt=""
            className="w-full h-full rounded-full object-cover"
            style={{ border: `2px solid ${color}` }}
          />
          <span
            className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full font-bold text-[10px]"
            style={{
              width: size * 0.45,
              height: size * 0.45,
              backgroundColor: color,
              color: "#0E2F21",
              border: "2px solid #0E2F21",
            }}
          >
            {number}
          </span>
        </>
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: color, color: "#0E2F21" }}
        >
          {number !== undefined ? (
            number
          ) : (
            <PlusIcon size={size * 0.5} color="#0E2F21" />
          )}
        </div>
      )}
    </div>
  );
}
