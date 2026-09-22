'use client';

import React, { useRef } from 'react';
import { Image, FileText, Video, Mic, Plus, X } from 'lucide-react';
import { Attachment } from '@/types';

interface AttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAttachment: (attachment: Attachment) => void;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  isOpen,
  onClose,
  onSelectAttachment,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'document' | 'video' | 'audio'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      type,
      url: fileUrl,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      mimeType: file.type
    };

    onSelectAttachment(attachment);
    onClose();
  };

  const handlePresetSample = (type: 'image' | 'document' | 'video' | 'audio') => {
    let attachment: Attachment;
    if (type === 'image') {
      attachment = {
        id: `att-${Date.now()}`,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        fileName: 'Project_Design_Mockup_V2.png',
        fileSize: '2.4 MB',
        mimeType: 'image/png'
      };
    } else if (type === 'document') {
      attachment = {
        id: `att-${Date.now()}`,
        type: 'document',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'VisionTech_CRM_Report_Q3.pdf',
        fileSize: '1.8 MB',
        mimeType: 'application/pdf'
      };
    } else if (type === 'video') {
      attachment = {
        id: `att-${Date.now()}`,
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        fileName: 'Product_Demo_Walkthrough.mp4',
        fileSize: '14.2 MB',
        mimeType: 'video/mp4'
      };
    } else {
      attachment = {
        id: `att-${Date.now()}`,
        type: 'audio',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        fileName: 'Client_Voice_Note_09.mp3',
        fileSize: '0.8 MB',
        mimeType: 'audio/mp3'
      };
    }
    onSelectAttachment(attachment);
    onClose();
  };

  return (
    <div className="absolute bottom-16 left-4 bg-[#202c33] border border-[#2a3942] rounded-2xl p-3 shadow-2xl z-50 w-72 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
      
      {/* Hidden Inputs */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'image')}
      />
      <input
        type="file"
        ref={docInputRef}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'document')}
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'video')}
      />
      <input
        type="file"
        ref={audioInputRef}
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'audio')}
      />

      <div className="flex items-center justify-between border-b border-[#2a3942] pb-2 mb-2">
        <span className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#00a884]" />
          <span>Attach Media File</span>
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-[#2a3942]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        
        {/* Photos & Images */}
        <button
          onClick={() => imageInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Image className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-200">Photos & Images</span>
          <span className="text-[10px] text-gray-400">JPG, PNG, WEBP</span>
        </button>

        {/* Documents */}
        <button
          onClick={() => docInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-200">Documents</span>
          <span className="text-[10px] text-gray-400">PDF, DOCX, XLSX</span>
        </button>

        {/* Video */}
        <button
          onClick={() => videoInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-200">Videos</span>
          <span className="text-[10px] text-gray-400">MP4, MOV, AVI</span>
        </button>

        {/* Audio */}
        <button
          onClick={() => audioInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-200">Audio / Voice</span>
          <span className="text-[10px] text-gray-400">MP3, AAC, WAV</span>
        </button>

      </div>

      {/* Quick Test Samples */}
      <div className="mt-3 pt-2 border-t border-[#2a3942]">
        <span className="text-[10px] text-gray-400 block mb-1.5 uppercase font-semibold">Quick Sample Attachments</span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => handlePresetSample('image')}
            className="text-[10px] bg-[#111b21] hover:bg-[#2a3942] text-purple-300 px-2 py-1 rounded border border-[#2a3942]"
          >
            + Sample Image
          </button>
          <button
            onClick={() => handlePresetSample('document')}
            className="text-[10px] bg-[#111b21] hover:bg-[#2a3942] text-blue-300 px-2 py-1 rounded border border-[#2a3942]"
          >
            + Sample PDF
          </button>
          <button
            onClick={() => handlePresetSample('video')}
            className="text-[10px] bg-[#111b21] hover:bg-[#2a3942] text-rose-300 px-2 py-1 rounded border border-[#2a3942]"
          >
            + Sample Video
          </button>
        </div>
      </div>

    </div>
  );
};
