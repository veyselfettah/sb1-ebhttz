import React, { useState } from 'react';
import { X, Volume2, Vibrate, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { Dhikr } from '../data/dhikrs';

interface EditDhikrModalProps {
  dhikr: Dhikr;
  onClose: () => void;
  onUpdate: (dhikr: Dhikr) => void;
}

export default function EditDhikrModal({ dhikr, onClose, onUpdate }: EditDhikrModalProps) {
  const [form, setForm] = useState({
    title: dhikr.title,
    arabicText: dhikr.arabicText,
    meaning: dhikr.meaning,
    target: dhikr.target?.toString() || '33',
    countDirection: dhikr.countDirection || 'up',
    vibrateNearEnd: dhikr.vibrateNearEnd ?? true,
    soundOnComplete: dhikr.soundOnComplete ?? true,
    resetPeriod: dhikr.resetPeriod || 'daily',
    vibrateThreshold: dhikr.vibrateThreshold?.toString() || '3'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...dhikr,
      title: form.title,
      arabicText: form.arabicText,
      meaning: form.meaning,
      target: parseInt(form.target),
      startValue: form.countDirection === 'up' ? 0 : parseInt(form.target),
      countDirection: form.countDirection as 'up' | 'down',
      vibrateNearEnd: form.vibrateNearEnd,
      soundOnComplete: form.soundOnComplete,
      resetPeriod: form.resetPeriod as 'daily' | 'weekly',
      vibrateThreshold: parseInt(form.vibrateThreshold)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md text-gray-100 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold">Zikir Düzenle</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Zikir Adı</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Arapça Metin</label>
              <input
                type="text"
                required
                value={form.arabicText}
                onChange={e => setForm(prev => ({ ...prev, arabicText: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-arabic"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Anlamı</label>
              <input
                type="text"
                required
                value={form.meaning}
                onChange={e => setForm(prev => ({ ...prev, meaning: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hedef Sayı</label>
              <input
                type="number"
                required
                min="1"
                value={form.target}
                onChange={e => setForm(prev => ({ ...prev, target: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sayaç Yönü</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.countDirection === 'up'}
                    onChange={() => setForm(prev => ({ ...prev, countDirection: 'up' }))}
                    className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-700 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1">
                    <ArrowUp className="w-4 h-4" /> Artan
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.countDirection === 'down'}
                    onChange={() => setForm(prev => ({ ...prev, countDirection: 'down' }))}
                    className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-700 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1">
                    <ArrowDown className="w-4 h-4" /> Azalan
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sıfırlama Periyodu</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.resetPeriod === 'daily'}
                    onChange={() => setForm(prev => ({ ...prev, resetPeriod: 'daily' }))}
                    className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-700 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Günlük
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.resetPeriod === 'weekly'}
                    onChange={() => setForm(prev => ({ ...prev, resetPeriod: 'weekly' }))}
                    className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-700 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Haftalık
                  </span>
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.vibrateNearEnd}
                    onChange={e => setForm(prev => ({ ...prev, vibrateNearEnd: e.target.checked }))}
                    className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-700 rounded focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Vibrate className="w-4 h-4" /> Zikir Bitimine Yakın Titreşim
                  </span>
                </label>
              </div>
              {form.vibrateNearEnd && (
                <div className="flex gap-2 ml-6">
                  <input
                    type="number"
                    min="1"
                    value={form.vibrateThreshold}
                    onChange={e => setForm(prev => ({ ...prev, vibrateThreshold: e.target.value }))}
                    className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <span className="text-sm text-gray-400 self-center">sayı kaldığında titret</span>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.soundOnComplete}
                  onChange={e => setForm(prev => ({ ...prev, soundOnComplete: e.target.checked }))}
                  className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-700 rounded focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4" /> Bitişte Ses Çal
                </span>
              </label>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-800">
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              form="dhikr-form"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}