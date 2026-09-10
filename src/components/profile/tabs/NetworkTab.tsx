import React, { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserPlus, FiUserCheck, FiX } from 'react-icons/fi';
import {
  collection, onSnapshot, doc, updateDoc, deleteDoc,
  arrayUnion, arrayRemove, increment,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';
import type { ProfileData } from '../../../types/profile';

interface Props { profile: ProfileData; }
interface Request { uid: string; name: string; photo: string; }

const NetworkTab: React.FC<Props> = ({ profile }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'followRequests', user.uid, 'incoming'), snap => {
      setRequests(snap.docs.map(d => ({ uid: d.id, ...d.data() } as Request)));
    });
    return unsub;
  }, [user]);

  const accept = async (req: Request) => {
    if (!user) return;
    // sender gets +1 following, adds me to their following_list, removes from pendingFollow
    await updateDoc(doc(db, 'profiles', req.uid), {
      following_list: arrayUnion(user.uid),
      following: increment(1),
      pendingFollow: arrayRemove(user.uid),
    });
    // I get +1 followers
    await updateDoc(doc(db, 'profiles', user.uid), { followers: increment(1) });
    // Delete request
    await deleteDoc(doc(db, 'followRequests', user.uid, 'incoming', req.uid));
  };

  const decline = async (req: Request) => {
    if (!user) return;
    await deleteDoc(doc(db, 'followRequests', user.uid, 'incoming', req.uid));
    await updateDoc(doc(db, 'profiles', req.uid), { pendingFollow: arrayRemove(user.uid) });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Stats */}
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2">
          <FiUsers size={15} className="text-primary" /> Network Overview
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <FiUserCheck size={18} className="text-emerald-600" />, label: 'Followers',  value: profile.followers ?? 0, cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
            { icon: <FiUserPlus  size={18} className="text-purple-600"  />, label: 'Following',  value: profile.following ?? 0, cls: 'bg-purple-50 border-purple-200 text-purple-800'   },
            { icon: <FiUsers     size={18} className="text-yellow-600"  />, label: 'Requests',   value: requests.length,        cls: 'bg-yellow-50 border-yellow-200 text-yellow-800'   },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 border flex items-center gap-3 ${s.cls}`}>
              <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center">{s.icon}</div>
              <div>
                <p className="font-black text-xl leading-none">{s.value}</p>
                <p className="text-xs opacity-70 font-medium mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow Requests */}
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
        <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2">
          <FiUserPlus size={15} className="text-primary" /> Follow Requests
          {requests.length > 0 && (
            <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{requests.length}</span>
          )}
        </h3>
        {requests.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No pending follow requests</p>
        ) : (
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.uid} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-secondary/30">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden flex-shrink-0">
                  {req.photo
                    ? <img src={req.photo} alt={req.name} className="w-full h-full object-cover" />
                    : <span className="text-white font-black text-sm">{(req.name || 'A')[0].toUpperCase()}</span>
                  }
                </div>
                <p className="flex-1 font-semibold text-text text-sm truncate">{req.name || 'Alumni'}</p>
                <button onClick={() => accept(req)} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors">
                  <FiUserCheck size={12} /> Accept
                </button>
                <button onClick={() => decline(req)} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-border text-gray-500 hover:border-red-400 hover:text-red-500 transition-colors">
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(NetworkTab);
