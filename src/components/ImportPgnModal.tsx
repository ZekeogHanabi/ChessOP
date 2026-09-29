import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { OpeningVariant } from '../types';
import { parseCustomPgnString } from '../utils/pgnParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newVariants: OpeningVariant[]) => void;
}

export const ImportPgnModal: React.FC<Props> = ({ isOpen, onClose, onImport }) => {
  const [repertoireName, setRepertoireName] = useState<string>('');
  const [pgnText, setPgnText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!repertoireName) {
      // Auto-populate repertoire name from filename (e.g., "French Defense.pgn" -> "French Defense")
      const cleanName = file.name.replace(/\.pgn$/i, '').replace(/[-_]/g, ' ');
      setRepertoireName(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPgnText(content);
        validatePgn(content);
      }
    };
    reader.readAsText(file);
  };

  const validatePgn = (text: string) => {
    setError(null);
    try {
      const variants = parseCustomPgnString(text, repertoireName || 'Custom Repertoire');
      if (variants.length === 0) {
        setError('No valid moves or games could be parsed from this PGN.');
        setPreviewCount(null);
      } else {
        setPreviewCount(variants.length);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid format';
      setError(`PGN parse error: ${message}`);
      setPreviewCount(null);
    }
  };

  const handleTextChange = (text: string) => {
    setPgnText(text);
    if (text.trim().length > 10) {
      validatePgn(text);
    } else {
      setPreviewCount(null);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pgnText.trim()) {
      setError('Please provide PGN text or upload a file.');
      return;
    }

    const name = repertoireName.trim() || 'Custom Repertoire';
    try {
      const variants = parseCustomPgnString(pgnText, name);
      if (variants.length === 0) {
        setError('No valid variations found in this PGN.');
        return;
      }

      onImport(variants);
      // Reset form
      setPgnText('');
      setRepertoireName('');
      setPreviewCount(null);
      setError(null);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to import PGN: ${message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Upload size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Import Custom PGN Repertoire</h3>
            <p className="text-xs text-neutral-400">Add your own Lichess studies, ChessBase, or PGN books</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1">
              Repertoire Name
            </label>
            <input
              type="text"
              placeholder="e.g., King's Indian Defense, French Winawer"
              value={repertoireName}
              onChange={(e) => setRepertoireName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-neutral-500">
                PGN Content
              </label>
              <label className="text-[11px] text-brand-primary hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                <FileText size={12} />
                Upload .pgn file
                <input
                  type="file"
                  accept=".pgn,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={6}
              placeholder="Paste your PGN text here (e.g. 1. e4 e6 2. d4 d5 ...)"
              value={pgnText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-lg text-xs font-mono focus:ring-1 focus:ring-brand-primary focus:outline-none"
            />
          </div>

          {previewCount !== null && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-xs font-medium border border-green-200 dark:border-green-900/40">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Ready! Successfully parsed <strong>{previewCount} variations</strong> ready to train.</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-900/40">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!pgnText.trim()}
              className="w-2/3 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/95 disabled:opacity-50 text-white font-bold text-xs shadow transition-all cursor-pointer"
            >
              Import and Save Repertoire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
