import { create } from "zustand";

type DraftSquadPlayer = {
  id: string;
  name: string;
  jersey_number: number;
  position_group: string;
  photo_file: File | null;
  photo_preview: string | null;
  photo_url: string | null;
};

export type CompetitionSquadState = {
  competitionId: string;
  competitionTeamId: string;
  players: DraftSquadPlayer[];
  addOrUpdatePlayer: (
    player: Omit<DraftSquadPlayer, "id"> & { id?: string },
  ) => void;
  removePlayer: (id: string) => void;
  hydrate: (data: {
    competitionId: string;
    competitionTeamId: string;
    players: Omit<DraftSquadPlayer, "photo_file" | "photo_preview">[];
  }) => void;
};

export const useCompetitionSquadStore = create<CompetitionSquadState>(
  (set) => ({
    competitionId: "",
    competitionTeamId: "",
    players: [],

    addOrUpdatePlayer: (player) =>
      set((state) => {
        const id = player.id ?? crypto.randomUUID();
        const existingIndex = state.players.findIndex((p) => p.id === id);
        const newPlayer: DraftSquadPlayer = { ...player, id };
        if (existingIndex >= 0) {
          const players = [...state.players];
          players[existingIndex] = newPlayer;
          return { players };
        }
        return { players: [...state.players, newPlayer] };
      }),

    removePlayer: (id) =>
      set((state) => ({ players: state.players.filter((p) => p.id !== id) })),

    hydrate: (data) =>
      set({
        competitionId: data.competitionId,
        competitionTeamId: data.competitionTeamId,
        players: data.players.map((p) => ({
          ...p,
          photo_file: null,
          photo_preview: null,
        })),
      }),
  }),
);
