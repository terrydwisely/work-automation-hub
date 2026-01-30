import React from 'react';
import { Handle, Position } from 'reactflow';

export default function CenterNode({ data }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f3460, #16213e)',
      border: '2px solid #e94560',
      borderRadius: '50%',
      width: 160,
      height: 160,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 20,
      boxShadow: '0 0 30px rgba(233, 69, 96, 0.3)',
    }}>
      <div style={{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 1.3,
      }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Top} id="top" style={{ background: '#e94560' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#e94560' }} />
      <Handle type="source" position={Position.Left} id="left" style={{ background: '#e94560' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#e94560' }} />
    </div>
  );
}
