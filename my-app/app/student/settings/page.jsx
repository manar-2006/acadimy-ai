'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsPage() {
  const router = useRouter();
  const { language, changeLanguage, t } = useLanguage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState({
    fullName: 'Alex Rivera',
    email: 'a.rivera@edu-sphere.ai',
    school: 'Global Institute of Advanced Technology'
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            fullName: data.fullName || 'Alex Rivera',
            email: data.email || 'a.rivera@edu-sphere.ai',
            school: data.school || 'Global Institute of Advanced Technology'
          });
        }
      } catch (err) {
        console.error('Error fetching user for settings:', err);
      }
    };
    fetchUser();
  }, []);

  const getTabClassName = (tabId) => {
    const baseClasses = "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left text-body-md ";
    if (activeTab === tabId) {
      return `${baseClasses} bg-secondary/10 text-secondary font-semibold`;
    }
    return `${baseClasses} hover:bg-surface-container-high text-on-surface-variant`;
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#191c1e] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      {/* Main Container Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Navbar setMobileNavOpen={setMobileNavOpen} title={t('settings')} />

        {/* Dynamic Content Layout */}
        <main className="flex-grow p-6 md:p-10 max-w-6xl mx-auto w-full">
          <div className="mb-10">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">{t('settings')}</h2>
            <p className="font-body-md text-on-surface-variant">{t('settingsDesc')}</p>
          </div>

          <div className="flex gap-10">
            {/* Sub Tabs Navigation */}
            <nav className="w-64 space-y-2 shrink-0">
              <button className={getTabClassName('account')} onClick={() => setActiveTab('account')}>
                <span className="material-symbols-outlined">person</span> {t('settingsAccountTab')}
              </button>
              <button className={getTabClassName('appearance')} onClick={() => setActiveTab('appearance')}>
                <span className="material-symbols-outlined">palette</span> {t('settingsAppearanceTab')}
              </button>
              <button className={getTabClassName('notifications')} onClick={() => setActiveTab('notifications')}>
                <span className="material-symbols-outlined">notifications_active</span> {t('notifications')}
              </button>
              <button className={getTabClassName('privacy')} onClick={() => setActiveTab('privacy')}>
                <span className="material-symbols-outlined">shield</span> {t('settingsPrivacyTab')}
              </button>
              <button className={getTabClassName('language')} onClick={() => setActiveTab('language')}>
                <span className="material-symbols-outlined">language</span> {t('settingsLanguageTab')}
              </button>
            </nav>

            {/* Target Panel Content Sections */}
            <div className="flex-1 space-y-8">

              {/* Account Panel */}
              <section className={activeTab === 'account' ? 'space-y-6' : 'hidden'}>
                <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          className="w-24 h-24 rounded-full object-cover border-4 border-surface-container"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAat2TJHMIgRjsCbv_6c4E4Ur6CpmIONkJrciIvSX0RjK-gqld1_Gwa3z-xoWM0ThPFsHiav4zMORrO2kryT1MCs01FjZxQwLOBjG-Z2FF9OGSWKAN9oXKQa67QGo44JfvIiUMAhRbVAH5iSBevowKyX6L83QSK_fIiwWIzLt-7jm5egqpGxVroOq0dDruqHpV9vZbinYNx06BhfOhyNudThsXhk0M6rL6IOPRKwBhFqAcSPfvKKkPVs1ooclxVTLYiYCKWeGug8Ro"
                          alt="Researcher avatar"
                        />
                        <button className="absolute bottom-0 right-0 bg-secondary text-on-secondary p-1.5 rounded-full shadow-lg border-2 border-surface-container-lowest">
                          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        </button>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-primary">{t('settingsProfileInfo')}</h3>
                        <p className="text-body-sm text-on-surface-variant">{t('settingsProfileInfoDesc')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push('/student/student-profile')}
                      className="px-6 py-2 border border-secondary text-secondary font-bold rounded-lg hover:bg-secondary/5 transition-all"
                    >
                      {t('editProfileBtn')}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="font-label-md text-on-surface-variant group-focus-within:text-secondary block transition-colors">{t('settingsFullNameLabel')}</label>
                      <input className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" readOnly type="text" value={user.fullName} />
                    </div>
                    <div className="space-y-2 group">
                      <label className="font-label-md text-on-surface-variant group-focus-within:text-secondary block transition-colors">{t('settingsEmailLabel')}</label>
                      <input className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" readOnly type="email" value={user.email} />
                    </div>
                    <div className="space-y-2 col-span-2 group">
                      <label className="font-label-md text-on-surface-variant group-focus-within:text-secondary block transition-colors">{t('settingsInstitutionLabel')}</label>
                      <input className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" readOnly type="text" value={user.school} />
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-6">{t('settingsSecurity')}</h3>
                  <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                    <div>
                      <p className="font-bold text-on-surface">{t('Password')}</p>
                      <p className="text-body-sm text-on-surface-variant">{t('Yesterday') || 'Yesterday'}</p>
                    </div>
                    <button className="text-secondary font-bold hover:underline">{t('changePasswordBtn')}</button>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-bold text-on-surface">{t('settingsTfa')}</p>
                      <p className="text-body-sm text-on-surface-variant">{t('settingsTfaDesc')}</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" id="tfa-toggle" />
                      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Appearance Panel */}
              <section className={activeTab === 'appearance' ? 'space-y-6' : 'hidden'}>
                <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-2">{t('settingsThemePref')}</h3>
                  <p className="text-body-sm text-on-surface-variant mb-8">{t('settingsThemePrefDesc')}</p>
                  <div className="grid grid-cols-3 gap-6">
                    <button className="group flex flex-col gap-4">
                      <div className="aspect-video w-full bg-surface border-2 border-secondary rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="w-3/4 h-3/4 bg-white shadow-lg rounded p-2 flex flex-col gap-1 text-left">
                          <div className="h-2 w-1/2 bg-primary/20 rounded"></div>
                          <div className="h-2 w-full bg-surface-container-high rounded"></div>
                          <div className="h-2 w-2/3 bg-surface-container-high rounded"></div>
                        </div>
                      </div>
                      <span className="font-bold text-secondary text-center w-full block">Light Mode</span>
                    </button>
                    <button className="group flex flex-col gap-4 opacity-60 hover:opacity-100 transition-all">
                      <div className="aspect-video w-full bg-inverse-surface border border-outline-variant rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="w-3/4 h-3/4 bg-slate-800 shadow-lg rounded p-2 flex flex-col gap-1 text-left">
                          <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                          <div className="h-2 w-full bg-slate-700 rounded"></div>
                          <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                        </div>
                      </div>
                      <span className="font-bold text-on-surface-variant text-center w-full block">Dark Mode</span>
                    </button>
                    <button className="group flex flex-col gap-4 opacity-60 hover:opacity-100 transition-all">
                      <div className="aspect-video w-full bg-gradient-to-br from-surface to-inverse-surface border border-outline-variant rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="w-3/4 h-3/4 bg-white/50 backdrop-blur-sm shadow-lg rounded p-2 flex flex-col gap-1 items-center justify-center">
                          <span className="material-symbols-outlined text-primary">hdr_auto</span>
                        </div>
                      </div>
                      <span className="font-bold text-on-surface-variant text-center w-full block">Auto (System)</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-md border border-outline-variant p-8 rounded-xl shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-2">Interface Scaling</h3>
                  <p className="text-body-sm text-on-surface-variant mb-6">Adjust the density of the academic workspace.</p>
                  <input className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary" max="3" min="1" type="range" defaultValue="2" />
                  <div className="flex justify-between mt-2 text-label-md text-on-surface-variant font-bold">
                    <span>COMPACT</span>
                    <span>COMFORTABLE</span>
                    <span>LARGE</span>
                  </div>
                </div>
              </section>

              {/* Notifications Panel */}
              <section className={activeTab === 'notifications' ? 'space-y-6' : 'hidden'}>
                <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-6">Notification Channels</h3>
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="max-w-md">
                        <p className="font-bold text-on-surface">Course Announcements</p>
                        <p className="text-body-sm text-on-surface-variant">Get notified when professors post new materials or deadline changes.</p>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                          <input defaultChecked className="w-4 h-4 text-secondary rounded focus:ring-secondary" type="checkbox" /> Email
                        </label>
                        <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                          <input defaultChecked className="w-4 h-4 text-secondary rounded focus:ring-secondary" type="checkbox" /> Push
                        </label>
                      </div>
                    </div>
                    <div className="h-[1px] bg-outline-variant"></div>
                    <div className="flex items-start justify-between">
                      <div className="max-w-md">
                        <p className="font-bold text-on-surface">AI Insights & Summaries</p>
                        <p className="text-body-sm text-on-surface-variant">Daily digest of AI-generated research findings and study recommendations.</p>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                          <input defaultChecked className="w-4 h-4 text-secondary rounded focus:ring-secondary" type="checkbox" /> Email
                        </label>
                        <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                          <input className="w-4 h-4 text-secondary rounded focus:ring-secondary" type="checkbox" /> Push
                        </label>
                      </div>
                    </div>
                    <div className="h-[1px] bg-outline-variant"></div>
                    <div className="flex items-start justify-between">
                      <div className="max-w-md">
                        <p className="font-bold text-on-surface">Peer Mentoring Requests</p>
                        <p className="text-body-sm text-on-surface-variant">Notifications when students request help on subjects you've mastered.</p>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                          <input className="w-4 h-4 text-secondary rounded focus:ring-secondary" type="checkbox" /> Email
                        </label>
                        <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                          <input defaultChecked className="w-4 h-4 text-secondary rounded focus:ring-secondary" type="checkbox" /> Push
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Privacy Panel */}
              <section className={activeTab === 'privacy' ? 'space-y-6' : 'hidden'}>
                <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-6">Data & AI Governance</h3>
                  <div className="p-4 bg-tertiary-container/10 border border-tertiary/20 rounded-lg mb-8 flex gap-4">
                    <span className="material-symbols-outlined text-tertiary">info</span>
                    <p className="text-body-sm text-on-tertiary-fixed-variant">EduSphere AI prioritizes your academic integrity. Your data is used exclusively to train your personal AI agent and is never sold to third parties.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-on-surface">Improve AI with my Data</p>
                        <p className="text-body-sm text-on-surface-variant">Allow EduSphere to learn from your study patterns to provide better insights.</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" type="checkbox" id="learn-data-toggle" />
                        <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-on-surface">Profile Visibility</p>
                        <p className="text-body-sm text-on-surface-variant">Make your researcher profile visible to institutional partners.</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input className="sr-only peer" type="checkbox" id="visibility-toggle" />
                        <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 pt-8 border-t border-outline-variant">
                    <button className="text-error font-bold flex items-center gap-2 hover:bg-error/5 px-4 py-2 rounded-lg transition-all">
                      <span className="material-symbols-outlined">delete_forever</span>
                      Request Data Deletion
                    </button>
                  </div>
                </div>
              </section>

              {/* Language Panel */}
              <section className={activeTab === 'language' ? 'space-y-6' : 'hidden'}>
                <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-6">{t('settingsLanguageTab')}</h3>
                  <div className="space-y-4">
                    <label className="font-label-md text-on-surface-variant block uppercase tracking-wider">{t('Interface Language') || 'Interface Language'}</label>
                    <select 
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="w-full p-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                    </select>
                    <p className="text-body-sm text-on-surface-variant italic">{t('Changing the language will reload the workspace settings.') || 'Changing the language will apply standard interface updates.'}</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full mt-auto bg-surface-container-highest dark:bg-surface-dim border-t border-outline-variant px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="font-headline-sm text-headline-sm font-bold text-primary">EduSphere AI</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 EduSphere AI. Bridging Academic Excellence & Intelligent Technology.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Institutional Partners</a>
            <a className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Research Privacy</a>
            <a className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Accessibility</a>
            <a className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Support</a>
          </div>
        </footer>

      </div>
    </div>
  );
}