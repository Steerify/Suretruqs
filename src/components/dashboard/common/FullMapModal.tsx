import React from 'react';
import { Button } from '../../ui/Button';
import { ArrowDownLeft, MapPin } from 'lucide-react';

export const FullMapModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] bg-white">
        <div className="absolute top-4 left-4 z-10">
            <Button variant="secondary" onClick={onClose} className="bg-white shadow-md"><ArrowDownLeft className="mr-2 rotate-45"/> Back</Button>
        </div>
        <div className="w-full h-full bg-slate-100 flex items-center justify-center relative">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" className="w-full h-full object-cover opacity-10" alt="map" />
             <div className="absolute inset-0 flex items-center justify-center">
                 <p className="text-slate-400 font-bold flex flex-col items-center">
                     <MapPin size={48} className="mb-4 text-brand-primary"/>
                     Full Screen Map View (Placeholder)
                 </p>
             </div>
        </div>
    </div>
);
