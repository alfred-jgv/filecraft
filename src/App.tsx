import { lazy, Suspense, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import PageLoader from "./components/ui/PageLoader";

// Lazy load the entire router — nothing downloads until splash is done
const AppRoutes = lazy(() => import("./routes/AppRoutes"));

export default function App() {
    const [splashDone, setSplashDone] = useState(false);

    if (!splashDone) {
        return <SplashScreen onComplete={() => setSplashDone(true)} minDuration={3200} />;
    }

    return (
        <Suspense fallback={<PageLoader />}>
            <AppRoutes />
        </Suspense>
    );
}