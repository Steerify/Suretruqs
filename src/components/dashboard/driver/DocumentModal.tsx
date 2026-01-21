import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/Button';

export const DocumentModal = ({ viewingDoc, onClose }: { viewingDoc: string | null, onClose: () => void }) => {
    if (!viewingDoc) return null;
    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl relative z-10 animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">{viewingDoc}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <div className="p-8 flex items-center justify-center bg-slate-50 overflow-y-auto flex-1">
                {/* Mock Document Preview */}
                <div className="w-full aspect-[3/4] bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 shadow-sm p-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <FileText size={40} className="text-slate-300"/>
                    </div>
                    <p className="font-bold text-lg text-slate-600 mb-2">Document Preview</p>
                    <p className="text-sm text-slate-400 text-center max-w-xs">
                        This is a placeholder for the verified {viewingDoc}. In a production environment, the actual document image or PDF would be rendered here.
                    </p>
                    <div className="mt-8 flex gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center">
                            <CheckCircle2 size={12} className="mr-1"/> Verified
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                            Expires 2025
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
                <Button variant="ghost" onClick={onClose}>Close</Button>
                <Button onClick={() => alert("Downloading...")}>Download Copy</Button>
            </div>
        </div>
    </div>
    );
};
