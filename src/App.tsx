import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Download,
  Trash2,
  X,
  Check,
  Settings,
  Layers,
  Wand2,
  Crown,
} from 'lucide-react';

import bg1 from './assets/img/bg1.jfif';
import bg2 from './assets/img/bg2.jpg';
import bg3 from './assets/img/bg3.jpg';
import bg4 from './assets/img/bg4.jpg';


// Types
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AIGeneratedBackground {
  id: string;
  gradient: string;
}

// Toast Component
const ToastNotification: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        animate-[slideIn_0.3s_ease-out] backdrop-blur-sm
        ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : ''}
        ${toast.type === 'info' ? 'bg-violet-500/90 text-white' : ''}
        ${toast.type === 'error' ? 'bg-red-500/90 text-white' : ''}
      `}
    >
      {toast.type === 'success' && <Check className="w-5 h-5" />}
      {toast.type === 'info' && <Sparkles className="w-5 h-5" />}
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="ml-2 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Upload Zone Component
const UploadZone: React.FC<{
  onUpload: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}> = ({ onUpload, isDragging, setIsDragging }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onUpload(file);
      }
    },
    [onUpload, setIsDragging]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div
      className={`
        relative h-full flex flex-col items-center justify-center
        border-2 border-dashed rounded-2xl cursor-pointer
        transition-all duration-200
        ${isDragging ? 'border-violet-400 bg-violet-500/10 scale-[1.02]' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className="p-8 text-center">
        <div
          className={`
          w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center
          transition-all duration-200
          ${isDragging ? 'bg-violet-500/20 scale-110' : 'bg-zinc-800'}
        `}
        >
          <Upload className={`w-8 h-8 ${isDragging ? 'text-violet-400' : 'text-zinc-400'}`} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {isDragging ? 'Drop your image here' : 'Drop your product image'}
        </h3>
        <p className="text-zinc-400 text-sm mb-4">
          or click to browse from your computer
        </p>
        <p className="text-zinc-500 text-xs">PNG, JPG, WEBP up to 10MB</p>
      </div>
    </div>
  );
};

