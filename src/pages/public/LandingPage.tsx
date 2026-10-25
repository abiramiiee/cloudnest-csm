import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import {
  Cloud,
  Shield,
  Clock,
  FolderTree,
  PieChart,
  Lock,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Share2,
  HardDrive,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'Secure Cloud Storage',
      desc: 'Encrypted object storage integrated with AWS S3 and Spring Boot backend for ultra-reliable persistence.',
      icon: Cloud,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
    },
    {
      title: 'Smart File Organization',
      desc: 'Deterministic categorization by MIME and extension across documents, images, video, and archives.',
      icon: FolderTree,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Temporary Share Links',
      desc: 'Time-bound tokens expiring in 1 hour to 30 days with optional passkeys and download restrictions.',
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      title: 'File Activity History',
      desc: 'Immutable audit trail logging every upload, move, star, share link generation, and deletion.',
      icon: FileCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Storage Usage Insights',
      desc: 'Visual storage quotas, breakdown by media categories, largest files analytics, and upload velocity.',
      icon: PieChart,
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-50 dark:bg-pink-950/40',
    },
    {
      title: 'Personal Secure Vault',
      desc: 'Isolated high-security repository for sensitive keys and credentials with distinct passcode protection.',
      icon: Lock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  const steps = [
    { step: '01', title: 'Create an account', desc: 'Register with institutional or personal credentials in seconds.' },
    { step: '02', title: 'Upload your files', desc: 'Drag and drop documents, multimedia, or code archives with live progress.' },
    { step: '03', title: 'Organize files into folders', desc: 'Structure directory hierarchies with customized color badges.' },
    { step: '04', title: 'Share files securely', desc: 'Create tokenized links with granular read-only or download permissions.' },
    { step: '05', title: 'Manage and revoke access', desc: 'Instantly revoke public links or modify expiration timestamps on demand.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-purple-50/50 via-slate-50/30 to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                <span>College Cloud Service Management Capstone</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Your Digital World, Organized in{' '}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  One Place.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Store, manage, and share your files securely with CloudNest. Experience smarter file organization, controlled sharing, and a simpler way to manage your digital life.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md shadow-violet-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/features"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  <span>Explore Features</span>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Spring Boot & MySQL Architecture</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>AWS S3 Object Storage</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Personal Vault with Passcode</span>
                </div>
              </div>
            </div>

            {/* Right Column: Illustration Asset */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
                  <img
                    src="/src/assets/images/cloudnest_hero_illustration_1792835181067.jpg"
                    alt="CloudNest Cloud Storage Workspace Illustration"
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                        CN
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">CSM Storage Node #01</p>
                        <p className="text-[10px] text-slate-400">Active · 15 GB Allocation Quota</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      HEALTHY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Features Section */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Complete Cloud Storage Capabilities
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Designed from the ground up for modern file management, secure collaboration, and rigorous cloud service management standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-800 hover:shadow-lg transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 Steps: How It Works */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              How CloudNest Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Five straightforward steps from account provisioning to granular link revocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((st) => (
              <div
                key={st.step}
                className="relative flex flex-col p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800"
              >
                <span className="text-2xl font-extrabold font-mono text-violet-600 dark:text-violet-400 mb-2">
                  {st.step}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Architecture Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero Trust Security Model</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Architected for Strict Privacy & End-to-End Governance
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                CloudNest establishes explicit security boundaries between metadata storage (MySQL), binary blobs (AWS S3), and client access tokens (Spring Security). Vault files remain strictly isolated from public sharing endpoints.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-violet-400" />
                    <span>Stateless JWT Authentication</span>
                  </p>
                  <p className="text-slate-400">
                    Spring Security with cryptographic signing and session revocation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span>Separated S3 Object Blobs</span>
                  </p>
                  <p className="text-slate-400">
                    No direct database file storage; presigned URLs and binary streams only.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Expiring Tokenized Shares</span>
                  </p>
                  <p className="text-slate-400">
                    Automatic expiration checks on every GET request at the gateway.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Personal Secure Vault</span>
                  </p>
                  <p className="text-slate-400">
                    Separate collection blocked from public sharing queries.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/security"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white underline underline-offset-4"
                >
                  <span>Read full Security Architecture Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md max-w-sm text-center">
                <img
                  src="/src/assets/images/cloudnest_vault_shield_1792835181779.jpg"
                  alt="CloudNest Cyber Vault Emblem"
                  className="w-44 h-44 mx-auto object-contain rounded-2xl shadow-xl mb-4"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-base font-bold text-white">Military-Grade Vault Logic</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dual-tier access verification ensuring sensitive assets are protected from accidental public exposure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-slate-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to Take Control of Your Cloud Storage?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Experience the CloudNest platform now. Sign in with the preloaded student account or create a new profile in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Access Demo Workspace
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
