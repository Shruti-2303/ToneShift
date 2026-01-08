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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            ToneShift
          </h1>
          <p className="text-sm text-slate-500">
            Transform your message into any tone in seconds
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className={`w-full h-32 px-3 py-2.5 border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all text-sm placeholder:text-slate-400 text-slate-700 ${
                isOverLimit ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'
              }`}
            />
            <div className={`text-xs mt-1.5 ${isOverLimit ? 'text-red-600' : 'text-slate-400'}`}>
              {charCount} / {charLimit} characters
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">
              Select Tone
            </label>
            <ToneSelector selectedTone={selectedTone} onToneSelect={setSelectedTone} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleRewrite}
            disabled={isLoading || isOverLimit}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
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
            <div className="bg-slate-50 rounded-lg p-4 space-y-2.5 border border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700 uppercase tracking-wide">
                  Rewritten Message
                </label>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-all text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span className="text-slate-600">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white p-3 rounded-md border border-slate-200 text-slate-800 leading-relaxed text-sm">
                {rewrittenText}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          Powered by Google Gemini AI
        </div>
      </div>
    </div>
  );
}
