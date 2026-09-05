import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadPhotoMap, savePhotoMap, type PhotoMap } from '../lib/alumniPhotos';

interface AlumniPhotoContextValue {
  photoMap: PhotoMap;
  setPhoto: (alumniId: string, url: string) => void;
  removePhoto: (alumniId: string) => void;
}

const AlumniPhotoContext = createContext<AlumniPhotoContextValue | null>(null);

export const AlumniPhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photoMap, setPhotoMap] = useState<PhotoMap>(loadPhotoMap);

  const setPhoto = useCallback((alumniId: string, url: string) => {
    setPhotoMap((prev) => {
      const next = { ...prev, [alumniId]: url };
      savePhotoMap(next);
      return next;
    });
  }, []);

  const removePhoto = useCallback((alumniId: string) => {
    setPhotoMap((prev) => {
      const next = { ...prev };
      delete next[alumniId];
      savePhotoMap(next);
      return next;
    });
  }, []);

  return (
    <AlumniPhotoContext.Provider value={{ photoMap, setPhoto, removePhoto }}>
      {children}
    </AlumniPhotoContext.Provider>
  );
};

export function useAlumniPhotos(): AlumniPhotoContextValue {
  const ctx = useContext(AlumniPhotoContext);
  if (!ctx) throw new Error('useAlumniPhotos must be used inside AlumniPhotoProvider');
  return ctx;
}
