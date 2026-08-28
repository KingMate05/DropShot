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
} from 'lucide-react';

import { removeBackground } from '@imgly/background-removal';

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

// Background Import Zone (compact, for the sidebar)
const BackgroundImportZone: React.FC<{
  onImport: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  disabled: boolean;
}> = ({ onImport, isDragging, setIsDragging, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onImport(file);
      }
    },
    [onImport, setIsDragging, disabled]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = '';
  };

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        border-2 border-dashed rounded-xl cursor-pointer
        transition-all duration-200 py-8 px-4 text-center
        ${disabled ? 'opacity-50 cursor-not-allowed border-zinc-800 bg-zinc-900/30' : ''}
        ${!disabled && isDragging ? 'border-violet-400 bg-violet-500/10 scale-[1.02]' : ''}
        ${!disabled && !isDragging ? 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50' : ''}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={handleFileSelect}
      />
      <div
        className={`
          w-14 h-14 mb-3 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${isDragging ? 'bg-violet-500/20 scale-110' : 'bg-zinc-800'}
        `}
      >
        <Upload className={`w-6 h-6 ${isDragging ? 'text-violet-400' : 'text-zinc-400'}`} />
      </div>
      <p className="text-sm font-medium text-white mb-1">
        {isDragging ? 'Déposez l\'image ici' : 'Importer une image de fond'}
      </p>
      <p className="text-xs text-zinc-500">Glissez-déposez ou cliquez pour parcourir</p>
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

// --- Canvas export helpers ---

// Splits a CSS value list on top-level commas only (ignores commas inside parentheses,
// e.g. the ones inside hsl(...) color stops)
function splitTopLevel(str: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of str) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Draws an image onto the canvas following object-fit: cover semantics
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;
  let sx: number, sy: number, sWidth: number, sHeight: number;
  if (imgRatio > canvasRatio) {
    sHeight = img.height;
    sWidth = sHeight * canvasRatio;
    sx = (img.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.width;
    sHeight = sWidth / canvasRatio;
    sx = 0;
    sy = (img.height - sHeight) / 2;
  }
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);
}

// Converts one of our CSS linear-gradient() strings into a CanvasGradient
function buildCanvasGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cssGradient: string
): CanvasGradient {
  const inner = cssGradient.trim().replace(/^linear-gradient\(/, '').replace(/\)$/, '');
  const parts = splitTopLevel(inner);
  const angleMatch = parts[0].match(/(-?\d+(\.\d+)?)deg/);
  const angleDeg = angleMatch ? parseFloat(angleMatch[1]) : 180;
  const stops = angleMatch ? parts.slice(1) : parts;

  const angleRad = ((angleDeg % 360) * Math.PI) / 180;
  const length = Math.abs(width * Math.sin(angleRad)) + Math.abs(height * Math.cos(angleRad));
  const halfX = (Math.sin(angleRad) * length) / 2;
  const halfY = (-Math.cos(angleRad) * length) / 2;
  const cx = width / 2;
  const cy = height / 2;
  const gradient = ctx.createLinearGradient(cx - halfX, cy - halfY, cx + halfX, cy + halfY);

  stops.forEach((stop, i) => {
    const lastSpace = stop.lastIndexOf(' ');
    let color = stop;
    let position = stops.length > 1 ? i / (stops.length - 1) : 0;
    if (lastSpace !== -1) {
      const maybePercent = stop.slice(lastSpace + 1).trim();
      if (maybePercent.endsWith('%')) {
        color = stop.slice(0, lastSpace).trim();
        position = parseFloat(maybePercent) / 100;
      }
    }
    gradient.addColorStop(Math.min(Math.max(position, 0), 1), color);
  });

  return gradient;
}

