import React, { useState, useEffect } from 'react';
import { Moon, Plus, GripVertical, Archive, Settings, Trash2 } from 'lucide-react';
import DhikrCounter from './components/DhikrCounter';
import AddDhikrModal from './components/AddDhikrModal';
import EditDhikrModal from './components/EditDhikrModal';
import { dhikrs as initialDhikrs, Dhikr } from './data/dhikrs';

function App() {
  const [dhikrs, setDhikrs] = useState<Dhikr[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedDhikrs = initialDhikrs.map(dhikr => {
      if (dhikr.lastReset !== today) {
        return { ...dhikr, lastReset: today };
      }
      return dhikr;
    });
    return savedDhikrs;
  });

  const [archivedDhikrs, setArchivedDhikrs] = useState<Dhikr[]>([]);
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDhikr, setEditingDhikr] = useState<Dhikr | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [draggedDhikr, setDraggedDhikr] = useState<Dhikr | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toISOString().split('T')[0];
      setDhikrs(prev => prev.map(dhikr => {
        if (dhikr.lastReset !== today) {
          return { ...dhikr, lastReset: today };
        }
        return dhikr;
      }));
    };

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(checkDailyReset, timeUntilMidnight);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (!selectedDhikr) return;
    const currentIndex = dhikrs.findIndex(d => d.id === selectedDhikr.id);
    const nextIndex = (currentIndex + 1) % dhikrs.length;
    setSelectedDhikr(dhikrs[nextIndex]);
  };

  const handleAddDhikr = (newDhikr: Omit<Dhikr, 'id'>) => {
    const dhikr: Dhikr = {
      ...newDhikr,
      id: Math.max(...dhikrs.map(d => d.id), 0) + 1,
      lastReset: new Date().toISOString().split('T')[0]
    };
    setDhikrs(prev => [...prev, dhikr]);
  };

  const handleUpdateDhikr = (updatedDhikr: Dhikr) => {
    setDhikrs(prev => prev.map(d => d.id === updatedDhikr.id ? updatedDhikr : d));
    setEditingDhikr(null);
  };

  const handleArchiveDhikr = (dhikr: Dhikr) => {
    setDhikrs(prev => prev.filter(d => d.id !== dhikr.id));
    setArchivedDhikrs(prev => [...prev, dhikr]);
  };

  const handleDeleteDhikr = (dhikr: Dhikr) => {
    setDhikrs(prev => prev.filter(d => d.id !== dhikr.id));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (dhikr: Dhikr) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleDeleteDhikr(dhikr);
    } else if (isRightSwipe) {
      handleArchiveDhikr(dhikr);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleDragStart = (e: React.DragEvent, dhikr: Dhikr) => {
    setDraggedDhikr(dhikr);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetDhikr: Dhikr) => {
    e.preventDefault();
    if (!draggedDhikr || draggedDhikr.id === targetDhikr.id) return;

    const newDhikrs = [...dhikrs];
    const draggedIndex = newDhikrs.findIndex(d => d.id === draggedDhikr.id);
    const targetIndex = newDhikrs.findIndex(d => d.id === targetDhikr.id);
    
    newDhikrs.splice(draggedIndex, 1);
    newDhikrs.splice(targetIndex, 0, draggedDhikr);
    
    setDhikrs(newDhikrs);
  };

  const handleDragEnd = () => {
    setDraggedDhikr(null);
  };

  if (selectedDhikr) {
    return (
      <DhikrCounter
        title={selectedDhikr.arabicText}
        target={selectedDhikr.target}
        isDescending={selectedDhikr.countDirection === 'down'}
        vibrationEnabled={selectedDhikr.vibrateNearEnd}
        soundEnabled={selectedDhikr.soundOnComplete}
        onNext={handleNext}
        onBack={() => setSelectedDhikr(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-semibold text-gray-800">Dijital Zikirmatik</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Archive className={`w-5 h-5 ${showArchive ? 'text-emerald-600' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Zikir Ekle
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {showArchive ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Arşivlenmiş Zikirler</h2>
            {archivedDhikrs.map(dhikr => (
              <div
                key={dhikr.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-white hover:shadow-md transition-all"
              >
                <div className="text-gray-400">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-arabic mb-1">{dhikr.arabicText}</div>
                  <div className="font-medium">{dhikr.title}</div>
                  <div className="text-sm text-gray-600">{dhikr.meaning}</div>
                </div>
                <button
                  onClick={() => {
                    setArchivedDhikrs(prev => prev.filter(d => d.id !== dhikr.id));
                    setDhikrs(prev => [...prev, dhikr]);
                  }}
                  className="px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Geri Al
                </button>
              </div>
            ))}
            {archivedDhikrs.length === 0 && (
              <p className="text-center text-gray-500 py-8">Arşivlenmiş zikir bulunmuyor</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {dhikrs.map(dhikr => (
              <div
                key={dhikr.id}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd(dhikr)}
                draggable
                onDragStart={(e) => handleDragStart(e, dhikr)}
                onDragOver={(e) => handleDragOver(e, dhikr)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-3 p-4 rounded-xl bg-white hover:shadow-md transition-all"
              >
                <div className="text-gray-400 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <button
                  onClick={() => setSelectedDhikr(dhikr)}
                  className="flex-1 text-left"
                >
                  <div className="text-2xl font-arabic mb-1">{dhikr.arabicText}</div>
                  <div className="font-medium">{dhikr.title}</div>
                  <div className="text-sm text-gray-600">{dhikr.meaning}</div>
                  {dhikr.target && (
                    <div className="text-sm text-emerald-600 mt-1">
                      Hedef: {dhikr.target}
                    </div>
                  )}
                </button>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleArchiveDhikr(dhikr)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Archive className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setEditingDhikr(dhikr)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteDhikr(dhikr)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-center text-gray-600">
        <p>Daha fazla sevap kazanmak için zikretmeye devam edin 🤲</p>
      </footer>

      {showAddModal && (
        <AddDhikrModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDhikr}
        />
      )}

      {editingDhikr && (
        <EditDhikrModal
          dhikr={editingDhikr}
          onClose={() => setEditingDhikr(null)}
          onUpdate={handleUpdateDhikr}
        />
      )}
    </div>
  );
}

export default App;