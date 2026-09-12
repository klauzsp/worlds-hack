export type FearProfile = {
  fearLabel: string;
  entity: string;
  setting: string;
  timeOfDay: string;
  weather: string;
  seedImagePrompt: string;
  worldPrompt: string;
  escalationPrompt: string;
  audioPrompt: string;
  notebookLines: [string, string, string];
};

export type AppState =
  | { kind: "gate" }
  | { kind: "interview" }
  | { kind: "inferring" }
  | { kind: "door" }
  | { kind: "world" }
  | { kind: "endscene" }
  | { kind: "return" }
  | { kind: "error"; message: string };

export type Session = {
  id: string;
  answers: string[];
  profile: FearProfile | null;
  createdAt: number;
};
