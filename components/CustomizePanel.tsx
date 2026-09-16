"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { DEFAULT_CUSTOMIZATION } from "@/lib/types";
import { PitchStyleSelect } from "./PitchStyleSelect";
import { MarkerStyleSelect } from "./MarkerStyleSelect";

function ColorRow({
  label,
  value,
  defaultValue,
  onChange,
}: {
  label: string;
  value: string;
  defaultValue: string;
  onChange: (v: string) => void;
}) {
  const isChanged = value !== defaultValue;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/70">{label}</span>
      <div className="flex items-center gap-2">
        {isChanged && (
          <button
            type="button"
            onClick={() => onChange(defaultValue)}
            aria-label={`Reset ${label}`}
            className="text-white/40 hover:text-white transition-colors"
          >
            ↺
          </button>
        )}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-md border border-white/10 bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
}

export function CustomizePanel() {
  const s = useLineupStore();

  return (
    <div className="flex flex-col gap-5 max-h-[90vh] overflow-y-auto pr-1">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs text-[#3CEFA1] font-semibold uppercase tracking-wide mb-2">
            Marker Style
          </p>
          <MarkerStyleSelect
            primaryColor={s.jerseyColor}
            secondaryColor={s.jerseySleeveColor}
          />
        </div>

        <div>
          <p className="text-xs text-[#3CEFA1] font-semibold uppercase tracking-wide mb-2">
            Pitch Shape
          </p>
          <PitchStyleSelect />
        </div>
      </div>

      <div>
        <p className="text-xs text-[#3CEFA1] font-semibold uppercase tracking-wide mb-2">
          Pitch
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">Pitch type</label>
            <select
              value={s.pitchPattern}
              onChange={(e) =>
                s.setCustomization({
                  pitchPattern: e.target.value as "solid" | "stripe" | "circle",
                })
              }
              className="bg-[#0A1A14] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
            >
              <option value="solid">Solid</option>
              <option value="stripe">Grass Striped</option>
              <option value="circle">Grass Bullseye</option>
            </select>
          </div>
          <ColorRow
            label="Pitch background"
            value={s.pitchBgColor}
            defaultValue={DEFAULT_CUSTOMIZATION.pitchBgColor}
            onChange={(v) => s.setCustomization({ pitchBgColor: v })}
          />
          <ColorRow
            label="Pitch stripe"
            value={s.pitchStripeColor}
            defaultValue={DEFAULT_CUSTOMIZATION.pitchStripeColor}
            onChange={(v) => s.setCustomization({ pitchStripeColor: v })}
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-[#3CEFA1] font-semibold uppercase tracking-wide mb-2">
          Kit
        </p>
        <div className="flex flex-col gap-3">
          <ColorRow
            label="Primary colour"
            value={s.jerseyColor}
            defaultValue={DEFAULT_CUSTOMIZATION.jerseyColor}
            onChange={(v) => s.setCustomization({ jerseyColor: v })}
          />
          <ColorRow
            label="Sleeve colour"
            value={s.jerseySleeveColor}
            defaultValue={DEFAULT_CUSTOMIZATION.jerseySleeveColor}
            onChange={(v) => s.setCustomization({ jerseySleeveColor: v })}
          />
          <ColorRow
            label="Collar colour"
            value={s.jerseyCollarColor}
            defaultValue={DEFAULT_CUSTOMIZATION.jerseyCollarColor}
            onChange={(v) => s.setCustomization({ jerseyCollarColor: v })}
          />
          <ColorRow
            label="Number colour"
            value={s.jerseyNumberColor}
            defaultValue={DEFAULT_CUSTOMIZATION.jerseyNumberColor}
            onChange={(v) => s.setCustomization({ jerseyNumberColor: v })}
          />
          <ColorRow
            label="Goalkeeper colour"
            value={s.gkJerseyColor}
            defaultValue={DEFAULT_CUSTOMIZATION.gkJerseyColor}
            onChange={(v) => s.setCustomization({ gkJerseyColor: v })}
          />
          <ColorRow
            label="Goalkeeper number colour"
            value={s.gkNumberColor}
            defaultValue={DEFAULT_CUSTOMIZATION.gkNumberColor}
            onChange={(v) => s.setCustomization({ gkNumberColor: v })}
          />
        </div>
      </div>
    </div>
  );
}
