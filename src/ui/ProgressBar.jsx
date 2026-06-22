import PropTypes from 'prop-types';

/**
 * Thin horizontal progress indicator used across module and tier completion views.
 * @param {{pct:number,color:string,h:number,gradient:string}} props - Fill percentage, colour, height, optional CSS gradient.
 * @returns {JSX.Element}
 */
export default function ProgressBar({ pct, color, h = 4, gradient }) {
  return (
    <div style={{ height: h, background: '#F2F2F7', borderRadius: h, overflow: 'hidden' }}>
      <div
        className="prog-bar"
        style={{
          width: pct + '%',
          height: '100%',
          borderRadius: h,
          background: gradient ? 'linear-gradient(90deg,' + color + ',' + color + '90)' : color,
        }}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  pct: PropTypes.number.isRequired,
  color: PropTypes.string,
  h: PropTypes.number,
  gradient: PropTypes.string,
};
