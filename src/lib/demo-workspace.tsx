"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type BusinessProfile = {
  businessName: string; category: string; industry: string; location: string;
  stage: string; storeType: string; products: string[]; employeeCount?: number;
  investmentBudget?: string; registrations: string[];
};
export type SavedDocument = {
  id: string; title: string; type: string; content: string; updatedAt: number;
};
type Workspace = {
  profile: BusinessProfile | null;
  documents: SavedDocument[];
  setProfile: (profile: BusinessProfile) => void;
  saveDocument: (doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => SavedDocument;
  deleteDocument: (id: string) => void;
  resetWorkspace: () => void;
};
const STORAGE_KEY = "smart-copilot-demo-workspace-v1";
const WorkspaceContext = createContext<Workspace | null>(null);

export function DemoWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<BusinessProfile | null>(null);
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { profile?: BusinessProfile | null; documents?: SavedDocument[] };
        setProfileState(parsed.profile ?? null);
        setDocuments(parsed.documents ?? []);
      }
    } catch { /* start with a clean demo workspace if stored data is invalid */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, documents }));
  }, [profile, documents, ready]);

  const setProfile = useCallback((next: BusinessProfile) => setProfileState(next), []);
  const saveDocument = useCallback((doc: Omit<SavedDocument, "id" | "updatedAt"> & { id?: string }) => {
    const saved: SavedDocument = { ...doc, id: doc.id ?? crypto.randomUUID(), updatedAt: Date.now() };
    setDocuments(current => [saved, ...current.filter(item => item.id !== saved.id)]);
    return saved;
  }, []);
  const deleteDocument = useCallback((id: string) => setDocuments(current => current.filter(doc => doc.id !== id)), []);
  const resetWorkspace = useCallback(() => { setProfileState(null); setDocuments([]); }, []);

  const value = useMemo(() => ({ profile, documents, setProfile, saveDocument, deleteDocument, resetWorkspace }), [profile, documents, setProfile, saveDocument, deleteDocument, resetWorkspace]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useDemoWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useDemoWorkspace must be used inside DemoWorkspaceProvider");
  return value;
}
