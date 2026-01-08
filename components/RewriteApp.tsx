'use client';

import { useState } from 'react';
import { Copy, Check, Loader2, Wand2 } from 'lucide-react';
import ToneSelector from './ToneSelector';

export default function RewriteApp() {
  const [message, setMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    if (!message.trim()) {
      setError('Please enter a message to rewrite');
      return;
    }

    if (!selectedTone) {
      setError('Please select a tone');
      return;
    }

    if (message.length > 2000) {
      setError('Message exceeds 2000 characters');
      return;
    }

    setError('');
    setIsLoading(true);
    setRewrittenText('');

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, tone: selectedTone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rewrite');
      }

      setRewrittenText(data.rewrittenText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (rewrittenText) {
      await navigator.clipboard.writeText(rewrittenText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const charCount = message.length;
  const charLimit = 2000;
  const isOverLimit = charCount > charLimit;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFF' }}>
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            ToneShift
          </h1>
          <p className="text-base text-slate-600">
            Transform your message into any tone in seconds
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className={`w-full h-36 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-400 text-slate-700 bg-slate-50/50 ${
                isOverLimit ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : 'border-slate-200'
              }`}
            />
            <div className={`text-xs mt-2 ${isOverLimit ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
              {charCount} / {charLimit} characters
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Select Tone
            </label>
            <ToneSelector selectedTone={selectedTone} onToneSelect={setSelectedTone} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleRewrite}
            disabled={isLoading || isOverLimit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Rewriting...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Rewrite Message
              </>
            )}
          </button>

          {rewrittenText && (
            <div className="bg-slate-50/80 rounded-xl p-5 space-y-3 border border-slate-200/60">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">
                  Rewritten Message
                </label>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-medium text-slate-700 shadow-sm hover:shadow"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-600">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-slate-800 leading-relaxed text-sm">
                {rewrittenText}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-sm text-slate-500">
          Powered by Google Gemini AI
        </div>
      </div>
    </div>
  );
}
