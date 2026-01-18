import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const Toast = ({ show, onClose, title, message }) => {
  const MotionDiv = motion.div;
  
  return (
    <AnimatePresence>
      {show && (
        <MotionDiv
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed-top d-flex justify-content-center pt-5 px-3"
          style={{ zIndex: 9999, pointerEvents: 'none' }}
        >
          <div 
            className="bg-white rounded-1 shadow-lg position-relative border-top border-success border-4" 
            style={{ 
              width: '100%',
              maxWidth: '450px', 
              pointerEvents: 'auto',
              boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
              borderTopColor: '#4CAF50 !important'
            }}
          >
            <div className="p-4 d-flex align-items-start">
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" 
                style={{ 
                   width: '42px', 
                   height: '42px',
                   backgroundColor: '#72C15F' 
                }}>
                <Check className="text-white" size={24} strokeWidth={3} />
              </div>
              <div className="flex-grow-1">
                <h5 className="mb-1 fw-bold text-dark" style={{ 
                  fontSize: '1.2rem', 
                  fontFamily: 'var(--font-main, sans-serif)',
                  letterSpacing: '-0.01em'
                }}>{title}</h5>
                <p className="mb-0 text-muted" style={{ 
                  fontSize: '0.95rem',
                  lineHeight: '1.4',
                  fontFamily: 'var(--font-main, sans-serif)'
                }}>{message}</p>
              </div>
              <button 
                onClick={onClose}
                className="btn btn-link text-muted p-0 ms-2 opacity-50 hover-opacity-100"
                style={{ border: 'none', background: 'none', transition: 'opacity 0.2s' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default Toast;
