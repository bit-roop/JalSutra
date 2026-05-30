import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ReportIssueForm from "@/components/report-issue/ReportIssueForm";

export default function ReportBiodiversityPage() {
  return (
    <div className="min-h-screen overflow-x-hidden folk-pattern-bg">
      <Sidebar />
      <div className="md:ml-[196px] flex min-h-screen flex-col">
        <Header />
        <ReportIssueForm />
      </div>
    </div>
  );
}
