import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Transient notification toast for XP awards and badge unlocks. Auto-dismisses
 * after a delay (longer for badge celebrations than for plain XP awards).
 * @param {{n:object,onDone:Function}} props - n: notification payload (xp or badge); onDone: dismiss callback.
 * @returns {JSX.Element}
 */
export default function Toast({ n, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, n.type === 'badge' ? 4500 : 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className="slide-in"
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        background: 'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(40px)',
        borderRadius: 14,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        minWidth: 280,
        maxWidth: 340,
        boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {n.type === 'badge' ? (
        <>
          <div className="badge-pop" style={{ fontSize: 24, flexShrink: 0, marginTop: 1 }}>
            {n.badge.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#FF9F0A',
                textTransform: 'uppercase',
                letterSpacing: '.07em',
                marginBottom: 3,
              }}
            >
              Achievement Unlocked
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{n.badge.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
              {n.badge.desc}
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: 'rgba(0,112,243,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, color: '#5AC8FA' }}>+{n.amt}</span>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#5AC8FA',
                textTransform: 'uppercase',
                letterSpacing: '.07em',
                marginBottom: 3,
              }}
            >
              Learning Points
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{n.msg}</div>
          </div>
        </>
      )}
      <button
        onClick={onDone}
        aria-label="Dismiss notification"
        style={{
          marginLeft: 'auto',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.3)',
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}

Toast.propTypes = { n: PropTypes.any, onDone: PropTypes.func };
