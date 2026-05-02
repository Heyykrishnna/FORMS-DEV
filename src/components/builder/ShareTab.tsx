import React, { useState, useRef } from 'react';
import { FormData } from '@/types/form';
import { Copy, Check, Code, QrCode, Share2, Twitter, MessageCircle, Linkedin, Download, Mail } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface Props {
  form: FormData;
}

const ShareTab = ({ form }: Props) => {
  const [copied, setCopied] = useState<string | null>(null);
  const qrRef = useRef<SVGSVGElement>(null);

  const formUrl = `${window.location.origin}/form/${form.id}`;
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0" style="border: 3px solid #000;"></iframe>`;

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
      `Hot off the press! ${form.title} is live.`,
      `I need your brain on this! ${form.title}`,
      `Quick request: ${form.title}`,
      `It's finally here! ${form.title}`,
      `What do you think about ${form.title}?`,
      `Help me out with ${form.title}!`,
      `Boom! ${form.title} is ready for you.`
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
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${form.title}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
        SHARE & GROW<span className="text-accent">.</span>
      </h2>

      {/* Link */}
      <div className="border-brutal p-5 mb-6 bg-secondary/20">
        <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2 tracking-widest">FORM LINK</label>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={formUrl}
            className="flex-1 bg-secondary text-sm p-3 border border-foreground/20 outline-none font-mono"
          />
          <button
            onClick={() => copyToClipboard(formUrl, 'link')}
            className="border-brutal bg-accent text-accent-foreground px-6 py-3 text-xs font-black uppercase flex items-center gap-2 hover:shadow-brutal-sm transition-all"
          >
            {copied === 'link' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'link' ? 'COPIED' : 'COPY'}
          </button>
        </div>
      </div>

      {/* Social Share */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => shareSocial('twitter')}
          className="border-brutal p-3 flex flex-col items-center gap-2 hover:bg-black hover:text-white transition-colors"
        >
          <div className="h-5 w-5 flex items-center justify-center">
            <FaXTwitter size={20} />
          </div>
          <span className="text-[10px] font-black uppercase">Twitter</span>
        </button>
        <button
          onClick={() => shareSocial('whatsapp')}
          className="border-brutal p-3 flex flex-col items-center gap-2 hover:bg-green-500 hover:text-white transition-colors"
        >
          <div className="h-5 w-5 flex items-center justify-center">
            <FaWhatsapp size={20} />
          </div>
          <span className="text-[10px] font-black uppercase">WhatsApp</span>
        </button>
        <button
          onClick={() => shareSocial('linkedin')}
          className="border-brutal p-3 flex flex-col items-center gap-2 hover:bg-blue-700 hover:text-white transition-colors"
        >
          <Linkedin className="h-5 w-5" />
          <span className="text-[10px] font-black uppercase">LinkedIn</span>
        </button>
        <button
          onClick={() => shareSocial('email')}
          className="border-brutal p-3 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Mail className="h-5 w-5" />
          <span className="text-[10px] font-black uppercase">Email</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="border-brutal p-5 flex flex-col items-center">
          <label className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest flex items-center gap-2">
            <QrCode className="h-4 w-4" /> SCANNABLE CODE
          </label>
          <div className="p-4 bg-white border-2 border-current mb-4">
            <QRCodeSVG
              ref={qrRef}
              value={formUrl}
              size={140}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <button
            onClick={downloadQR}
            className="w-full border-brutal bg-secondary px-4 py-2 text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> DOWNLOAD PNG
          </button>
        </div>

        {/* Embed */}
        <div className="border-brutal p-5 flex flex-col h-full">
          <label className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest flex items-center gap-2">
            <Code className="h-4 w-4" /> EMBED ON SITE
          </label>
          <textarea
            readOnly
            value={embedCode}
            rows={5}
            className="flex-1 w-full bg-secondary text-[10px] p-3 border border-foreground/20 outline-none font-mono resize-none mb-3"
          />
          <button
            onClick={() => copyToClipboard(embedCode, 'embed')}
            className="w-full border-brutal bg-primary text-primary-foreground px-4 py-2 text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:shadow-brutal-sm transition-all"
          >
            {copied === 'embed' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied === 'embed' ? 'COPIED' : 'COPY EMBED'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareTab;
