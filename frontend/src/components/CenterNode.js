import React from 'react';
import { Handle, Position } from 'reactflow';

export default function CenterNode({ data }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #D97706, #92400E)',
      borderRadius: '50%',
      width: 140,
      height: 140,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 24,
      boxShadow: '0 8px 32px rgba(217, 119, 6, 0.3), 0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative',
    }}>
      {/* Outer ring */}
      <div style={{
        position: 'absolute',
        inset: -6,
        borderRadius: '50%',
        border: '2px solid rgba(217, 119, 6, 0.2)',
        pointerEvents: 'none',
      }} />

      <div>
        <div style={{
          fontSize: 18,
          marginBottom: 2,
        }}>
          &#9670;
        </div>
        <div style={{
          color: '#FEFCE8',
          fontWeight: 700,
          fontSize: 12,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {data.label}
        </div>
      </div>

      <Handle type="source" position={Position.Top} id="top"
        style={{ background: '#D97706', border: '2px solid white', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} id="bottom"
        style={{ background: '#D97706', border: '2px solid white', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Left} id="left"
        style={{ background: '#D97706', border: '2px solid white', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} id="right"
        style={{ background: '#D97706', border: '2px solid white', width: 8, height: 8 }} />
    </div>
  );
}
