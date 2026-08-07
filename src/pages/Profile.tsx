import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, MapPin, Lock, Save, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import districtsIndex from '../data/json/districts/index.json';

export default function Profile() {
  const { user, updateProfile, updateProfilePicture, isAdmin } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);

  const districtNames: string[] = Array.isArray(districtsIndex)
    ? (districtsIndex as any[]).map((d) => d.name || d.id).filter(Boolean)
    : [];

  if (!user) return null;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      await updateProfile({
        name,
        district,
        ...(newPassword ? { password: newPassword, currentPassword } : {}),
      });
      setMessage('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePicChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPic(true);
    try {
      await updateProfilePicture(file);
    } catch (err: any) {
      setError(err.message || 'Picture upload failed');
    } finally {
      setUploadingPic(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Your Account</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-heading">Profile Settings</h1>
      </div>

      {isAdmin && (
        <Link to="/admin" className="flex items-center justify-center gap-2 bg-brand-green/10 border border-brand-green/30 text-brand-green rounded-xl px-4 py-3 mb-6 font-semibold hover:bg-brand-green/20 transition-colors">
          <ShieldCheck size={18} /> Go to Admin Panel
        </Link>
      )}

      <div className="bg-surface border border-line/10 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={user.profilePicture || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user.name)}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-brand-green/40"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 bg-brand-green text-black p-2 rounded-full shadow-lg hover:brightness-110"
              title="Change picture"
            >
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePicChange} />
          </div>
          {uploadingPic && <p className="text-xs text-muted mt-2">Uploading...</p>}
          <p className="text-sm text-muted mt-3">{user.email}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-muted mb-1 block">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-base border border-line/15 rounded-xl px-4 py-3 outline-none text-heading" />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block flex items-center gap-1"><MapPin size={12} /> District</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full bg-base border border-line/15 rounded-xl px-4 py-3 outline-none text-heading">
              <option value="">Select district</option>
              {districtNames.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-line/10">
            <p className="text-xs text-muted mb-3 flex items-center gap-1"><Lock size={12} /> Change password (optional)</p>
            {user.authProvider === 'local' && (
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-base border border-line/15 rounded-xl px-4 py-3 outline-none text-heading mb-3"
              />
            )}
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-base border border-line/15 rounded-xl px-4 py-3 outline-none text-heading"
            />
          </div>

          {message && <p className="text-sm text-brand-green">{message}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-brand-green text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
            <Save size={18} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
