import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiUserPlus, FiUserCheck, FiMessageCircle,
  FiSearch, FiMapPin, FiBriefcase, FiX,
  FiLinkedin, FiFacebook, FiEye,
} from 'react-icons/fi';
import {
  collection, onSnapshot, doc, updateDoc,
  arrayUnion, arrayRemove, increment, setDoc, getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ALUMNI_DATA } from '../lib/alumniData';

interface UnifiedAlumni {
  id: string;
  uid?: string;
  name: string;
  email?: string;
  batch?: string;
  school?: string;
  photo?: string;
  designation?: string;
  organization?: string;
  profession?: string;
  qualification?: string;
  city?: string;
  country?: string;
  linkedin?: string;
  facebook?: string;
  isRegistered: boolean;
}

/* ── Small avatar for cards ──────────────────────────── */
const CardAvatar: React.FC<{ alumni: UnifiedAlumni }> = ({ alumni }) => {
  const [err, setErr] = useState(false);
  const initials = (alumni.name || 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center overflow-hidden flex-shrink-0">
      {alumni.photo && !err
        ? <img src={alumni.photo} alt={alumni.name} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <span className="text-white font-black text-base">{initials}</span>
      }
    </div>
  );
};

/* ── Profile Modal ───────────────────────────────────── */
const ProfileModal: React.FC<{
  alumni: UnifiedAlumni;
  isConnected: boolean;
  isFollowed: boolean;
  onConnect: () => void;
  onFollow: () => void;
  onClose: () => void;
  loggedIn: boolean;
}> = ({ alumni, isConnected, isFollowed, onConnect, onFollow, onClose, loggedIn }) => {
  const [err, setErr] = useState(false);
  const initials = (alumni.name || 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        className="bg-white rounded-2xl shadow-glass w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Cover strip */}
        <div
          className="rounded-t-2xl relative"
          style={{ height: 80, background: 'linear-gradient(135deg,#0B6B4B 0%,#094d36 50%,#D4AF37 100%)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* Avatar + badge — avatar only slightly overlaps cover bottom */}
        <div className="px-5 flex items-center justify-between" style={{ marginTop: -28 }}>
          <div
            style={{
              width: 80, height: 80,
              borderRadius: '50%',
              border: '4px solid white',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              overflow: 'hidden',
              background: '#0B6B4B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              position: 'relative', zIndex: 2,
            }}
          >
            {alumni.photo && !err
              ? <img
                  src={alumni.photo}
                  alt={alumni.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={() => setErr(true)}
                />
              : <span style={{ color: 'white', fontWeight: 900, fontSize: 26 }}>{initials}</span>
            }
          </div>
          {alumni.isRegistered && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-lg self-end">● Registered</span>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-3">
          <h2 className="font-black text-text text-lg leading-tight">{alumni.name}</h2>

          {alumni.designation && (
            <p className="text-primary text-sm font-semibold flex items-center gap-1 mt-0.5">
              <FiBriefcase size={12} /> {alumni.designation}
            </p>
          )}
          {alumni.organization && (
            <p className="text-gray-500 text-xs mt-0.5">{alumni.organization}</p>
          )}
          {!alumni.designation && alumni.profession && (
            <p className="text-gray-500 text-sm mt-0.5">{alumni.profession}</p>
          )}

          {/* Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {alumni.batch && (
              <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg font-semibold">
                Batch {alumni.batch}
              </span>
            )}
            {(alumni.city || alumni.country) && (
              <span className="bg-secondary text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <FiMapPin size={10} /> {[alumni.city, alumni.country].filter(Boolean).join(', ')}
              </span>
            )}
            {alumni.school && (
              <span className="bg-secondary text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                {alumni.school}
              </span>
            )}
            {alumni.qualification && (
              <span className="bg-secondary text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                {alumni.qualification}
              </span>
            )}
          </div>

          {/* Social */}
          {(alumni.linkedin || alumni.facebook) && (
            <div className="flex gap-2 mt-3">
              {alumni.linkedin && (
                <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors">
                  <FiLinkedin size={13} /> LinkedIn
                </a>
              )}
              {alumni.facebook && (
                <a href={alumni.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors">
                  <FiFacebook size={13} /> Facebook
                </a>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            {loggedIn && alumni.uid ? (
              <>
                <button
                  onClick={onConnect}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border transition-all ${
                    isConnected
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-border text-gray-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {isConnected ? <FiUserCheck size={13} /> : <FiUserPlus size={13} />}
                  {isConnected ? 'Friends ✓' : 'Add Friend'}
                </button>
                <button
                  onClick={onFollow}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border transition-all ${
                    isFollowed
                      ? 'bg-accent/10 border-accent text-accent-dark'
                      : 'border-border text-gray-600 hover:border-accent hover:text-accent-dark'
                  }`}
                >
                  {isFollowed ? '✓ Following' : '+ Follow'}
                </button>
                {alumni.email && (
                  <a
                    href={`mailto:${alumni.email}?subject=Hello from Campus School Alumni Portal`}
                    className="flex items-center justify-center px-3 rounded-xl border border-border text-gray-600 hover:border-primary hover:text-primary transition-all"
                  >
                    <FiMessageCircle size={14} />
                  </a>
                )}
              </>
            ) : !loggedIn ? (
              <p className="text-xs text-gray-400 text-center w-full py-2 bg-secondary rounded-xl">
                Login to connect with alumni
              </p>
            ) : (
              <p className="text-xs text-gray-400 text-center w-full py-2 bg-secondary rounded-xl">
                This alumni hasn't registered on the portal yet
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Page ───────────────────────────────────────── */
const ConnectPage: React.FC = () => {
  const { user: me } = useAuth();
  const [firestoreUsers, setFirestoreUsers] = useState<UnifiedAlumni[]>([]);
  const [search, setSearch]       = useState('');
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [followed, setFollowed]   = useState<Set<string>>(new Set());
  const [selected, setSelected]   = useState<UnifiedAlumni | null>(null);
  const [loading, setLoading]     = useState(true);

  const staticAlumni = useMemo<UnifiedAlumni[]>(() =>
    ALUMNI_DATA.map(a => ({
      id: `static_${a.id}`,
      name: a.fullName,
      batch: a.batch,
      photo: a.photoUrl || undefined,
      designation: a.designation || undefined,
      organization: a.organization || undefined,
      profession: a.profession || undefined,
      qualification: a.qualification || undefined,
      city: a.city || undefined,
      country: a.country || undefined,
      linkedin: a.linkedinUrl || undefined,
      facebook: a.facebookUrl || undefined,
      isRegistered: false,
    }))
  , []);

  // Load Firestore users + merge with their profiles
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), async snap => {
      const docs = snap.docs.filter(d => d.id !== me?.uid);
      const list = await Promise.all(docs.map(async d => {
        const u = d.data();
        let p: Record<string, unknown> = {};
        try {
          const ps = await getDoc(doc(db, 'profiles', d.id));
          if (ps.exists()) p = ps.data();
        } catch { /* offline */ }
        return {
          id: d.id, uid: d.id,
          name: (p.name as string) || u.full_name || 'Alumni',
          email: u.email as string,
          batch: (p.batch as string) || u.batch_year,
          school: (p.school as string) || u.school,
          photo: (p.photoURL as string) || u.avatar,
          designation: p.designation as string | undefined,
          organization: p.company as string | undefined,
          profession: p.industry as string | undefined,
          city: p.city as string | undefined,
          country: p.country as string | undefined,
          linkedin: (p.socialLinks as Record<string,string> | undefined)?.linkedin,
          facebook: (p.socialLinks as Record<string,string> | undefined)?.facebook,
          isRegistered: true,
        } as UnifiedAlumni;
      }));
      setFirestoreUsers(list);
      setLoading(false);
    });
    return unsub;
  }, [me?.uid]);

  // My connections & following
  useEffect(() => {
    if (!me) return;
    const unsub = onSnapshot(doc(db, 'profiles', me.uid), snap => {
      if (!snap.exists()) return;
      const d = snap.data();
      setConnected(new Set(d.connectedWith ?? []));
      setFollowed(new Set(d.following_list ?? []));
    });
    return unsub;
  }, [me]);

  const ensureProfile = useCallback(async (uid: string) => {
    const ref = doc(db, 'profiles', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { connections: 0, followers: 0, following: 0, connectedWith: [], following_list: [] }, { merge: true });
    }
  }, []);

  const handleConnect = useCallback(async (target: UnifiedAlumni) => {
    if (!me || !target.uid) return;
    await ensureProfile(me.uid);
    await ensureProfile(target.uid);
    const myRef = doc(db, 'profiles', me.uid);
    const tRef  = doc(db, 'profiles', target.uid);
    if (connected.has(target.uid)) {
      await updateDoc(myRef, { connectedWith: arrayRemove(target.uid), connections: increment(-1) });
      await updateDoc(tRef,  { connectedWith: arrayRemove(me.uid),     connections: increment(-1) });
    } else {
      await updateDoc(myRef, { connectedWith: arrayUnion(target.uid), connections: increment(1) });
      await updateDoc(tRef,  { connectedWith: arrayUnion(me.uid),     connections: increment(1) });
    }
  }, [me, connected, ensureProfile]);

  const handleFollow = useCallback(async (target: UnifiedAlumni) => {
    if (!me || !target.uid) return;
    await ensureProfile(me.uid);
    await ensureProfile(target.uid);
    const myRef = doc(db, 'profiles', me.uid);
    const tRef  = doc(db, 'profiles', target.uid);
    if (followed.has(target.uid)) {
      await updateDoc(myRef, { following_list: arrayRemove(target.uid), following: increment(-1) });
      await updateDoc(tRef,  { followers: increment(-1) });
    } else {
      await updateDoc(myRef, { following_list: arrayUnion(target.uid), following: increment(1) });
      await updateDoc(tRef,  { followers: increment(1) });
    }
  }, [me, followed, ensureProfile]);

  const allAlumni = useMemo(() => {
    const regNames = new Set(firestoreUsers.map(u => u.name.toLowerCase().trim()));
    return [...firestoreUsers, ...staticAlumni.filter(a => !regNames.has(a.name.toLowerCase().trim()))];
  }, [firestoreUsers, staticAlumni]);

  const filtered = useMemo(() =>
    allAlumni.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.batch?.includes(search) ||
      u.city?.toLowerCase().includes(search.toLowerCase()) ||
      u.profession?.toLowerCase().includes(search.toLowerCase()) ||
      u.organization?.toLowerCase().includes(search.toLowerCase()) ||
      u.designation?.toLowerCase().includes(search.toLowerCase())
    )
  , [allAlumni, search]);

  return (
    <>
      <Helmet><title>Connect | Campus School Pantnagar Alumni Portal</title></Helmet>

      <div className="py-14 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg,#0B6B4B 0%,#094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Alumni Network</span>
          <h1 className="text-4xl font-black mt-2 mb-2">Connect with Alumni</h1>
          <p className="text-white/80 text-sm">Follow, connect and message <span className="font-black text-white text-lg">{allAlumni.length}</span> fellow alumni</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, batch, city, profession..."
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-sm text-gray-500 font-medium flex-shrink-0">{filtered.length} alumni</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border/50 p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiUsers size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No alumni found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((u, i) => {
              const isConn     = u.uid ? connected.has(u.uid) : false;
              const isFollowed = u.uid ? followed.has(u.uid) : false;
              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.025, 0.4) }}
                  className="bg-white rounded-2xl border border-border/50 shadow-card p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <CardAvatar alumni={u} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-text text-sm truncate">{u.name}</p>
                      {u.designation
                        ? <p className="text-xs text-primary truncate">{u.designation}</p>
                        : u.profession
                          ? <p className="text-xs text-gray-500 truncate">{u.profession}</p>
                          : null
                      }
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {u.batch && <span className="text-xs text-gray-400">Batch {u.batch}</span>}
                        {u.isRegistered && <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" title="Registered" />}
                      </div>
                    </div>
                  </div>

                  {(u.city || u.country) && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FiMapPin size={10} /> {[u.city, u.country].filter(Boolean).join(', ')}
                    </p>
                  )}

                  <div className="flex gap-1.5 mt-auto pt-1">
                    <button
                      onClick={() => setSelected(u)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-2 rounded-xl border border-border text-gray-600 hover:border-primary hover:text-primary transition-all"
                    >
                      <FiEye size={12} /> View Profile
                    </button>
                    {u.uid && me && (
                      <>
                        <button
                          onClick={() => handleConnect(u)}
                          title={isConn ? 'Remove Friend' : 'Add Friend'}
                          className={`flex items-center justify-center gap-1 text-xs font-semibold px-2.5 py-2 rounded-xl border transition-all ${
                            isConn ? 'bg-primary/10 border-primary text-primary' : 'border-border text-gray-500 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {isConn ? <FiUserCheck size={12} /> : <FiUserPlus size={12} />}
                        </button>
                        <button
                          onClick={() => handleFollow(u)}
                          title={isFollowed ? 'Unfollow' : 'Follow'}
                          className={`text-xs font-bold px-2.5 rounded-xl border transition-all ${
                            isFollowed ? 'bg-accent/10 border-accent text-accent-dark' : 'border-border text-gray-500 hover:border-accent hover:text-accent-dark'
                          }`}
                        >
                          {isFollowed ? '✓' : '+'}
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ProfileModal
            alumni={selected}
            isConnected={selected.uid ? connected.has(selected.uid) : false}
            isFollowed={selected.uid ? followed.has(selected.uid) : false}
            onConnect={() => handleConnect(selected)}
            onFollow={() => handleFollow(selected)}
            onClose={() => setSelected(null)}
            loggedIn={!!me}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ConnectPage;
