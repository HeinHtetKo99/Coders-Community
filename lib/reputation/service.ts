import mongoose from "mongoose";
import Answer from "@/database/Answer.model";
import Question from "@/database/Question.model";
import User from "@/database/User.model";
import { cacheTags, revalidateCacheTags } from "@/lib/cache";
import { reputationRules } from "./config";

type ReputationTotals = {
  contentCount: number;
  upvotes: number;
  downvotes: number;
};

type AuthorReputationTotals = ReputationTotals & {
  authorId: mongoose.Types.ObjectId | string;
};

type ReputationSyncOptions = {
  revalidateUsers?: boolean;
};

const normalizeUserId = (userId: string) =>
  mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : null;

const normalizeUserIds = (userIds: Array<string | null | undefined>) =>
  Array.from(
    new Set(
      userIds.filter(
        (userId): userId is string =>
          typeof userId === "string" && mongoose.Types.ObjectId.isValid(userId)
      )
    )
  );

const calculateContributionScore = (
  totals: ReputationTotals,
  rules: (typeof reputationRules)[keyof typeof reputationRules]
) =>
  totals.contentCount * rules.create +
  totals.upvotes * rules.upvote +
  totals.downvotes * rules.downvote;

const clampReputation = (score: number) => Math.max(0, score);

const aggregateTotalsByUsers = async (
  Model: typeof Question | typeof Answer,
  userIds: string[]
) => {
  const normalizedUserIds = userIds
    .map((userId) => normalizeUserId(userId))
    .filter((userId): userId is mongoose.Types.ObjectId => Boolean(userId));

  if (!normalizedUserIds.length) {
    return [] as AuthorReputationTotals[];
  }

  return Model.aggregate<AuthorReputationTotals>([
    {
      $match: {
        author: { $in: normalizedUserIds },
      },
    },
    {
      $group: {
        _id: "$author",
        contentCount: { $sum: 1 },
        upvotes: { $sum: "$upvotes" },
        downvotes: { $sum: "$downvotes" },
      },
    },
    {
      $project: {
        _id: 0,
        authorId: "$_id",
        contentCount: 1,
        upvotes: 1,
        downvotes: 1,
      },
    },
  ]);
};

const addContributionToMap = (
  reputationMap: Map<string, number>,
  authorId: string,
  score: number
) => {
  reputationMap.set(authorId, (reputationMap.get(authorId) ?? 0) + score);
};

const buildReputationMap = (
  questionTotals: AuthorReputationTotals[],
  answerTotals: AuthorReputationTotals[],
  userIds: string[]
) => {
  const reputationMap = new Map<string, number>();

  userIds.forEach((userId) => {
    reputationMap.set(userId, 0);
  });

  questionTotals.forEach((totals) => {
    addContributionToMap(
      reputationMap,
      String(totals.authorId),
      calculateContributionScore(totals, reputationRules.question)
    );
  });

  answerTotals.forEach((totals) => {
    addContributionToMap(
      reputationMap,
      String(totals.authorId),
      calculateContributionScore(totals, reputationRules.answer)
    );
  });

  userIds.forEach((userId) => {
    reputationMap.set(userId, clampReputation(reputationMap.get(userId) ?? 0));
  });

  return reputationMap;
};

export async function calculateUsersReputationMap(
  userIds: Array<string | null | undefined>
) {
  const normalizedUserIds = normalizeUserIds(userIds);

  if (!normalizedUserIds.length) {
    return new Map<string, number>();
  }

  const [questionTotals, answerTotals] = await Promise.all([
    aggregateTotalsByUsers(Question, normalizedUserIds),
    aggregateTotalsByUsers(Answer, normalizedUserIds),
  ]);

  return buildReputationMap(questionTotals, answerTotals, normalizedUserIds);
}

export async function calculateUserReputation(userId: string) {
  const reputationMap = await calculateUsersReputationMap([userId]);

  return reputationMap.get(userId) ?? 0;
}

export async function syncUserReputation(
  userId: string,
  options: ReputationSyncOptions = {}
) {
  const { revalidateUsers = true } = options;
  const normalizedUserId = normalizeUserId(userId);

  if (!normalizedUserId) {
    return null;
  }

  const reputation = await calculateUserReputation(userId);

  await User.findByIdAndUpdate(normalizedUserId, {
    reputation,
  });

  if (revalidateUsers) {
    revalidateCacheTags([cacheTags.users]);
  }

  return { userId: String(normalizedUserId), reputation };
}

export async function syncUsersReputation(
  userIds: Array<string | null | undefined>
) {
  const normalizedUserIds = normalizeUserIds(userIds);

  if (!normalizedUserIds.length) {
    return [];
  }

  const results = await Promise.all(
    normalizedUserIds.map((userId) =>
      syncUserReputation(userId, { revalidateUsers: false })
    )
  );

  revalidateCacheTags([cacheTags.users]);

  return results.filter(Boolean);
}

export async function rebuildAllUserReputations() {
  const [users, questionTotals, answerTotals] = await Promise.all([
    User.find().select("_id").lean(),
    Question.aggregate<AuthorReputationTotals>([
      {
        $group: {
          _id: "$author",
          contentCount: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
          downvotes: { $sum: "$downvotes" },
        },
      },
      {
        $project: {
          _id: 0,
          authorId: "$_id",
          contentCount: 1,
          upvotes: 1,
          downvotes: 1,
        },
      },
    ]),
    Answer.aggregate<AuthorReputationTotals>([
      {
        $group: {
          _id: "$author",
          contentCount: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
          downvotes: { $sum: "$downvotes" },
        },
      },
      {
        $project: {
          _id: 0,
          authorId: "$_id",
          contentCount: 1,
          upvotes: 1,
          downvotes: 1,
        },
      },
    ]),
  ]);

  if (!users.length) {
    return {
      totalUsers: 0,
      syncedUsers: 0,
    };
  }

  const reputationMap = buildReputationMap(
    questionTotals,
    answerTotals,
    users.map((user) => String(user._id))
  );

  await User.bulkWrite(
    users.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          reputation: clampReputation(reputationMap.get(String(user._id)) ?? 0),
        },
      },
    }))
  );

  revalidateCacheTags([cacheTags.users]);

  return {
    totalUsers: users.length,
    syncedUsers: users.length,
  };
}
