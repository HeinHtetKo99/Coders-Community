export const reputationRules = {
  question: {
    create: 5,
    upvote: 5,
    downvote: -2,
  },
  answer: {
    create: 10,
    upvote: 10,
    downvote: -2,
  },
} as const;
