import { z } from "zod";

export const fearProfileSchema = z.object({
  fearLabel: z.string().min(1),
  entity: z.string().min(1),
  setting: z.string().min(1),
  timeOfDay: z.string().min(1),
  weather: z.string().min(1),
  seedImagePrompt: z.string().min(1),
  worldPrompt: z.string().min(1).max(1900),
  escalationPrompt: z.string().min(1).max(1900),
  audioPrompt: z.string().min(1),
  notebookLines: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
});

export const profileRequestSchema = z.object({
  answers: z.tuple([
    z.string().min(1).max(500),
    z.string().min(1).max(500),
    z.string().min(1).max(500),
    z.string().min(1).max(500),
  ]),
});