// Main App Component
const App: React.FC = () => {
  // State
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'import'>('templates');
  const [customBackgrounds, setCustomBackgrounds] = useState<AIGeneratedBackground[]>([]);
  const [isBackgroundDragging, setIsBackgroundDragging] = useState(false);
  const [productSize, setProductSize] = useState(100);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [frameSize, setFrameSize] = useState<{ width: number; height: number } | null>(null);
  const [isDraggingProduct, setIsDraggingProduct] = useState(false);
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; hPos: number; vPos: number } | null>(null);

  // Toast helper
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Upload handler — now automatically removes the background right after import
  const handleUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImage(dataUrl);
        setImageName(file.name);
        setBackgroundRemoved(false);
        setSelectedBackground(null);
        addToast('Image uploaded successfully!', 'success');

        // Read the image's real dimensions so the preview frame can match its ratio
        const probe = new Image();
        probe.onload = () => {
          setImageDimensions({ width: probe.naturalWidth, height: probe.naturalHeight });
        };
        probe.src = dataUrl;

        // Auto-trigger real, in-browser background removal right after import
        setIsRemovingBackground(true);
        removeBackground(file)
          .then((blob) => {
            const transparentUrl = URL.createObjectURL(blob);
            setImage((prev) => {
              if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
              return transparentUrl;
            });
            setBackgroundRemoved(true);
            addToast('Background removed successfully!', 'success');
          })
          .catch((err) => {
            console.error('Background removal failed:', err);
            addToast("Couldn't remove the background. Please try again.", 'error');
          })
          .finally(() => {
            setIsRemovingBackground(false);
          });
      };
      reader.readAsDataURL(file);
    },
    [addToast]
  );

  // Fit the preview frame to the available space while keeping the image's own aspect ratio
  const computeFrameSize = useCallback(() => {
    if (!imageDimensions || !previewAreaRef.current) return;
    const container = previewAreaRef.current.getBoundingClientRect();
    const padding = 16;
    const maxWidth = Math.max(container.width - padding * 2, 1);
    const maxHeight = Math.max(container.height - padding * 2, 1);
    const imageRatio = imageDimensions.width / imageDimensions.height;
    const containerRatio = maxWidth / maxHeight;

    let width: number;
    let height: number;

    if (imageRatio > containerRatio) {
      width = maxWidth;
      height = maxWidth / imageRatio;
    } else {
      height = maxHeight;
      width = maxHeight * imageRatio;
    }

    setFrameSize({ width, height });
  }, [imageDimensions]);

  useEffect(() => {
    computeFrameSize();
    window.addEventListener('resize', computeFrameSize);
    return () => window.removeEventListener('resize', computeFrameSize);
  }, [computeFrameSize]);

  // Ctrl/Cmd + scroll (or trackpad pinch, which browsers report the same way) over the
  // preview zooms the product instead of zooming the whole page. Needs a native listener
  // with { passive: false } — React's onWheel is passive by default, so preventDefault()
  // there would be silently ignored.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !image || !backgroundRemoved) return;

    const handleWheelZoom = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setProductSize((prev) => {
        const next = prev - e.deltaY * 0.5;
        return Math.min(150, Math.max(50, Math.round(next)));
      });
    };

    el.addEventListener('wheel', handleWheelZoom, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelZoom);
  }, [image, backgroundRemoved]);

  // Drag-to-position: grab the product, move it, release to drop it in place
  const handleProductPointerDown = useCallback(
    (e: React.PointerEvent<HTMLImageElement>) => {
      if (!image || !backgroundRemoved) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        hPos: horizontalPosition,
        vPos: verticalPosition,
      };
      setIsDraggingProduct(true);
    },
    [image, backgroundRemoved, horizontalPosition, verticalPosition]
  );

  const handleProductPointerMove = useCallback(
    (e: React.PointerEvent<HTMLImageElement>) => {
      if (!dragStartRef.current || !frameSize) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const dHorizontal = (dx / frameSize.width) * 100;
      const dVertical = (dy / frameSize.height) * 100;
      const newH = Math.min(100, Math.max(0, dragStartRef.current.hPos + dHorizontal));
      const newV = Math.min(100, Math.max(0, dragStartRef.current.vPos + dVertical));
      setHorizontalPosition(Math.round(newH));
      setVerticalPosition(Math.round(newV));
    },
    [frameSize]
  );

  const handleProductPointerUp = useCallback((e: React.PointerEvent<HTMLImageElement>) => {
    if (dragStartRef.current && (e.currentTarget as HTMLElement).hasPointerCapture?.(e.pointerId)) {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
    dragStartRef.current = null;
    setIsDraggingProduct(false);
  }, []);

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

  // Import a custom background image from the user's computer
  const handleImportBackground = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        addToast('Please choose an image file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const bgValue = `url(${dataUrl}) center/cover no-repeat`;
        setCustomBackgrounds((prev) => [{ id: `custom-${Date.now()}`, gradient: bgValue }, ...prev]);
        setSelectedBackground(bgValue);
        addToast('Background imported!', 'success');
      };
      reader.readAsDataURL(file);
    },
    [addToast]
  );

  // Download — composites the product + chosen background onto a canvas and saves a PNG
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!image || !selectedBackground || !imageDimensions || !frameSize) return;

    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = imageDimensions.width;
      canvas.height = imageDimensions.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Background layer
      if (selectedBackground.includes('url(')) {
        const urlMatch = selectedBackground.match(/url\(([^)]+)\)/);
        const bgUrl = urlMatch ? urlMatch[1].replace(/['"]/g, '') : null;
        if (bgUrl) {
          const bgImg = await loadImageElement(bgUrl);
          drawImageCover(ctx, bgImg, canvas.width, canvas.height);
        }
      } else if (selectedBackground.includes('gradient')) {
        ctx.fillStyle = buildCanvasGradient(ctx, canvas.width, canvas.height, selectedBackground);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Product layer — mirrors the on-screen translate + scale, in real image pixels
      const productImg = await loadImageElement(image);
      const scaleFactor = imageDimensions.width / frameSize.width;
      const translateX = ((horizontalPosition - 50) / 100) * frameSize.width * scaleFactor;
      const translateY = ((verticalPosition - 50) / 100) * frameSize.height * scaleFactor;

      ctx.save();
      ctx.translate(canvas.width / 2 + translateX, canvas.height / 2 + translateY);
      ctx.scale(productSize / 100, productSize / 100);
      ctx.drawImage(
        productImg,
        -imageDimensions.width / 2,
        -imageDimensions.height / 2,
        imageDimensions.width,
        imageDimensions.height
      );
      ctx.restore();

      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Export failed');

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = (imageName || 'product').replace(/\.[^/.]+$/, '');
      link.href = downloadUrl;
      link.download = `${safeName}-dropshot.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      addToast('Image exported successfully!', 'success');
    } catch (err) {
      console.error('Export failed:', err);
      addToast("Couldn't export the image. Please try again.", 'error');
    } finally {
      setIsExporting(false);
    }
  }, [
    image,
    selectedBackground,
    imageDimensions,
    frameSize,
    horizontalPosition,
    verticalPosition,
    productSize,
    imageName,
    addToast,
  ]);

  // Clear image
  const handleClearImage = useCallback(() => {
    setImage((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    setImageName('');
    setBackgroundRemoved(false);
    setSelectedBackground(null);
    setAiBackgrounds([]);
    setProductSize(100);
    setVerticalPosition(50);
    setHorizontalPosition(50);
    setImageDimensions(null);
    setFrameSize(null);
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
        </div>
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
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium whitespace-nowrap flex items-center justify-center gap-1.5 transition-all duration-200 ${activeTab === 'import' ? 'bg-violet-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              onClick={() => setActiveTab('import')}
            >
              <Upload className="w-3.5 h-3.5" />
              Importer une image
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
                <BackgroundImportZone
                  onImport={handleImportBackground}
                  isDragging={isBackgroundDragging}
                  setIsDragging={setIsBackgroundDragging}
                  disabled={!image || !backgroundRemoved}
                />

                {/* Imported backgrounds */}
                {customBackgrounds.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <span className="text-xs text-zinc-400 font-medium">Fonds importés</span>
                    <div className="grid grid-cols-3 gap-2">
                      {customBackgrounds.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => image && backgroundRemoved && setSelectedBackground(bg.gradient)}
                          disabled={!image || !backgroundRemoved}
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
          <div ref={previewAreaRef} className="flex-1 p-6 flex items-center justify-center">
            {image ? (
              <div
                ref={frameRef}
                className="relative"
                style={{
                  width: frameSize ? `${frameSize.width}px` : '100%',
                  height: frameSize ? `${frameSize.height}px` : '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  transition: 'width 0.2s ease, height 0.2s ease',
                }}
              >
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
                      Preview
                    </div>
                  </div>

                  {/* Removing Background Overlay */}
                  {isRemovingBackground && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" />
                      <span className="text-sm font-medium">Removing background...</span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <img
                      src={image}
                      alt={imageName}
                      draggable={false}
                      onPointerDown={handleProductPointerDown}
                      onPointerMove={handleProductPointerMove}
                      onPointerUp={handleProductPointerUp}
                      onPointerCancel={handleProductPointerUp}
                      className="max-w-full max-h-full object-contain select-none"
                      style={{
                        transform: `translate(${((horizontalPosition - 50) / 100) * (frameSize?.width ?? 0)}px, ${((verticalPosition - 50) / 100) * (frameSize?.height ?? 0)}px) scale(${productSize / 100})`,
                        transition: isDraggingProduct ? 'none' : 'transform 0.2s ease',
                        cursor: !image || !backgroundRemoved ? 'default' : isDraggingProduct ? 'grabbing' : 'grab',
                        touchAction: 'none',
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
                  Removing the background...
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
              disabled={!image || !selectedBackground || isExporting}
              className={`
                w-full py-3 px-4 rounded-xl font-medium text-sm
                flex items-center justify-center gap-2
                transition-all duration-200
                ${!image || !selectedBackground || isExporting
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20'
                }
              `}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-500/30 border-t-zinc-300 rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Image
                </>
              )}
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
