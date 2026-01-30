import React from 'react';
import { Handle, Position } from 'reactflow';

export default function CenterNode({ data }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #E8930C, #92400E)',
      borderRadius: '50%',
      width: 140,
      height: 140,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 24,
      boxShadow: '0 8px 32px rgba(232, 147, 12, 0.25), 0 2px 8px rgba(0,0,0,0.4)',
      position: 'relative',
    }}>
      {/* Outer ring */}
      <div style={{
        position: 'absolute',
        inset: -6,
        borderRadius: '50%',
        border: '2px solid rgba(232, 147, 12, 0.25)',
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
        style={{ background: '#E8930C', border: '2px solid #111113', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} id="bottom"
        style={{ background: '#E8930C', border: '2px solid #111113', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Left} id="left"
        style={{ background: '#E8930C', border: '2px solid #111113', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} id="right"
        style={{ background: '#E8930C', border: '2px solid #111113', width: 8, height: 8 }} />
    </div>
  );
}
