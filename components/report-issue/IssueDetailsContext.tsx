"use client";

import { createContext, useContext, useState } from "react";

export type IssueDetailsState = {
  issueType: string;
  description: string;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  dateTime: string;
  evidenceFiles: { file: File; preview: string }[];
  additionalInformation: string;
  anonymous: boolean;
};

const emptyIssue: IssueDetailsState = {
  issueType: "",
  description: "",
  locationName: "",
  latitude: null,
  longitude: null,
  dateTime: "",
  evidenceFiles: [],
  additionalInformation: "",
  anonymous: false,
};

const IssueDetailsContext = createContext<{
  issue: IssueDetailsState;
  updateIssue: (values: Partial<IssueDetailsState>) => void;
  clearIssue: () => void;
} | null>(null);

export function IssueDetailsProvider({ children }: { children: React.ReactNode }) {
  const [issue, setIssue] = useState(emptyIssue);
  const updateIssue = (values: Partial<IssueDetailsState>) => setIssue((current) => ({ ...current, ...values }));
  const clearIssue = () => setIssue(emptyIssue);
  return <IssueDetailsContext.Provider value={{ issue, updateIssue, clearIssue }}>{children}</IssueDetailsContext.Provider>;
}

export function useIssueDetails() {
  const context = useContext(IssueDetailsContext);
  if (!context) throw new Error("useIssueDetails must be used inside IssueDetailsProvider");
  return context;
}
