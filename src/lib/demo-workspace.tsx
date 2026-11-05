"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { anyApi } from "convex/server";

export type BusinessProfile = {
  businessName: string; category: string; industry: string; location: string;
  stage: string; storeType: string; products: string[]; employeeCount?: number;
  investmentBudget?: string; registrations: string[]; goals?: string[];
};
export type SavedDocument = { id: string; title: string; type: string; content: string; updatedAt: number };
export type AdvisorMessage = { role: "user" | "assistant"; content: string; createdAt?: number };
type Workspace = {
  profile: BusinessProfile | null; documents: SavedDocument[]; messages: AdvisorMessage[];
  ready: boolean; workspaceId: string; deploymentUrl: string;
  setProfile: (profile: BusinessProfile) => Promise<{ id: string; workspaceId: string; action: "inserted" | "updated" }>;
  saveDocument: (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => Promise<SavedDocument>;
  deleteDocument: (id: string) => Promise<void>;
  saveMessages: (messages: AdvisorMessage[]) => Promise<void>;
  resetWorkspace: () => Promise<void>;
};

const WorkspaceContext = createContext<Workspace | null>(null);

function WorkspaceDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const data = useQuery(anyApi.workspace.get, isAuthenticated ? {} : "skip") as
    { _id?: string; workspaceId?: string; profile?: BusinessProfile; documents?: SavedDocument[]; messages?: AdvisorMessage[] } | null | undefined;

  const saveProfileMutation = useMutation(anyApi.workspace.saveProfile);
  const saveDocumentMutation = useMutation(anyApi.workspace.saveDocument);
  const deleteDocumentMutation = useMutation(anyApi.workspace.deleteDocument);
  const saveMessagesMutation = useMutation(anyApi.workspace.saveMessages);
  const resetMutation = useMutation(anyApi.workspace.reset);

  const profile = data?.profile ?? null;
  const documents = data?.documents ?? [];
  const messages = data?.messages ?? [];

  const setProfile = useCallback(async (next: BusinessProfile) => {
    const result = await saveProfileMutation({ profile: next }) as { id: string; workspaceId: string; action: "inserted" | "updated" };
    if (!result?.id) throw new Error("Convex did not confirm the business profile was saved.");
    return result;
  }, [saveProfileMutation]);

  const saveDocument = useCallback(async (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => {
    const saved: SavedDocument = { ...doc, id: doc.id ?? crypto.randomUUID(), updatedAt: Date.now() };
    await saveDocumentMutation({ document: saved });
    return saved;
  }, [saveDocumentMutation]);

  const deleteDocument = useCallback(async (id: string) => {
    await deleteDocumentMutation({ documentId: id });
  }, [deleteDocumentMutation]);

  const saveMessages = useCallback(async (next: AdvisorMessage[]) => {
    if (next.length) await saveMessagesMutation({
      messages: next.map(m => ({ role: m.role, content: m.content, createdAt: m.createdAt ?? Date.now() })),
    });
  }, [saveMessagesMutation]);

  const resetWorkspace = useCallback(async () => {
    await resetMutation({});
  }, [resetMutation]);

  const value = useMemo(() => ({
    profile, documents, messages,
    ready: !isLoading && isAuthenticated && data !== undefined,
    workspaceId: data?.workspaceId ?? "Account workspace",
    deploymentUrl: process.env.NEXT_PUBLIC_CONVEX_URL || "",
    setProfile, saveDocument, deleteDocument, saveMessages, resetWorkspace,
  }), [profile, documents, messages, isLoading, isAuthenticated, data, setProfile, saveDocument, deleteDocument, saveMessages, resetWorkspace]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function DemoWorkspaceProvider({ children }: { children: React.ReactNode }) {
  return <WorkspaceDataProvider>{children}</WorkspaceDataProvider>;
}

export function useDemoWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("Workspace provider is not ready.");
  return value;
}
