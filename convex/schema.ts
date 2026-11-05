import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const profile = v.object({
  businessName: v.string(), category: v.string(), industry: v.string(), location: v.string(),
  stage: v.string(), storeType: v.string(), products: v.array(v.string()),
  employeeCount: v.optional(v.number()), investmentBudget: v.optional(v.string()), registrations: v.array(v.string()),
  goals: v.optional(v.array(v.string())),
});
const savedDocument = v.object({ id: v.string(), title: v.string(), type: v.string(), content: v.string(), updatedAt: v.number() });
const message = v.object({ role: v.union(v.literal("user"), v.literal("assistant")), content: v.string(), createdAt: v.number() });

export default defineSchema({
  workspaces: defineTable({
    // ownerId is optional only to preserve existing unauthenticated records during rollout.
    // Every new account-owned workspace is written with an authenticated ownerId.
    ownerId: v.optional(v.string()),
    workspaceId: v.string(),
    profile: v.optional(profile),
    documents: v.array(savedDocument),
    messages: v.array(message),
    updatedAt: v.number(),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_ownerId", ["ownerId"]),

  // Temporary legacy table retained for the pre-auth migration.
  demoWorkspaces: defineTable({
    workspaceId: v.string(),
    profile: v.optional(profile),
    documents: v.array(savedDocument),
    messages: v.array(message),
    updatedAt: v.number(),
  }).index("by_workspaceId", ["workspaceId"]),
});
