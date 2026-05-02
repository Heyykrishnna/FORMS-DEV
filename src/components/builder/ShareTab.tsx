import React, { useState, useRef, useEffect } from 'react';
import { FormData } from '@/types/form';
import { Copy, Check, Code, QrCode, Share2, Linkedin, Download, Mail, Link as LinkIcon, Sparkles, Settings2, Image as ImageIcon } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import QRCodeStyling, { DotType, CornerSquareType } from 'qr-code-styling';
import { cn } from '@/lib/utils';

interface Props {
  form: FormData;
}

const ShareTab = ({ form }: Props) => {
  const [copied, setCopied] = useState<string | null>(null);
  
  const [qrOptions, setQrOptions] = useState({
    dotsType: 'rounded' as DotType,
    cornersType: 'extra-rounded' as CornerSquareType,
    fgColor: '#ffffff',
    bgColor: '#121316',
    image: '',
  });

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  const formUrl = `${window.location.origin}/form/${form.id}`;
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0" style="border: none; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.1);"></iframe>`;

  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 240,
      height: 240,
      type: 'svg',
      data: formUrl,
      margin: 10,
      dotsOptions: { color: qrOptions.fgColor, type: qrOptions.dotsType },
      cornersSquareOptions: { type: qrOptions.cornersType, color: qrOptions.fgColor },
      backgroundOptions: { color: qrOptions.bgColor },
      image: qrOptions.image,
      imageOptions: { crossOrigin: 'anonymous', margin: 10, imageSize: 0.4 }
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCodeRef.current.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update({
        data: formUrl,
        dotsOptions: { color: qrOptions.fgColor, type: qrOptions.dotsType },
        cornersSquareOptions: { type: qrOptions.cornersType, color: qrOptions.fgColor },
        backgroundOptions: { color: qrOptions.bgColor },
        image: qrOptions.image,
      });
    }
  }, [qrOptions, formUrl]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareSocial = (platform: 'twitter' | 'whatsapp' | 'linkedin' | 'email') => {
    const messages = [
      `Just crafted something epic with Aqora! Check it out: ${form.title}`,
      `A little something special I made... ${form.title}`,
      `Eyes on this! ${form.title} — let me know what you think!`,
    ];
    const text = messages[Math.floor(Math.random() * messages.length)];
    const urls = {
      twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(formUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + formUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(formUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(form.title)}&body=${encodeURIComponent(text + '\n\n' + formUrl)}`,
    };
    window.open(urls[platform], '_blank');
  };

  const downloadQR = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({ name: `${form.title}-qr`, extension: 'png' });
    }
  };

  return (
    <div className="min-h-full font-sans bg-[#0c0d0f] text-white">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        
        {/* Header */}
        <div className="mb-10">
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-3 font-sans flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Distribution
          </h4>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Share & Publish</h2>
          <p className="text-white/40 text-sm max-w-2xl font-light">
            Distribute your protocol securely. Use direct links, generate dynamic QR codes, or seamlessly embed the interface into your existing architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Links & Social */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Direct Link */}
            <div className="relative border border-white/5 bg-[#121316]/50 p-6 rounded-xl overflow-hidden backdrop-blur-sm group">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-20" />
              <div className="relative z-10">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4 flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5" /> Direct Link
                </label>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg p-1.5 backdrop-blur-md">
                  <input
                    readOnly
                    value={formUrl}
                    className="flex-1 bg-transparent text-sm text-white/80 px-3 outline-none font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(formUrl, 'link')}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2"
                  >
                    {copied === 'link' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === 'link' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Social Share */}
            <div className="relative border border-white/5 bg-[#121316]/50 p-6 rounded-xl overflow-hidden backdrop-blur-sm group">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-20" />
              <div className="relative z-10">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Network Distribution
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => shareSocial('twitter')}
                    className="border border-white/5 bg-white/5 p-4 rounded-lg flex flex-col items-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <FaXTwitter className="h-5 w-5 text-white/70" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/60">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareSocial('whatsapp')}
                    className="border border-white/5 bg-white/5 p-4 rounded-lg flex flex-col items-center gap-3 hover:bg-green-500/20 hover:border-green-500/30 transition-all hover:text-green-400"
                  >
                    <FaWhatsapp className="h-5 w-5 text-white/70" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/60">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => shareSocial('linkedin')}
                    className="border border-white/5 bg-white/5 p-4 rounded-lg flex flex-col items-center gap-3 hover:bg-blue-600/20 hover:border-blue-600/30 transition-all hover:text-blue-400"
                  >
                    <Linkedin className="h-5 w-5 text-white/70" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/60">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => shareSocial('email')}
                    className="border border-white/5 bg-white/5 p-4 rounded-lg flex flex-col items-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <Mail className="h-5 w-5 text-white/70" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/60">Email</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Embed */}
            <div className="relative border border-white/5 bg-[#121316]/50 p-6 rounded-xl overflow-hidden backdrop-blur-sm group">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-20" />
              <div className="relative z-10 flex flex-col h-full">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4 flex items-center gap-2">
                  <Code className="w-3.5 h-3.5" /> Architecture Embed
                </label>
                <div className="bg-black/40 border border-white/10 rounded-lg p-4 mb-4 backdrop-blur-md">
                  <textarea
                    readOnly
                    value={embedCode}
                    rows={4}
                    className="w-full bg-transparent text-xs text-white/60 outline-none font-mono resize-none leading-relaxed"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(embedCode, 'embed')}
                  className="w-full bg-white text-black px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                >
                  {copied === 'embed' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'embed' ? 'Snippet Copied' : 'Copy Embed Snippet'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: QR Code Studio */}
          <div className="lg:col-span-5 relative border border-white/5 bg-[#121316]/50 rounded-xl overflow-hidden backdrop-blur-sm flex flex-col">
             <div className="absolute inset-0 bg-[radial-gradient(rgba(49,91,232,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-50" />
             <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#315be8]/50 to-transparent" />
             
             <div className="relative z-10 p-6 flex flex-col h-full">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#315be8] mb-6 flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5" /> QR Code Studio
                </label>

                {/* Visualizer */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] mb-8 relative">
                   {/* Decorative corner elements */}
                   <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#315be8]/40 rounded-tl-lg" />
                   <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#315be8]/40 rounded-tr-lg" />
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#315be8]/40 rounded-bl-lg" />
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#315be8]/40 rounded-br-lg" />
                   
                   <div 
                      ref={qrRef} 
                      className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md"
                    />
                </div>

                {/* Customizer Controls */}
                <div className="space-y-5 bg-black/30 p-5 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2 mb-2">
                     <Settings2 className="w-3.5 h-3.5 text-white/50" />
                     <span className="text-xs font-medium text-white/70">Configuration</span>
                   </div>
                   
                   {/* Options Grid */}
                   <div className="grid grid-cols-2 gap-4">
                     {/* Style */}
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-white/40">Pattern</label>
                        <select 
                          value={qrOptions.dotsType}
                          onChange={(e) => setQrOptions({...qrOptions, dotsType: e.target.value as DotType})}
                          className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-xs text-white outline-none focus:border-[#315be8]/50"
                        >
                          <option value="square">Square</option>
                          <option value="dots">Dots</option>
                          <option value="rounded">Rounded</option>
                          <option value="classy">Classy</option>
                          <option value="classy-rounded">Classy Rounded</option>
                          <option value="extra-rounded">Extra Rounded</option>
                        </select>
                     </div>

                     {/* Corners */}
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-white/40">Corners</label>
                        <select 
                          value={qrOptions.cornersType}
                          onChange={(e) => setQrOptions({...qrOptions, cornersType: e.target.value as CornerSquareType})}
                          className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-xs text-white outline-none focus:border-[#315be8]/50"
                        >
                          <option value="square">Square</option>
                          <option value="dot">Dot</option>
                          <option value="extra-rounded">Extra Rounded</option>
                        </select>
                     </div>

                     {/* Foreground Color */}
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-white/40">Data Color</label>
                        <div className="flex gap-2">
                          <input 
                            type="color"
                            value={qrOptions.fgColor}
                            onChange={(e) => setQrOptions({...qrOptions, fgColor: e.target.value})}
                            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                          />
                          <input 
                            type="text"
                            value={qrOptions.fgColor}
                            onChange={(e) => setQrOptions({...qrOptions, fgColor: e.target.value})}
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 text-xs text-white uppercase outline-none focus:border-[#315be8]/50 font-mono"
                          />
                        </div>
                     </div>

                     {/* Background Color */}
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-white/40">Background</label>
                        <div className="flex gap-2">
                          <input 
                            type="color"
                            value={qrOptions.bgColor}
                            onChange={(e) => setQrOptions({...qrOptions, bgColor: e.target.value})}
                            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                          />
                          <input 
                            type="text"
                            value={qrOptions.bgColor}
                            onChange={(e) => setQrOptions({...qrOptions, bgColor: e.target.value})}
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 text-xs text-white uppercase outline-none focus:border-[#315be8]/50 font-mono"
                          />
                        </div>
                     </div>

                     {/* Custom Logo URL */}
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                          <ImageIcon className="w-3 h-3" /> Center Logo (URL)
                        </label>
                        <input 
                          type="text"
                          placeholder="https://..."
                          value={qrOptions.image}
                          onChange={(e) => setQrOptions({...qrOptions, image: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-xs text-white outline-none focus:border-[#315be8]/50 font-mono"
                        />
                     </div>
                   </div>
                </div>

                <button
                  onClick={downloadQR}
                  className="w-full mt-6 bg-[#315be8] hover:bg-[#315be8]/90 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(49,91,232,0.3)]"
                >
                  <Download className="h-4 w-4" /> Download High-Res Vector
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShareTab;
