import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

const profile = v.object({
  businessName: v.string(), category: v.string(), industry: v.string(), location: v.string(),
  stage: v.string(), storeType: v.string(), products: v.array(v.string()),
  employeeCount: v.optional(v.number()), investmentBudget: v.optional(v.string()), registrations: v.array(v.string()),
  goals: v.optional(v.array(v.string())),
});
const savedDocument = v.object({ id: v.string(), title: v.string(), type: v.string(), content: v.string(), updatedAt: v.number() });
const message = v.object({ role: v.union(v.literal("user"), v.literal("assistant")), content: v.string(), createdAt: v.number() });

async function requireOwner(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("You must be signed in to access your business workspace.");
  return identity.subject;
}

async function getOwnedWorkspace(ctx: QueryCtx | MutationCtx, ownerId: string) {
  return await ctx.db.query("workspaces").withIndex("by_ownerId", q => q.eq("ownerId", ownerId)).unique();
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const ownerId = await requireOwner(ctx);
    return await getOwnedWorkspace(ctx, ownerId);
  },
});

export const saveProfile = mutation({
  args: { profile },
  handler: async (ctx, { profile }) => {
    const ownerId = await requireOwner(ctx);
    const existing = await getOwnedWorkspace(ctx, ownerId);
    if (existing) {
      await ctx.db.patch(existing._id, { profile, updatedAt: Date.now() });
      return { id: existing._id, workspaceId: ownerId, action: "updated" as const };
    }
    const id = await ctx.db.insert("workspaces", { ownerId, workspaceId: ownerId, profile, documents: [], messages: [], updatedAt: Date.now() });
    return { id, workspaceId: ownerId, action: "inserted" as const };
  },
});

export const saveDocument = mutation({
  args: { document: savedDocument },
  handler: async (ctx, { document }) => {
    const ownerId = await requireOwner(ctx);
    const existing = await getOwnedWorkspace(ctx, ownerId);
    if (existing) await ctx.db.patch(existing._id, { documents: [document, ...existing.documents.filter(d => d.id !== document.id)], updatedAt: Date.now() });
    else await ctx.db.insert("workspaces", { ownerId, workspaceId: ownerId, documents: [document], messages: [], updatedAt: Date.now() });
  },
});

export const deleteDocument = mutation({
  args: { documentId: v.string() },
  handler: async (ctx, { documentId }) => {
    const ownerId = await requireOwner(ctx);
    const existing = await getOwnedWorkspace(ctx, ownerId);
    if (existing) await ctx.db.patch(existing._id, { documents: existing.documents.filter(d => d.id !== documentId), updatedAt: Date.now() });
  },
});

export const saveMessages = mutation({
  args: { messages: v.array(message) },
  handler: async (ctx, { messages }) => {
    const ownerId = await requireOwner(ctx);
    const existing = await getOwnedWorkspace(ctx, ownerId);
    const next = [...(existing?.messages ?? []), ...messages].slice(-100);
    if (existing) await ctx.db.patch(existing._id, { messages: next, updatedAt: Date.now() });
    else await ctx.db.insert("workspaces", { ownerId, workspaceId: ownerId, documents: [], messages: next, updatedAt: Date.now() });
  },
});

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const ownerId = await requireOwner(ctx);
    const existing = await getOwnedWorkspace(ctx, ownerId);
    if (existing) await ctx.db.delete(existing._id);
  },
});

/**
 * One-time migration of the pre-auth demoWorkspaces table.
 * Rows remain unowned and are deliberately not assigned to an account automatically.
 * Never expose browser-generated workspace IDs as proof of ownership.
 */
export const migrateLegacyWorkspaces = mutation({
  args: {},
  handler: async (ctx) => {
    const legacyRows = await ctx.db.query("demoWorkspaces").collect();
    let migrated = 0;
    for (const legacy of legacyRows) {
      const current = await ctx.db.query("workspaces").withIndex("by_workspaceId", q => q.eq("workspaceId", legacy.workspaceId)).unique();
      if (!current) {
        await ctx.db.insert("workspaces", {
          workspaceId: legacy.workspaceId,
          ...(legacy.profile ? { profile: legacy.profile } : {}),
          documents: legacy.documents,
          messages: legacy.messages,
          updatedAt: legacy.updatedAt,
        });
        migrated += 1;
      }
      await ctx.db.delete(legacy._id);
    }
    return { migrated, legacyRowsRemoved: legacyRows.length };
  },
});
