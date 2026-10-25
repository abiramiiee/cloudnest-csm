import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Logo } from '../../components/common/Logo';
import { Code2, Server, Database, Cloud, Layers, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <PublicNavbar />

      <section className="py-16 bg-gradient-to-b from-purple-50/50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
            <Award className="w-3.5 h-3.5" />
            <span>Academic Capstone Specification</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            About CloudNest Project
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive Cloud Service Management project demonstrating modern decoupled web architecture, object storage management, and role-based access control.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Project Mission */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Project Mission & Academic Scope
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              CloudNest was designed to solve a fundamental challenge in distributed cloud systems: how to provide an intuitive, high-performance user experience for file management while strictly segregating user metadata, authentication tokens, and heavy binary blob storage.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Rather than combining frontend and database operations inside single-tier scripts, CloudNest follows enterprise industry patterns: a modular React TypeScript SPA communicating through standardized REST contracts with a Java Spring Boot backend, backed by MySQL for relational consistency and Amazon S3 for durable object storage.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Course Metadata</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Cloud Service Management (CSM)
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                <p>Course: Advanced Cloud Computing & Service Management</p>
                <p>Deliverable: Full-Stack Cloud Storage & Sharing System</p>
                <p>Architecture: Decoupled REST Client + Microservice Tier</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Integrated Technology Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Frontend Architecture</h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <li>• React 19 (Component-driven SPA)</li>
                <li>• TypeScript for compile-time domain contracts</li>
                <li>• Tailwind CSS for modern responsive styling</li>
                <li>• React Router v7 for client-side navigation</li>
                <li>• Lucide React for consistent line iconography</li>
                <li>• Native Fetch API client with timeout guards</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Backend Target Service</h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <li>• Java 21 LTS runtime</li>
                <li>• Spring Boot 3 framework</li>
                <li>• Spring Security with stateless JWT filter</li>
                <li>• Spring Data JPA & Hibernate ORM</li>
                <li>• REST Controller layer (/api/* endpoints)</li>
                <li>• Maven build & multi-stage Docker container</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Database & Object Store</h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <li>• MySQL 8.0 relational database</li>
                <li>• ACID-compliant metadata indexing</li>
                <li>• Amazon S3 standard object storage</li>
                <li>• Local file system fallback during development</li>
                <li>• AES-256 server-side encryption enabled</li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Architecture Diagram */}
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Three-Tier Decoupled Flow Architecture
          </h3>
          <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300 overflow-x-auto">
            <p className="text-violet-600 dark:text-violet-400 font-bold">[Client Tier (Browser)]</p>
            <p className="pl-4">React SPA (Vite) ──HTTP (Bearer JWT)──► [Spring Boot Gateway @ localhost:8080/api]</p>
            <p className="text-blue-600 dark:text-blue-400 font-bold mt-2">[Application & Business Logic Tier]</p>
            <p className="pl-4">Spring Security (Auth Filter) ──► FileController & ShareController</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-2">[Persistence & Storage Tier]</p>
            <p className="pl-4">Spring Data JPA ────────► MySQL Database (Users, FileMetadata, Shares, Activity)</p>
            <p className="pl-4">AWS S3 SDK Client ──────► Amazon S3 Bucket / Local Storage (Encrypted Binary Blobs)</p>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};
