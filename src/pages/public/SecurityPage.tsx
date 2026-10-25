import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Shield, Lock, Server, KeyRound, AlertTriangle, CheckCircle2, FileCheck, Database } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <PublicNavbar />

      <section className="py-16 bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
            <Shield className="w-3.5 h-3.5" />
            <span>Cloud Service Management Security Dossier</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            CloudNest Security & Access Governance
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive look at our multi-layered defense architecture, authorization boundaries, tokenized link protections, and Personal Secure Vault design.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Important Security Notice / College Project Disclaimer */}
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              College Project Architectural Specification Notice
            </p>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              In strict accordance with academic integrity and Cloud Service Management guidelines: The frontend interface establishes clean security workflows, token handling, and input validation. In the current standalone demonstration mode, mock states are provided. Full cryptographic enforcement requires the linked Java Spring Boot backend and MySQL database.
            </p>
          </div>
        </div>

        {/* Security Responsibility Matrix */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frontend vs. Backend Responsibility Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold text-sm">
                <Server className="w-4 h-4" />
                <span>Frontend Layer Responsibilities (React)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Never stores plaintext passwords or sensitive credentials in localStorage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Enforces protected routing, redirecting unauthenticated sessions to /login.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>No direct SQL or database driver invocations from client code.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>AWS S3 bucket secrets and private keys are never shipped in the browser bundle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Transmits JWT Bearer tokens securely via standard HTTP Authorization headers.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                <Database className="w-4 h-4" />
                <span>Backend Target Responsibilities (Spring Boot)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>BCrypt hashing with dynamic salting for user credentials in MySQL.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Per-request authorization: verifies ownership before reading, moving, or trashing files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dynamic token verification for /share/{'{token}'} checking expiration, revokes, and passcodes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Vault protection: isolates sensitive file metadata and enforces dual-factor PIN checks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Streaming binary payloads directly to Amazon S3 using AWS SDK presigned URLs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Pillars of CloudNest Security */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Core Security Architecture Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <KeyRound className="w-6 h-6 text-violet-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Tokenized Sharing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Randomized non-guessable hash tokens replace internal primary keys in all public URLs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <Lock className="w-6 h-6 text-indigo-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Personal Vault</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zero-sharing policy; files within the vault cannot be shared or included in global search.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <FileCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Audit Trail</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Activity events are logged with timestamp, user ID, file name, and IP record for compliance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <Shield className="w-6 h-6 text-pink-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Quota Enforcers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pre-upload checks reject files exceeding remaining quota or server-defined 500 MB ceilings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};
