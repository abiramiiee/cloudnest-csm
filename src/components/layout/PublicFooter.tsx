import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Shield, Lock, Database } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-3">
            <div className="brightness-125">
              <Logo size="md" showTagline={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Next-generation cloud storage and sharing architecture designed for college Cloud Service Management coursework.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-violet-400" />
                <span>MySQL & S3</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>AES-256</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/features" className="hover:text-white transition-colors">Features Overview</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security Architecture</Link></li>
              <li><Link to="/app/vault" className="hover:text-white transition-colors">Personal Secure Vault</Link></li>
              <li><Link to="/app/insights" className="hover:text-white transition-colors">Storage Usage Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Project & Course</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">CSM Project Overview</Link></li>
              <li><a href="https://spring.io/projects/spring-boot" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Spring Boot Target</a></li>
              <li><a href="https://aws.amazon.com/s3/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">AWS S3 Storage Layer</a></li>
              <li><Link to="/app/settings" className="hover:text-white transition-colors">Backend Connection Test</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Compliance & Ethics</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Responsible Disclosure</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Student Academic Integrity</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CloudNest. College Cloud Service Management Capstone System.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3 h-3 text-violet-400" />
              <span>Tokenized Share Links & Multi-Tier Access Control</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
