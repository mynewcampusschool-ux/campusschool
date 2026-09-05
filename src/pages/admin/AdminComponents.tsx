import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave } from 'react-icons/fi';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '0.25rem' }}>
            <FiX size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, type = 'text', value, onChange, placeholder, required }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
      {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none', resize: 'vertical', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' }}
      />
    )}
  </div>
);

export const SaveBtn: React.FC<{ onClick: () => void; label?: string; loading?: boolean }> = ({ onClick, label = 'Save', loading = false }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
    <button onClick={onClick} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: loading ? '#6B7280' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
      {loading ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> : <FiSave size={15} />} {label}
    </button>
  </div>
);

// Reusable Table
interface Column { key: string; label: string; }
interface TableProps { columns: Column[]; data: Record<string, any>[]; onEdit: (row: any) => void; onDelete: (id: any) => void; }

export const AdminTable: React.FC<TableProps> = ({ columns, data, onEdit, onDelete }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
      <thead>
        <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E5E7EB' }}>
          {columns.map((c) => (
            <th key={c.key} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{c.label}</th>
          ))}
          <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: '#374151' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = '#F9FAFB'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            {columns.map((c) => (
              <td key={c.key} style={{ padding: '0.75rem 1rem', color: '#374151', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row[c.key]}
              </td>
            ))}
            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
              <button onClick={() => onEdit(row)} style={{ background: 'rgba(11,107,75,0.1)', color: '#0B6B4B', border: 'none', borderRadius: '0.4rem', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginRight: '0.4rem' }}>Edit</button>
              <button onClick={() => onDelete(row.id)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '0.4rem', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr><td colSpan={columns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>No records found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

// Search + Add bar
export const TableHeader: React.FC<{ title: string; search: string; onSearch: (v: string) => void; onAdd: () => void; addLabel?: string }> =
  ({ title, search, onSearch, onAdd, addLabel = 'Add New' }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{title}</h2>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text" value={search} onChange={(e) => onSearch(e.target.value)}
          placeholder="Search..."
          style={{ padding: '0.5rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', width: '160px', minWidth: 0 }}
        />
        <button onClick={onAdd} style={{ background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + {addLabel}
        </button>
      </div>
    </div>
  );

export const Badge: React.FC<{ label: string; color?: string }> = ({ label, color = '#0B6B4B' }) => (
  <span style={{ background: color + '18', color, fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>{label}</span>
);
