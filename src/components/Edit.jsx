import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase_config";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import "../css/Edit.css";

export default function Edit() {
    const navigate   = useNavigate();
    const location   = useLocation();
    const id         = location.state;

    const [name, setName]     = useState('');
    const [sect, setSect]     = useState('');
    const [tel, setTel]       = useState('');
    const [loading, setLoading] = useState(true);
    const [theme, setTheme]   = useState(
        document.documentElement.getAttribute('data-theme') || 'dark'
    );

    const ref       = collection(db, '/stdphones');
    const targetDoc = doc(ref, id);

    // Sync theme with <html>
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        getDoc(targetDoc)
            .then(d => {
                const phone = d.data();
                setName(phone.name);
                setSect(phone.sect);
                setTel(phone.tel);
            })
            .catch(err => alert(err))
            .finally(() => setLoading(false));
    }, []);

    const editHandler = () => {
        updateDoc(targetDoc, { name, sect, tel })
            .then(() => navigate('/'))
            .catch(err => alert(err));
    };

    const isDark = theme === 'dark';

    return (
        <div className="edit-wrapper">

            {/* Topbar */}
            <div className="edit-topbar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <button
                    className="theme-toggle"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                >
                    {isDark ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>

            {/* Header */}
            <div className="edit-header">
                <h1>EDIT <span>STUDENT</span></h1>
                <p>Update student contact information</p>
            </div>

            {/* Form Card */}
            <div className="edit-form-card">
                <div className="form-title">Student Details</div>

                {loading ? (
                    <p style={{ color: 'var(--text-soft)', textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem', letterSpacing: '1px' }}>
                        LOADING...
                    </p>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" placeholder="Student name"
                                value={name} onChange={e => setName(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Section</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="rdSect" value="CED"
                                        checked={sect === 'CED'}
                                        onChange={e => setSect(e.target.value)} /> CED
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="rdSect" value="TCT"
                                        checked={sect === 'TCT'}
                                        onChange={e => setSect(e.target.value)} /> TCT
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="0xx-xxx-xxxx"
                                value={tel} onChange={e => setTel(e.target.value)} />
                        </div>

                        <div className="form-footer">
                            <button className="btn-cancel" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                            <button className="btn-save" onClick={editHandler}>
                                Save Changes
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}