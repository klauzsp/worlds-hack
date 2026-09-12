export const QUESTIONS: readonly string[] = [
  "Before we begin. When you were a child — what was the thing in the dark you were most certain was there?",
  "You're walking home later than you meant to be, and you become certain someone is behind you. What do you do?",
  "Imagine you can't leave a room until morning. Describe the room you'd least like it to be.",
  "What's the last thing you'd want to see when you turn the light on?",
];

export const ACKNOWLEDGEMENTS: readonly string[] = [
  "Mm.",
  "Interesting.",
  "Take your time.",
];

export const MAX_ANSWER_LENGTH = 500;

export const LINES = {
  understand: "I think I understand.",
  direction: "When you're ready — through the door.",
  closing: "Now we both know what's in there with you.",
} as const;
