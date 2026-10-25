import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Link } from 'react-router-dom';
import {
  Cloud,
  FolderTree,
  Clock,
  FileCheck,
  PieChart,
  Lock,
  ArrowRight,
  HardDrive,
  Share2,
  Trash2,
  Search,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const detailedFeatures = [
    {
      id: 'storage',
      title: '1. Secure Cloud Storage',
      subtitle: 'Hybrid S3 Object Storage & Spring Boot Architecture',
      desc: 'Separates database metadata from file binary payloads. File metadata is cataloged in MySQL tables while actual file bytes are streamed into Amazon S3 buckets or local development directories.',
      icon: Cloud,
      bullets: [
        'Multipart and chunked binary upload pipeline',
        'AES-256 server-side encryption for stored assets',
        'Automatic MIME type and file extension detection',
        'Custom quota management per user account',
      ],
    },
    {
      id: 'organization',
      title: '2. Smart File Organization',
      subtitle: 'Deterministic Categorization (No Artificial AI Hype)',
      desc: 'Automatically classifies uploaded content using standard MIME signatures and extension patterns into 6 core groups: Documents, Images, Videos, Audio, Compressed Archives, and Others.',
      icon: FolderTree,
      bullets: [
        'Color-coded directory structures with nested paths',
        'Instant category filtering and multi-faceted search',
        'Starring and favorites tagging for rapid retrieval',
        'Dual layout switching between Grid and List tabular view',
      ],
    },
    {
      id: 'sharing',
      title: '3. Temporary Share Links',
      subtitle: 'Expiring Public Tokens with Passcode Gates',
      desc: 'Generate cryptographic share tokens without exposing internal file IDs or S3 bucket URLs. Choose expiration windows from 1 hour to 30 days.',
      icon: Clock,
      bullets: [
        'Granular View Only vs. View & Download permission flags',
        'Optional password protection validated server-side',
        'One-click instant link revocation at any point',
        'Access count analytics and real-time expiration checks',
      ],
    },
    {
      id: 'activity',
      title: '4. File Activity Timeline',
      subtitle: 'Immutable Audit Trail for Cloud Compliance',
      desc: 'Keep complete visibility over every file event. The activity engine records file uploads, renames, relocations, sharing generations, and trash operations.',
      icon: FileCheck,
      bullets: [
        'Detailed timestamp logs with ISO 8601 precision',
        'Action-type categorization (Upload, Move, Share, Trash)',
        'User authorization verification on every audit entry',
        'Filterable timeline for compliance reporting',
      ],
    },
    {
      id: 'insights',
      title: '5. Storage Usage Insights',
      subtitle: 'Visual Analytics & Capacity Planning',
      desc: 'Monitor real-time storage consumption with category breakdowns, largest file rankings, and monthly upload velocity charts.',
      icon: PieChart,
      bullets: [
        'Category distribution bar and byte calculations',
        'Top 5 largest files identification for quota cleanup',
        'Historical monthly upload trend tracking',
        'Configurable user quota thresholds',
      ],
    },
    {
      id: 'vault',
      title: '6. Personal Secure Vault',
      subtitle: 'Zero-Exposure Boundary for Sensitive Artifacts',
      desc: 'A separate, passcode-protected repository for critical keys, certificates, and credentials. Vault assets are excluded from regular file listings and cannot be publicly shared.',
      icon: Lock,
      bullets: [
        'Secondary PIN / passcode authentication layer',
        'Total isolation from general search and public share APIs',
        'Permanent deletion safeguards and confirmation prompts',
        'Clear demo indicators when running in unlinked mode',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <PublicNavbar />

      <section className="py-16 bg-gradient-to-b from-purple-50/50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            CloudNest Architecture
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            Engineered for Modern Cloud File Management
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore the core modules built for the College Cloud Service Management capstone project, bridging modern React frontend UI with Spring Boot and MySQL backends.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {detailedFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          const isEven = idx % 2 === 1;
          return (
            <div
              key={feat.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-2' : ''}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-semibold">
                  <Icon className="w-4 h-4" />
                  <span>{feat.subtitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {feat.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''}`}>
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Interactive Preview</span>
                    <span className="text-[10px] font-mono text-violet-600 bg-violet-50 dark:bg-violet-950 px-2 py-0.5 rounded">
                      COMPONENT READY
                    </span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{feat.title}</p>
                        <p className="text-[10px] text-slate-400">Spring Boot REST Target Endpoint</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Fully integrated with centralized API services, deterministic logic, and real-time state management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md transition-all"
          >
            <span>Launch CloudNest Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
