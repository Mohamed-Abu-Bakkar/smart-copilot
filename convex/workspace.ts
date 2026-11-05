import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const profile = v.object({
  businessName: v.string(), category: v.string(), industry: v.string(), location: v.string(),
  stage: v.string(), storeType: v.string(), products: v.array(v.string()),
  employeeCount: v.optional(v.number()), investmentBudget: v.optional(v.string()), registrations: v.array(v.string()),
  goals: v.optional(v.array(v.string())),
});
const savedDocument = v.object({ id: v.string(), title: v.string(), type: v.string(), content: v.string(), updatedAt: v.number() });
const message = v.object({ role: v.union(v.literal("user"), v.literal("assistant")), content: v.string(), createdAt: v.number() });

export const get = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db.query("demoWorkspaces").withIndex("by_workspaceId", q => q.eq("workspaceId", workspaceId)).unique();
  },
});

export const saveProfile = mutation({
  args: { workspaceId: v.string(), profile },
  handler: async (ctx, { workspaceId, profile }) => {
    const existing = await ctx.db.query("demoWorkspaces").withIndex("by_workspaceId", q => q.eq("workspaceId", workspaceId)).unique();
    if (existing) await ctx.db.patch(existing._id, { profile, updatedAt: Date.now() });
    else await ctx.db.insert("demoWorkspaces", { workspaceId, profile, documents: [], messages: [], updatedAt: Date.now() });
  },
});

export const saveDocument = mutation({
  args: { workspaceId: v.string(), document: savedDocument },
  handler: async (ctx, { workspaceId, document }) => {
    const existing = await ctx.db.query("demoWorkspaces").withIndex("by_workspaceId", q => q.eq("workspaceId", workspaceId)).unique();
    if (existing) await ctx.db.patch(existing._id, { documents: [document, ...existing.documents.filter(d => d.id !== document.id)], updatedAt: Date.now() });
    else await ctx.db.insert("demoWorkspaces", { workspaceId, documents: [document], messages: [], updatedAt: Date.now() });
  },
});

export const deleteDocument = mutation({
  args: { workspaceId: v.string(), documentId: v.string() },
  handler: async (ctx, { workspaceId, documentId }) => {
    const existing = await ctx.db.query("demoWorkspaces").withIndex("by_workspaceId", q => q.eq("workspaceId", workspaceId)).unique();
    if (existing) await ctx.db.patch(existing._id, { documents: existing.documents.filter(d => d.id !== documentId), updatedAt: Date.now() });
  },
});

export const saveMessages = mutation({
  args: { workspaceId: v.string(), messages: v.array(message) },
  handler: async (ctx, { workspaceId, messages }) => {
    const existing = await ctx.db.query("demoWorkspaces").withIndex("by_workspaceId", q => q.eq("workspaceId", workspaceId)).unique();
    const next = [...(existing?.messages ?? []), ...messages].slice(-100);
    if (existing) await ctx.db.patch(existing._id, { messages: next, updatedAt: Date.now() });
    else await ctx.db.insert("demoWorkspaces", { workspaceId, documents: [], messages: next, updatedAt: Date.now() });
  },
});

export const reset = mutation({
  args: { workspaceId: v.string() },
  handler: async (ctx, { workspaceId }) => {
    const existing = await ctx.db.query("demoWorkspaces").withIndex("by_workspaceId", q => q.eq("workspaceId", workspaceId)).unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});
