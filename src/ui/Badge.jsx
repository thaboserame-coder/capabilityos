import PropTypes from 'prop-types';

/**
 * Small pill-shaped label used throughout the learner and admin portals
 * (tier levels, status indicators, category tags, etc).
 * @param {{label:string,color:string,bg:string}} props - Badge label and colour tokens.
 * @returns {JSX.Element}
 */
export default function Badge({ label, color, bg }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 20,
        background: bg || color + '18',
        fontSize: 11,
        fontWeight: 600,
        color,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  bg: PropTypes.string,
};
