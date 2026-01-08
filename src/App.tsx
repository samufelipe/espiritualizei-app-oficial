import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Tab, UserProfile, RoutineItem, OnboardingData, PrayerIntention, CommunityChallenge } from './types';
import { generateSpiritualRoutine } from './services/geminiService';
import { registerUser, getSession, logoutUser, updateUserProfile } from './services/authService'; 
import { saveUserRoutine, fetchUserRoutine, toggleRoutineItemStatus, fetchCommunityIntentions, createIntention, togglePrayerInteraction, createJournalEntry, addRoutineItem, deleteRoutineItem, upgradeUserToPremium, fetchGlobalChallenge } from './services/databaseService';
import { Sparkles, ArrowRight, Loader2, Shield, Heart, User as UserIcon, CheckCircle2, Flame, Footprints } from 'lucide-react';

// Lazy loaded components - these will be created next
const Navigation = lazy(() => import('./components/Navigation'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const BrandLogo = lazy(() => import('./components/BrandLogo'));
const Tutorial = lazy(() => import('./components/Tutorial'));
const Login = lazy(() => import('./components/Login')); 
const Checkout = lazy(() => import('./components/Checkout')); 
const CreateIntentionModal = lazy(() => import('./components/CreateIntentionModal'));
const DailyInspiration = lazy(() => import('./components/DailyInspiration'));
const UpdatePasswordModal = lazy(() => import('./components/UpdatePasswordModal')); 
const MonthlyReviewModal = lazy(() => import('./components/MonthlyReviewModal')); 
const InstallPWA = lazy(() => import('./components/InstallPWA'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Routine = lazy(() => import('./components/Routine'));
const Community = lazy(() => import('./components/Community'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const ParishFinder = lazy(() => import('./components/ParishFinder'));
const Profile = lazy(() => import('./components/Profile'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const KnowledgeBase = lazy(() => import('./components/KnowledgeBase'));
const SpiritualChat = lazy(() => import('./components/SpiritualChat'));

const SAINT_TRANSLATION: Record<string, string> = {
  acutis: 'Beato Carlo Acutis', michael: 'São Miguel Arcanjo', therese: 'Santa Teresinha', joseph: 'São José', mary: 'Virgem Maria'
};

const STRUGGLE_TRANSLATION: Record<string, string> = {
  anxiety: 'Ansiedade', laziness: 'Procrastinação', dryness: 'Aridez', lust: 'Vícios', ignorance: 'Dúvida', pride: 'Soberba', anger: 'Ira'
};

const TabLoader = () => (
  <div className="h-full w-full flex flex-col items-center justify-center animate-fade-in text-slate-400 py-20 bg-brand-dark">
     <Loader2 size={24} className="animate-spin text-brand-violet" />
  </div>
);

const App: React.FC = () => {
  const [viewState, setViewState] = useState<'landing' | 'login' | 'onboarding' | 'generating' | 'checkout' | 'welcome_premium' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.DASHBOARD);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showDailyInspiration, setShowDailyInspiration] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [showMonthlyReview, setShowMonthlyReview] = useState(false); 
  const [showIntentionModal, setShowIntentionModal] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<{ title: string; reasoning: string } | null>(null);
  const [isGeneratingRoutine, setIsGeneratingRoutine] = useState(false);
  const [feedInitialContent, setFeedInitialContent] = useState<string>(''); 
  const [showLiturgyModal, setShowLiturgyModal] = useState(false);
  const initializationRef = useRef(false);

  const [user, setUser] = useState<UserProfile>({
    id: 'guest', name: 'Visitante', email: '', level: 1, currentXP: 0, nextLevelXP: 100, streakDays: 0, joinedDate: new Date()
  });

  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [intentions, setIntentions] = useState<PrayerIntention[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
       const session = getSession();
       if (session?.user) {
          window.history.replaceState({}, document.title, "/");
          setUser((prev: UserProfile) => ({ ...prev, isPremium: true, subscriptionStatus: 'active' }));
          setViewState('welcome_premium');
          upgradeUserToPremium(session.user.id).catch(console.error);
       }
    }
  }, []);

  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initSession = async () => {
      const session = getSession();
      if (session) {
        setUser(session.user);
        setViewState('app');
        
        const lastSeen = localStorage.getItem('espiritualizei_daily_inspiration_date');
        if (lastSeen !== new Date().toDateString()) {
            setShowDailyInspiration(true);
            localStorage.setItem('espiritualizei_daily_inspiration_date', new Date().toDateString());
        }
        
        fetchUserRoutine(session.user.id).then((db: RoutineItem[]) => db && db.length > 0 && setRoutineItems(db));
        fetchCommunityIntentions(session.user.id).then((intentionsData: PrayerIntention[]) => setIntentions(intentionsData));
        fetchGlobalChallenge().then((global: CommunityChallenge | null) => global && setChallenges([global]));
        
      } else {
         const path = window.location.pathname;
         if (path === '/login') setViewState('login');
         else if (path === '/onboarding') setViewState('onboarding');
         else setViewState('landing');
      }
    };
    initSession();
  }, []); 

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      setViewState('generating');
      setIsGeneratingRoutine(true);
      const session = await registerUser(data);
      const result = await generateSpiritualRoutine(data);
      const updatedUser: UserProfile = {
        ...session.user,
        spiritualMaturity: result.profileDescription,
        spiritualFocus: data.primaryStruggle,
        spiritualGoal: data.spiritualGoal,
        patronSaint: data.patronSaint,
        confessionFrequency: data.confessionFrequency,
        lastRoutineUpdate: new Date()
      };
      await updateUserProfile(updatedUser);
      setUser(updatedUser);
      setRoutineItems(result.routine);
      await saveUserRoutine(session.user.id, result.routine);
      setIsGeneratingRoutine(false);
      setGeneratedProfile({ title: result.profileDescription, reasoning: result.profileReasoning });
    } catch (error: any) {
      setIsGeneratingRoutine(false);
      setViewState('onboarding');
      alert(error.message || "Tivemos um problema ao preparar seu plano. Tente novamente.");
    }
  };

  const handleLogout = async () => {
     await logoutUser();
     setViewState('landing');
     setUser({ id: 'guest', name: 'Visitante', email: '', level: 1, currentXP: 0, nextLevelXP: 100, streakDays: 0, joinedDate: new Date() });
     setRoutineItems([]);
  };

  const handleToggleRoutine = async (id: string) => {
    const item = routineItems.find(i => i.id === id);
    if (!item) return;
    const newStatus = !item.completed;
    const newUser = { ...user, currentXP: newStatus ? user.currentXP + item.xpReward : Math.max(0, user.currentXP - item.xpReward) };
    setUser(newUser);
    updateUserProfile(newUser);
    setRoutineItems((prev: RoutineItem[]) => prev.map(i => i.id === id ? { ...i, completed: newStatus } : i));
    await toggleRoutineItemStatus(id, newStatus);
  };

  const handleCreateIntention = async (content: string, category: string) => {
    const newItem = await createIntention(user.id, user.name, user.photoUrl, content, category, []);
    setIntentions((prev: PrayerIntention[]) => [newItem, ...prev]);
  };

  const handlePray = async (id: string) => {
    setIntentions((prev: PrayerIntention[]) => prev.map(i => i.id === id ? { ...i, prayingCount: i.isPrayedByUser ? i.prayingCount - 1 : i.prayingCount + 1, isPrayedByUser: !i.isPrayedByUser } : i));
    await togglePrayerInteraction(id);
  };

  const handleJoinChallenge = (id: string, amount: number = 0) => {
    setChallenges((prev: CommunityChallenge[]) => prev.map(c => c.id === id ? { ...c, isUserParticipating: true, currentAmount: c.currentAmount + amount } : c));
  };

  // Placeholder - components need to be moved to src/components/
  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark font-sans text-slate-100 selection:bg-brand-violet/30">
      <Suspense fallback={<TabLoader />}>
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative bg-brand-dark flex items-center justify-center">
          <div className="text-center p-8">
            <Loader2 size={48} className="animate-spin text-brand-violet mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Espiritualizei</h1>
            <p className="text-slate-400">Os componentes estão sendo migrados...</p>
            <p className="text-xs text-slate-500 mt-4 max-w-md">
              Os arquivos de componentes ainda estão na raiz do projeto. 
              É necessário movê-los para <code className="bg-white/10 px-2 py-1 rounded">src/components/</code>
            </p>
          </div>
        </main>
      </Suspense>
    </div>
  );
};

export default App;
