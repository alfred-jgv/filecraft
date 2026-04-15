import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "../components/ui/PageLoader";
import AppLayout from "../components/layout/AppLayout";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const PdfToWord = lazy(() => import("../pages/tools/PdfToWord/PdfToWord"));
const MergePdf = lazy(() => import("../pages/tools/MergePdf/MergePdf"));
const SplitPdf = lazy(() => import("../pages/tools/SplitPdf/SplitPdf"));
const Convert = lazy(() => import("../pages/tools/Convert/Convert"));

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <AppLayout>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
                        <Route path="/tools/merge" element={<MergePdf />} />
                        <Route path="/tools/split" element={<SplitPdf />} />
                        <Route path="/tools/convert" element={<Convert />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Suspense>
            </AppLayout>
        </BrowserRouter>
    );
}