import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    // Skip admin routes
    if (path.startsWith('/admin')) return;

    const pageId = path === '/' ? 'home' : path.replace(/\//g, '_').replace(/^_/, '');

    // Increment total views
    setDoc(doc(db, 'pageViews', 'total'), {
      count: increment(1),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Increment per-page views
    setDoc(doc(db, 'pageViews', pageId), {
      path,
      count: increment(1),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }, [location.pathname]);
}
