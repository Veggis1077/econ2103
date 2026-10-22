import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProfileProvider, useProfile } from './profiles/ProfileContext';
import { AppLayout } from './components/layout/AppLayout';
import ProfileSelect from './pages/ProfileSelect';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const LearnIndex = lazy(() => import('./pages/LearnIndex'));
const LecturePage = lazy(() => import('./pages/LecturePage'));
const LabIndex = lazy(() => import('./pages/LabIndex'));
const LabModelPage = lazy(() => import('./pages/LabModelPage'));
const Practice = lazy(() => import('./pages/Practice'));
const PracticeSession = lazy(() => import('./pages/PracticeSession'));
const QuestionPage = lazy(() => import('./pages/QuestionPage'));
const ProblemSetPage = lazy(() => import('./pages/ProblemSetPage'));
const Exam = lazy(() => import('./pages/Exam'));
const Library = lazy(() => import('./pages/Library'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const ChallengeList = lazy(() => import('./pages/Challenges').then((m) => ({ default: m.ChallengeList })));
const ChallengePage = lazy(() => import('./pages/Challenges').then((m) => ({ default: m.ChallengePage })));

function PageFallback() {
  return <div className="space-y-4"><div className="h-10 w-72 animate-pulse rounded-xl bg-ink-200/60 dark:bg-ink-800" /><div className="h-64 animate-pulse rounded-2xl bg-ink-200/40 dark:bg-ink-800/60" /></div>;
}

function Gate() {
  const { profile } = useProfile();
  if (!profile) return <ProfileSelect />;
  return (
    <Suspense fallback={<PageFallback />}>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="learn" element={<LearnIndex />} />
        <Route path="learn/:lectureId" element={<LecturePage />} />
        <Route path="lab" element={<LabIndex />} />
        <Route path="lab/:modelId" element={<LabModelPage />} />
        <Route path="practice" element={<Practice />} />
        <Route path="practice/session" element={<PracticeSession />} />
        <Route path="practice/q/:qid" element={<QuestionPage />} />
        <Route path="practice/problems/:psId" element={<ProblemSetPage />} />
        <Route path="practice/challenges" element={<ChallengeList />} />
        <Route path="practice/challenges/:cid" element={<ChallengePage />} />
        <Route path="exam" element={<Exam />} />
        <Route path="library" element={<Library />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ProfileProvider>
        <Gate />
      </ProfileProvider>
    </HashRouter>
  );
}
