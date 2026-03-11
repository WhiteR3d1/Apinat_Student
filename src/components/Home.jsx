import {
    addDoc, collection, deleteDoc,
    doc, getDocs
} from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase_config";
import { Link } from 'react-router-dom';
import "../css/Home.css";

// ===== Toast Hook =====
function useToast() {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);
    return { toasts, addToast };
}

function ToastContainer({ toasts }) {
    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast ${t.type}`}>
                    <span className="toast-icon">{t.type === 'success' ? '✅' : '❌'}</span>
                    {t.message}
                </div>
            ))}
        </div>
    );
}

// ===== Main =====
export default function Home() {
    const [stdPhones, setStdPhones]   = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [name, setName]             = useState('');
    const [sect, setSect]             = useState('');
    const [tel, setTel]               = useState('');
    const [theme, setTheme]           = useState('dark');
    const { toasts, addToast }        = useToast();

    const stdPhoneRef = collection(db, '/stdphones');

    // Apply theme to <html>
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => { getAllPhones(); }, []);

    function getAllPhones() {
        setLoading(true);
        getDocs(stdPhoneRef)
            .then(snap => {
                setStdPhones(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            })
            .catch(err => addToast(err.message, 'error'))
            .finally(() => setLoading(false));
    }

    const addPhone = () => {
        if (!name || !sect || !tel) { addToast('Please fill in all fields.', 'error'); return; }
        addDoc(stdPhoneRef, { name, sect, tel })
            .then(() => { setName(''); setSect(''); setTel(''); getAllPhones(); addToast(`${name} added!`); })
            .catch(err => addToast(err.message, 'error'));
    };

    const delPhone = (id, phoneName) => {
        if (!window.confirm(`Delete ${phoneName}?`)) return;
        deleteDoc(doc(stdPhoneRef, id))
            .then(() => { getAllPhones(); addToast(`${phoneName} deleted.`); })
            .catch(err => addToast(err.message, 'error'));
    };

    const filtered = stdPhones.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const cedCount = stdPhones.filter(p => p.sect === 'CED').length;
    const tctCount = stdPhones.filter(p => p.sect === 'TCT').length;
    const isDark = theme === 'dark';

    return (
        <div className="home-wrapper">

            {/* Topbar */}
            <div className="topbar">
                <div className="topbar-brand">
                    <h1>STUDENT<span>_</span>PHONEBOOK</h1>
                    <p>Student contact management system</p>
                </div>
                <button
                    className="theme-toggle"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                >
                    {isDark ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>

            {/* Stats */}
            <div className="stats-bar">
                <div className="stat-chip total">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">{stdPhones.length}</span>
                </div>
                <div className="stat-chip ced">
                    <span className="stat-label">CED</span>
                    <span className="stat-value">{cedCount}</span>
                </div>
                <div className="stat-chip tct">
                    <span className="stat-label">TCT</span>
                    <span className="stat-value">{tctCount}</span>
                </div>
            </div>

            {/* Add Form */}
            <div className="add-form-card">
                <div className="form-title">Add New Student</div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Student name"
                            value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" placeholder="0xx-xxx-xxxx"
                            value={tel} onChange={e => setTel(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Section</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input type="radio" name="rdSect" value="CED"
                                    checked={sect === 'CED'} onChange={e => setSect(e.target.value)} /> CED
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="rdSect" value="TCT"
                                    checked={sect === 'TCT'} onChange={e => setSect(e.target.value)} /> TCT
                            </label>
                        </div>
                    </div>
                    <button className="btn-add" onClick={addPhone}>+ Add</button>
                </div>
            </div>

            {/* Search */}
            <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input className="search-input" type="text"
                    placeholder="Search students..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* List */}
            {loading ? (
                <div className="spinner-wrapper">
                    <div className="spinner" />
                    LOADING...
                </div>
            ) : filtered.length > 0 ? (
                <>
                    <div className="list-header">
                        {filtered.length} / {stdPhones.length} students
                    </div>
                    <div className="phone-list">
                        {filtered.map((phone, i) => (
                            <div
                                className={`phone-card sect-${phone.sect?.toLowerCase()}`}
                                key={phone.id}
                                style={{ animationDelay: `${i * 0.04}s` }}
                            >
                                <div className="card-top">
                                    <div className="phone-avatar">
                                        {phone.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="card-info">
                                        <div className="phone-name">{phone.name}</div>
                                        <span className={`sect-badge ${phone.sect?.toLowerCase()}`}>
                                            {phone.sect}
                                        </span>
                                    </div>
                                </div>
                                <div className="phone-tel">📞 {phone.tel}</div>
                                <div className="card-actions">
                                    <Link to="/edit" state={phone.id} className="btn-edit">
                                        Edit
                                    </Link>
                                    <button className="btn-delete"
                                        onClick={() => delPhone(phone.id, phone.name)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">{search ? '🔎' : '📭'}</div>
                    <p>{search ? `No results for "${search}"` : 'No students yet. Add one above!'}</p>
                </div>
            )}

            <ToastContainer toasts={toasts} />
        </div>
    );
}