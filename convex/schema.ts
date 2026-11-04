import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    language: v.union(v.literal("en"), v.literal("ta")),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  businessProfiles: defineTable({
    userId: v.id("users"),
    businessName: v.string(),
    category: v.string(),
    industry: v.string(),
    location: v.string(),
    stage: v.string(),
    storeType: v.string(),
    products: v.array(v.string()),
    employeeCount: v.optional(v.number()),
    investmentBudget: v.optional(v.string()),
    registrations: v.array(v.string()),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  conversations: defineTable({
    userId: v.id("users"),
    profileId: v.id("businessProfiles"),
    title: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    structuredData: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_conversationId", ["conversationId"]),

  schemes: defineTable({
    name: v.string(),
    department: v.string(),
    category: v.string(),
    description: v.string(),
    financialBenefit: v.string(),
    eligibility: v.string(),
    locationScope: v.string(),
    status: v.string(),
    applicationUrl: v.string(),
    lastVerifiedDate: v.string(),
  }).index("by_category", ["category"]),

  savedItems: defineTable({
    userId: v.id("users"),
    itemType: v.union(v.literal("scheme"), v.literal("document"), v.literal("recommendation")),
    itemId: v.string(),
    title: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