// Template Background
const templates = [
  { id: 'studio', name: 'Studio White', gradient: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)' },
  { id: 'golden', name: 'Golden Hour', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  {
    id: 'neon-studio',
    name: 'Neon Studio',
    gradient: `url(${bg1}) center/cover no-repeat`
  },
  {
    id: 'beach',
    name: 'Beach Vibes',
    gradient: `url(${bg2}) center/cover no-repeat`
  },
  { id: 'dark', name: 'Dark Luxe', gradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' },
  { id: 'nature', name: 'Nature', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'cafe', name: 'Lifestyle Cafe', gradient: 'linear-gradient(135deg, #d4a574 0%, #8b5a2b 100%)' },
  { id: 'pastel', name: 'Pastel Dream', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  {
    id: 'neon-studio',
    name: 'Neon Studio',
    gradient: `url(${bg3}) center/cover no-repeat`
  },
  {
    id: 'beach',
    name: 'Beach Vibes',
    gradient: `url(${bg4}) center/cover no-repeat`
  },
];

// Transparent Background Pattern (checkerboard)
const checkerboardPattern = `
  repeating-conic-gradient(
    #808080 0% 25%,
    #ffffff 0% 50%
  ) 50% / 20px 20px
`;

// Main App Component
const App: React.FC = () => {
  // State
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'ai'>('templates');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiBackgrounds, setAiBackgrounds] = useState<AIGeneratedBackground[]>([]);
  const [productSize, setProductSize] = useState(100);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast helper
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Upload handler
  const handleUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImageName(file.name);
        setBackgroundRemoved(false);
        setSelectedBackground(null);
        addToast('Image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    },
    [addToast]
  );

  // Paste handler (Gestion du Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // On récupère les éléments du presse-papiers
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        // On cherche si un des éléments est une image
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            // On génère un nom par défaut si l'image collée n'en a pas
            const pastedFile = new File([file], file.name || `pasted-image-${Date.now()}.png`, {
              type: file.type,
            });

            handleUpload(pastedFile);
            break; // On a trouvé l'image, on arrête la boucle
          }
        }
      }
    };

    // On écoute l'événement sur toute la page
    window.addEventListener('paste', handlePaste);

    // Nettoyage de l'écouteur quand le composant se démonte
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handleUpload]);

  // Remove background
  const handleRemoveBackground = useCallback(() => {
    setIsRemovingBackground(true);
    setTimeout(() => {
      setIsRemovingBackground(false);
      setBackgroundRemoved(true);
      addToast('Background removed successfully!', 'success');
    }, 2000);
  }, [addToast]);

  // Generate AI backgrounds
  const handleGenerateAI = useCallback(() => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      // Generate mock AI backgrounds based on prompt
      const gradients = [
        `linear-gradient(135deg, hsl(${Math.random() * 360}, 70%, 60%) 0%, hsl(${Math.random() * 360}, 70%, 40%) 100%)`,
        `linear-gradient(180deg, hsl(${Math.random() * 360}, 50%, 70%) 0%, hsl(${Math.random() * 360}, 80%, 30%) 100%)`,
        `linear-gradient(45deg, hsl(${Math.random() * 360}, 60%, 50%) 0%, hsl(${Math.random() * 360}, 70%, 50%) 100%)`,
      ];
      setAiBackgrounds(
        gradients.map((g, i) => ({
          id: `ai-${i}`,
          gradient: g,
        }))
      );
      setIsGenerating(false);
      addToast('Backgrounds generated!', 'info');
    }, 3000);
  }, [aiPrompt, addToast]);

  // Download mock
  const handleDownload = useCallback(() => {
    addToast('Image exported successfully!', 'success');
  }, [addToast]);

  // Clear image
  const handleClearImage = useCallback(() => {
    setImage(null);
    setImageName('');
    setBackgroundRemoved(false);
    setSelectedBackground(null);
    setAiBackgrounds([]);
    setProductSize(100);
    setVerticalPosition(50);
    setHorizontalPosition(50);
    addToast('Image removed', 'info');
  }, [addToast]);

  return (
    <div className="h-screen bg-[#0f0f0f] text-white flex flex-col overflow-hidden">      {/* Header */}
      <header className="h-16 bg-[#111] border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">DropShot</span>
          <span className="px-2 py-0.5 text-xs font-medium bg-violet-500/20 text-violet-400 rounded-full border border-violet-500/30">
            Beta
          </span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30">
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Backgrounds Panel */}
        <aside className="w-full sm:w-80 md:w-96 min-w-[320px] max-w-[400px] bg-[#1a1a1a] border-r border-zinc-800 flex flex-col shrink-0 h-full overflow-hidden">          <div className="p-4 border-b border-zinc-800 shrink-0">            <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-violet-400" />
          <span className="font-semibold">Backgrounds</span>
        </div>

          {/* Onglets fixes */}
          <div className="flex flex-row items-center justify-between bg-zinc-900 rounded-lg p-1 w-full shrink-0">
            <button
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium whitespace-nowrap text-center transition-all duration-200 ${activeTab === 'templates' ? 'bg-violet-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium whitespace-nowrap flex items-center justify-center gap-1.5 transition-all duration-200 ${activeTab === 'ai' ? 'bg-violet-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              onClick={() => setActiveTab('ai')}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Generate AI
            </button>
          </div>
        </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'templates' ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">                {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() =>
                    image && backgroundRemoved && setSelectedBackground(template.gradient)
                  }
                  disabled={!image || !backgroundRemoved}
                  className={`
                      aspect-square rounded-xl overflow-hidden relative group
                      transition-all duration-200
                      ${!image || !backgroundRemoved
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 cursor-pointer'
                    }
                      ${selectedBackground === template.gradient
                      ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-[#1a1a1a]'
                      : ''
                    }
                    `}
                  style={{ background: template.gradient }}
                >
                  <div
                    className={`
                        absolute inset-0 bg-black/0 group-hover:bg-black/20
                        transition-all duration-200 flex items-end
                      `}
                  >
                    <div className="w-full p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-xs text-white font-medium">{template.name}</span>
                    </div>
                  </div>
                  {selectedBackground === template.gradient && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the ambiance you want...&#10;&#10;e.g., 'Sunset beach vibes with warm orange tones'"
                    className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-violet-500 transition-colors duration-200"
                    disabled={!image || !backgroundRemoved}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-zinc-500">
                    {aiPrompt.length}/500
                  </div>
                </div>
                <button
                  onClick={handleGenerateAI}
                  disabled={!image || !backgroundRemoved || !aiPrompt.trim() || isGenerating}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium text-sm
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    ${!image || !backgroundRemoved || !aiPrompt.trim()
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20'
                    }
                  `}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>

                {/* AI Generated Results */}
                {aiBackgrounds.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <span className="text-xs text-zinc-400 font-medium">Generated backgrounds</span>
                    <div className="grid grid-cols-3 gap-2">
                      {aiBackgrounds.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => setSelectedBackground(bg.gradient)}
                          className={`
                            aspect-square rounded-lg overflow-hidden
                            transition-all duration-200 hover:scale-105
                            ${selectedBackground === bg.gradient
                              ? 'ring-2 ring-violet-500'
                              : ''
                            }
                          `}
                          style={{ background: bg.gradient }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Center - Preview Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 flex items-center justify-center">
            {image ? (
              <div className="relative w-full h-full max-w-4xl">
                {/* Preview Container */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    background: selectedBackground
                      ? selectedBackground
                      : backgroundRemoved
                        ? checkerboardPattern
                        : '#1a1a1a',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* Marketing Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-xs font-medium">
                      <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                      Marketing Preview
                    </div>
                  </div>

                  {/* Remove Background Button */}
                  {!backgroundRemoved && !isRemovingBackground && (
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={handleRemoveBackground}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Background
                      </button>
                    </div>
                  )}

                  {/* Removing Background Overlay */}
                  {isRemovingBackground && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" />
                      <span className="text-sm font-medium">Removing background...</span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img
                      src={image}
                      alt={imageName}
                      className="max-w-full max-h-full object-contain transition-all duration-200"
                      style={{
                        transform: `scale(${productSize / 100}) translate(${(horizontalPosition - 50) * 2}px, ${(verticalPosition - 50) * 2}px)`,
                      }}
                    />
                  </div>
                </div>

                {/* Clear Image Button */}
                <button
                  onClick={handleClearImage}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-zinc-800 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-200 z-20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full h-full max-w-2xl">
                <UploadZone
                  onUpload={handleUpload}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                />
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          {image && (
            <div className="h-14 bg-[#111] border-t border-zinc-800 flex items-center justify-between px-6">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <ImageIcon className="w-4 h-4" />
                <span className="text-xs font-medium truncate max-w-[200px]">{imageName}</span>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Controls */}
        <aside className="w-72 bg-[#1a1a1a] border-l border-zinc-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-violet-400" />
              <span className="font-semibold">Controls</span>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-6">
            {/* Product Size Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-400">Product Size</label>
                <span className="text-sm font-medium text-white">{productSize}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={productSize}
                onChange={(e) => setProductSize(Number(e.target.value))}
                disabled={!image}
                className={`
                  w-full h-2 rounded-full appearance-none cursor-pointer
                  bg-zinc-700 [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-violet-500/30
                  [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                  ${!image ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>50%</span>
                <span>150%</span>
              </div>
            </div>

            {/* Vertical Position Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-400">Vertical Position</label>
                <span className="text-sm font-medium text-white">{verticalPosition}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={verticalPosition}
                onChange={(e) => setVerticalPosition(Number(e.target.value))}
                disabled={!image}
                className={`
                  w-full h-2 rounded-full appearance-none cursor-pointer
                  bg-zinc-700 [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-violet-500/30
                  [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                  ${!image ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Top</span>
                <span>Bottom</span>
              </div>
            </div>

            {/* Horizontal Position Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-400">Horizontal Position</label>
                <span className="text-sm font-medium text-white">{horizontalPosition}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={horizontalPosition}
                onChange={(e) => setHorizontalPosition(Number(e.target.value))}
                disabled={!image}
                className={`
                  w-full h-2 rounded-full appearance-none cursor-pointer
                  bg-zinc-700 [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-violet-500/30
                  [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                  ${!image ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Left</span>
                <span>Right</span>
              </div>
            </div>

            {/* Status */}
            {image && !backgroundRemoved && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-400">
                  Remove the background to unlock templates and AI generation
                </p>
              </div>
            )}

            {image && backgroundRemoved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-xs text-emerald-400">
                  Background removed! Now choose a new background.
                </p>
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={handleDownload}
              disabled={!image || !selectedBackground}
              className={`
                w-full py-3 px-4 rounded-xl font-medium text-sm
                flex items-center justify-center gap-2
                transition-all duration-200
                ${!image || !selectedBackground
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20'
                }
              `}
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>
        </aside>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default App;
