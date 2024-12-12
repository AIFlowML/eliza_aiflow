import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DistributionPage from './pages/distribution.tsx';
import EvaluationPage from './pages/evaluation.tsx';
import MilestonePage from './pages/milestone.tsx';
import SubmissionPage from './pages/submission.tsx';
import Home from "./pages/Home.tsx";

const queryClient = new QueryClient();

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            {children}
        </Link>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    {/*<nav className="bg-gray-800">*/}
                    {/*    <div className="max-w-7xl mx-auto px-4">*/}
                    {/*        <div className="flex items-center justify-between h-16">*/}
                    {/*            <div className="flex items-center">*/}
                    {/*                <div className="flex-shrink-0">*/}
                    {/*                    <span className="text-white text-xl font-bold">*/}
                    {/*                        Multiagent Client*/}
                    {/*                    </span>*/}
                    {/*                </div>*/}
                    {/*                <div className="ml-10 flex items-baseline space-x-4">*/}
                    {/*                    <NavLink to="/">Distribution</NavLink>*/}
                    {/*                    <NavLink to="/evaluation">Evaluation</NavLink>*/}
                    {/*                    <NavLink to="/milestone">Milestone</NavLink>*/}
                    {/*                    <NavLink to="/submission">Submission</NavLink>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</nav>*/}

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/distribution" element={<DistributionPage />} />
                        <Route path="/evaluation" element={<EvaluationPage />} />
                        <Route path="/milestone" element={<MilestonePage />} />
                        <Route path="/submission" element={<SubmissionPage />} />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
