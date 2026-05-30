import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import IssueDetailsPage from "@/components/report-issue/IssueDetailsPage";

export default function ReportIssuePage() {
  return (
    <div className="min-h-screen folk-pattern-bg">
      <Sidebar />
      <div className="md:ml-[196px]">
        <Header />
        <IssueDetailsPage />
      </div>
    </div>
  );
}
