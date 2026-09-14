import { create } from "zustand";

type DraftPlayer = {
  id: string; // client-generated, stable across saves
  name: string;
  jersey_number: number;
  position_group: string;
  photo_file: File | null; // pending upload, not yet saved
  photo_preview: string | null;
  photo_url: string | null; // already-saved URL, if any
  is_starting: boolean;
  slot_index: number | null;
};

export type LineupState = {
  teamId: string;
  lineupId: string;
  teamName: string;
  coachName: string;
  displayCoach: boolean;
  crestFile: File | null;
  crestUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  formationId: string;
  slots: { slot_index: number; x: number; y: number; label: string }[];
  markerStyle: "shield" | "jersey" | "circle";
  players: DraftPlayer[];
  formationName: string;
  pitchStyle: "flat" | "tilted";
  setPitchStyle: (style: "flat" | "tilted") => void;

  setTeamDetails: (
    fields: Partial<
      Pick<LineupState, "teamName" | "coachName" | "displayCoach" | "crestFile">
    >,
  ) => void;
  setFormation: (
    formationId: string,
    formationName: string,
    slots: LineupState["slots"],
  ) => void;
  setMarkerStyle: (style: LineupState["markerStyle"]) => void;
  addOrUpdatePlayer: (
    player: Omit<DraftPlayer, "id"> & { id?: string },
  ) => void;
  removePlayer: (id: string) => void;
  movePlayer: (
    playerId: string,
    toSlot: number | null,
    isStarting: boolean,
  ) => void;
  swapSlots: (fromSlot: number, toSlot: number) => void;
  placeBenchPlayerInSlot: (playerId: string, slotIndex: number) => void;
  hydrate: (data: {
    teamId: string;
    lineupId: string;
    teamName: string;
    coachName: string;
    displayCoach: boolean;
    crestUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    formationId: string;
    formationName: string;
    slots: LineupState["slots"];
    markerStyle: LineupState["markerStyle"];
    rawAssignments: {
      slot_index: number | null;
      is_starting: boolean;
      player: {
        id: string;
        name: string;
        jersey_number: number;
        photo_url: string | null;
        position_group: string;
      };
    }[];
  }) => void;
};

export const useLineupStore = create<LineupState>((set, get) => ({
  teamId: "",
  lineupId: "",
  teamName: "",
  coachName: "",
  displayCoach: false,
  crestFile: null,
  crestUrl: null,
  primaryColor: "#3CEFA1",
  secondaryColor: "#1D2A25",
  formationId: "",
  slots: [],
  markerStyle: "shield",
  players: [],
  formationName: "",
  pitchStyle: "flat",

  setTeamDetails: (fields) => set(fields),
  setFormation: (formationId, formationName, slots) =>
    set({ formationId, formationName, slots }),
  setMarkerStyle: (markerStyle) => set({ markerStyle }),
  setPitchStyle: (pitchStyle) => set({ pitchStyle }),

  addOrUpdatePlayer: (player) =>
    set((state) => {
      const id = player.id ?? crypto.randomUUID();
      const existingIndex = state.players.findIndex((p) => p.id === id);
      const previous = existingIndex >= 0 ? state.players[existingIndex] : null;
      const newPlayer: DraftPlayer = { ...player, id };

      let players = [...state.players];
      if (existingIndex >= 0) {
        players[existingIndex] = newPlayer;
      } else {
        players.push(newPlayer);
      }

      // detect a starter being benched, and try to promote a matching sub into the freed slot
      const wasStartingWithSlot =
        previous?.is_starting && previous.slot_index !== null;
      const nowBenched = !newPlayer.is_starting;

      if (wasStartingWithSlot && nowBenched) {
        const freedSlot = previous!.slot_index!;
        const freedLabel = state.slots.find(
          (s) => s.slot_index === freedSlot,
        )?.label;

        if (freedLabel) {
          const candidateIndex = players.findIndex(
            (p) =>
              p.id !== id && !p.is_starting && p.position_group === freedLabel,
          );
          if (candidateIndex >= 0) {
            players[candidateIndex] = {
              ...players[candidateIndex],
              is_starting: true,
              slot_index: freedSlot,
            };
          }
        }
      }

      return { players };
    }),

  removePlayer: (id) =>
    set((state) => ({ players: state.players.filter((p) => p.id !== id) })),

  movePlayer: (playerId, toSlot, isStarting) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId
          ? { ...p, slot_index: toSlot, is_starting: isStarting }
          : p,
      ),
    })),

  swapSlots: (fromSlot, toSlot) =>
    set((state) => ({
      players: state.players.map((p) => {
        if (p.slot_index === fromSlot) return { ...p, slot_index: toSlot };
        if (p.slot_index === toSlot) return { ...p, slot_index: fromSlot };
        return p;
      }),
    })),

  placeBenchPlayerInSlot: (playerId: string, slotIndex: number) =>
    set((state) => {
      const previousOccupant = state.players.find(
        (p) => p.is_starting && p.slot_index === slotIndex,
      );

      return {
        players: state.players.map((p) => {
          if (p.id === playerId) {
            return { ...p, is_starting: true, slot_index: slotIndex };
          }
          if (previousOccupant && p.id === previousOccupant.id) {
            return { ...p, is_starting: false, slot_index: null };
          }
          return p;
        }),
      };
    }),

  hydrate: (data: {
    teamId: string;
    lineupId: string;
    teamName: string;
    coachName: string;
    displayCoach: boolean;
    crestUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    formationId: string;
    formationName: string;
    slots: LineupState["slots"];
    markerStyle: LineupState["markerStyle"];
    rawAssignments: {
      slot_index: number | null;
      is_starting: boolean;
      player: {
        id: string;
        name: string;
        jersey_number: number;
        photo_url: string | null;
        position_group: string;
      };
    }[];
  }) =>
    set({
      teamId: data.teamId,
      lineupId: data.lineupId,
      teamName: data.teamName,
      coachName: data.coachName,
      displayCoach: data.displayCoach,
      crestUrl: data.crestUrl,
      crestFile: null,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      formationId: data.formationId,
      formationName: data.formationName,
      slots: data.slots,
      markerStyle: data.markerStyle,
      players: data.rawAssignments.map((a) => ({
        id: a.player.id,
        name: a.player.name,
        jersey_number: a.player.jersey_number,
        position_group: a.player.position_group,
        photo_file: null,
        photo_preview: null,
        photo_url: a.player.photo_url,
        is_starting: a.is_starting,
        slot_index: a.slot_index,
      })),
    }),
}));
