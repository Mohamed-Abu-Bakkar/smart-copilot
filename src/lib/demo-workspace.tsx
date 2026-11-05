"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ConvexProvider, useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { convexClient } from "@/lib/convex";

export type BusinessProfile = {
  businessName: string; category: string; industry: string; location: string;
  stage: string; storeType: string; products: string[]; employeeCount?: number;
  investmentBudget?: string; registrations: string[];
};
export type SavedDocument = { id: string; title: string; type: string; content: string; updatedAt: number };
export type AdvisorMessage = { role: "user" | "assistant"; content: string; createdAt?: number };
type Workspace = {
  profile: BusinessProfile | null; documents: SavedDocument[]; messages: AdvisorMessage[]; ready: boolean;
  setProfile: (profile: BusinessProfile) => Promise<void>;
  saveDocument: (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => Promise<SavedDocument>;
  deleteDocument: (id: string) => Promise<void>;
  saveMessages: (messages: AdvisorMessage[]) => Promise<void>;
  resetWorkspace: () => Promise<void>;
};
const WorkspaceContext = createContext<Workspace | null>(null);
const STORAGE_KEY = "smart-copilot-demo-workspace-v1";
const ID_KEY = "smart-copilot-demo-workspace-id";

function WorkspaceDataProvider({ children }: { children: React.ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let id = window.localStorage.getItem(ID_KEY);
    if (!id) { id = crypto.randomUUID(); window.localStorage.setItem(ID_KEY, id); }
    setWorkspaceId(id);
    setReady(true);
  }, []);
  const data = useQuery(anyApi.workspace.get, ready ? { workspaceId } : "skip") as { profile?: BusinessProfile; documents?: SavedDocument[]; messages?: AdvisorMessage[] } | null | undefined;
  const saveProfileMutation = useMutation(anyApi.workspace.saveProfile);
  const saveDocumentMutation = useMutation(anyApi.workspace.saveDocument);
  const deleteDocumentMutation = useMutation(anyApi.workspace.deleteDocument);
  const saveMessagesMutation = useMutation(anyApi.workspace.saveMessages);
  const resetMutation = useMutation(anyApi.workspace.reset);
  const profile = data?.profile ?? null;
  const documents = data?.documents ?? [];
  const messages = data?.messages ?? [];
  const setProfile = useCallback(async (next: BusinessProfile) => { if (!workspaceId) return; await saveProfileMutation({ workspaceId, profile: next }); }, [workspaceId, saveProfileMutation]);
  const saveDocument = useCallback(async (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => {
    const saved: SavedDocument = { ...doc, id: doc.id ?? crypto.randomUUID(), updatedAt: Date.now() };
    if (!workspaceId) throw new Error("Workspace is still initializing");
    await saveDocumentMutation({ workspaceId, document: saved }); return saved;
  }, [workspaceId, saveDocumentMutation]);
  const deleteDocument = useCallback(async (id: string) => { if (workspaceId) await deleteDocumentMutation({ workspaceId, documentId: id }); }, [workspaceId, deleteDocumentMutation]);
  const saveMessages = useCallback(async (next: AdvisorMessage[]) => { if (workspaceId && next.length) await saveMessagesMutation({ workspaceId, messages: next.map(m => ({ role: m.role, content: m.content, createdAt: m.createdAt ?? Date.now() })) }); }, [workspaceId, saveMessagesMutation]);
  const resetWorkspace = useCallback(async () => { if (workspaceId) await resetMutation({ workspaceId }); }, [workspaceId, resetMutation]);
  const value = useMemo(() => ({ profile, documents, messages, ready: ready && data !== undefined, setProfile, saveDocument, deleteDocument, saveMessages, resetWorkspace }), [profile, documents, messages, ready, data, setProfile, saveDocument, deleteDocument, saveMessages, resetWorkspace]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function DemoWorkspaceProvider({ children }: { children: React.ReactNode }) {
  if (!convexClient) return <div>{children}</div>;
  return <ConvexProvider client={convexClient}><WorkspaceDataProvider>{children}</WorkspaceDataProvider></ConvexProvider>;
}
export function useDemoWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("Workspace provider is not ready. Check NEXT_PUBLIC_CONVEX_URL and restart the dev server.");
  return value;
}
