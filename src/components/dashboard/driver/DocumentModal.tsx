import React from 'react';
import toast from 'react-hot-toast';
import { X, FileText, CheckCircle2, Download } from 'lucide-react';
import { Button } from '../../ui/Button';

interface DocumentModalProps {
    viewingDoc: { name: string; url?: string } | null;
    onClose: () => void;
}

export const DocumentModal = ({ viewingDoc, onClose }: DocumentModalProps) => {
    if (!viewingDoc) return null;
    
    const isPDF = viewingDoc.url?.toLowerCase().endsWith('.pdf');
    const hasUrl = !!viewingDoc.url;

    const handleDownload = () => {
        if (viewingDoc.url) {
            window.open(viewingDoc.url, '_blank');
            toast.success("Opening document...");
        } else {
            toast.error("Document URL not available");
        }
    };

    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl relative z-10 animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">{viewingDoc.name}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <div className="p-8 flex items-center justify-center bg-slate-50 overflow-y-auto flex-1">
                {hasUrl ? (
                    isPDF ? (
                        <iframe 
                            src={viewingDoc.url} 
                            className="w-full h-[600px] border border-slate-200 rounded-lg bg-white"
                            title={viewingDoc.name}
                        />
                    ) : (
                        <img 
                            src={viewingDoc.url} 
                            alt={viewingDoc.name}
                            className="max-w-full max-h-[600px] object-contain rounded-lg border border-slate-200 shadow-lg bg-white"
                        />
                    )
                ) : (
                    <div className="w-full aspect-[3/4] bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 shadow-sm p-12">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <FileText size={40} className="text-slate-300"/>
                        </div>
                        <p className="font-bold text-lg text-slate-600 mb-2">Document Not Available</p>
                        <p className="text-sm text-slate-400 text-center max-w-xs">
                            The document for {viewingDoc.name} has not been uploaded yet. Please upload it in your profile settings.
                        </p>
                        <div className="mt-8 flex gap-2">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                                Not Uploaded
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
                <Button variant="ghost" onClick={onClose}>Close</Button>
                {hasUrl && <Button onClick={handleDownload}><Download size={16} className="mr-2"/>Download</Button>}
            </div>
        </div>
    </div>
    );
};
