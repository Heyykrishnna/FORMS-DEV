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
    fgColor: '#000000',
    bgColor: '#ffffff',
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
    <div className="min-h-full font-sans bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        

        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight mb-4">Share & Publish</h2>
          <p className="text-muted-foreground text-sm max-w-2xl font-light">
            Distribute your protocol securely. Use direct links, generate dynamic QR codes, or seamlessly embed the interface into your existing architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          

          <div className="lg:col-span-7 space-y-6">
            

            <div className="relative border border-border bg-card p-6 rounded-xl overflow-hidden group shadow-sm">
              <div className="relative z-10">
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5" /> Direct Link
                </label>
                <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-lg p-1.5">
                  <input
                    readOnly
                    value={formUrl}
                    className="flex-1 bg-transparent text-sm text-foreground px-3 outline-none font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(formUrl, 'link')}
                    className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2"
                  >
                    {copied === 'link' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === 'link' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>


            <div className="relative border border-border bg-card p-6 rounded-xl overflow-hidden group shadow-sm">
              <div className="relative z-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => shareSocial('twitter')}
                    className="border border-border bg-background p-4 rounded-lg flex flex-col items-center gap-3 hover:bg-secondary transition-all"
                  >
                    <FaXTwitter className="h-5 w-5 text-foreground" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareSocial('whatsapp')}
                    className="border border-border bg-background p-4 rounded-lg flex flex-col items-center gap-3 hover:bg-green-50 hover:border-green-200 transition-all hover:text-green-600 dark:hover:bg-green-950 dark:hover:border-green-900"
                  >
                    <FaWhatsapp className="h-5 w-5 text-foreground" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => shareSocial('linkedin')}
                    className="border border-border bg-background p-4 rounded-lg flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-200 transition-all hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:border-blue-900"
                  >
                    <Linkedin className="h-5 w-5 text-foreground" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => shareSocial('email')}
                    className="border border-border bg-background p-4 rounded-lg flex flex-col items-center gap-3 hover:bg-secondary transition-all"
                  >
                    <Mail className="h-5 w-5 text-foreground" />
                    <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Email</span>
                  </button>
                </div>
              </div>
            </div>


            <div className="relative border border-border bg-card p-6 rounded-xl overflow-hidden group shadow-sm">
              <div className="relative z-10 flex flex-col h-full">
                <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-4">
                  <textarea
                    readOnly
                    value={embedCode}
                    rows={4}
                    className="w-full bg-transparent text-xs text-foreground outline-none font-mono resize-none leading-relaxed"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(embedCode, 'embed')}
                  className="w-full border border-border bg-background text-foreground hover:bg-secondary px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  {copied === 'embed' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'embed' ? 'Snippet Copied' : 'Copy Embed Snippet'}
                </button>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 relative border border-border bg-card rounded-xl overflow-hidden flex flex-col shadow-sm">
             <div className="relative z-10 p-6 flex flex-col h-full">


                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] mb-8 relative">
                   <div 
                      ref={qrRef} 
                      className="p-6 bg-white border border-border rounded-2xl shadow-sm"
                    />
                </div>


                <div className="space-y-5 bg-secondary/30 p-5 rounded-lg border border-border">
                   <div className="flex items-center gap-2 mb-2">
                     <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
                     <span className="text-xs font-medium text-foreground">Configuration</span>
                   </div>
                   

                   <div className="grid grid-cols-2 gap-4">

                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Pattern</label>
                        <select 
                          value={qrOptions.dotsType}
                          onChange={(e) => setQrOptions({...qrOptions, dotsType: e.target.value as DotType})}
                          className="w-full bg-background border border-border rounded-md p-2 text-xs text-foreground outline-none focus:border-primary"
                        >
                          <option value="square">Square</option>
                          <option value="dots">Dots</option>
                          <option value="rounded">Rounded</option>
                          <option value="classy">Classy</option>
                          <option value="classy-rounded">Classy Rounded</option>
                          <option value="extra-rounded">Extra Rounded</option>
                        </select>
                     </div>


                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Corners</label>
                        <select 
                          value={qrOptions.cornersType}
                          onChange={(e) => setQrOptions({...qrOptions, cornersType: e.target.value as CornerSquareType})}
                          className="w-full bg-background border border-border rounded-md p-2 text-xs text-foreground outline-none focus:border-primary"
                        >
                          <option value="square">Square</option>
                          <option value="dot">Dot</option>
                          <option value="extra-rounded">Extra Rounded</option>
                        </select>
                     </div>


                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          Center Logo (URL)
                        </label>
                        <input 
                          type="text"
                          placeholder="https://..."
                          value={qrOptions.image}
                          onChange={(e) => setQrOptions({...qrOptions, image: e.target.value})}
                          className="w-full bg-background border border-border rounded-md p-2 text-xs text-foreground outline-none focus:border-primary font-mono"
                        />
                     </div>
                   </div>
                </div>

                <button
                  onClick={downloadQR}
                  className="w-full mt-6 bg-primary text-primary-foreground hover:opacity-90 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
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
