import { IssueDetailsProvider } from "@/components/report-issue/IssueDetailsContext";

export default function ReportIssueLayout({ children }: { children: React.ReactNode }) {
  return <IssueDetailsProvider>{children}</IssueDetailsProvider>;
}
