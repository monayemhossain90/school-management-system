/**
 * Button Styles Module
 * 
 * A collection of styled button components using Material-UI and styled-components.
 * All buttons feature modern design with gradients, hover animations, and glow effects.
 * 
 * Design Principles:
 * - Gradient backgrounds for visual appeal
 * - Box shadows with color matching the button theme
 * - Cubic-bezier transitions for natural, bouncy animations
 * - translateY hover effects for interactive feel
 * - Consistent border-radius (12px) across all variants
 * 
 * Available Button Variants:
 * - PrimaryButton: Purple/indigo gradient (main CTA)
 * - RedButton: Red gradient (destructive actions)
 * - BlackButton: Dark with border (secondary actions)
 * - DarkRedButton: Darker red (severe warnings)
 * - BlueButton: Blue gradient (informational)
 * - PurpleButton: Purple gradient (accent)
 * - GreenButton: Green gradient (success/confirm)
 * - BrownButton: Amber/brown gradient (neutral)
 * - IndigoButton: Deep indigo (primary variant)
 * - LightPurpleButton: Light purple (subtle primary)
 * - GreenStyledButton: Emerald gradient (student theme)
 * - OutlinedButton: Transparent with border (ghost style)
 * - GhostButton: Minimal styling (text-only appearance)
 * 
 * @module buttonStyles
 */

import styled from 'styled-components';
import { Button } from '@mui/material';

/**
 * PrimaryButton - Main call-to-action button
 * Features purple/indigo gradient with glow effect
 */
export const PrimaryButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff;
    padding: 12px 28px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    &:hover {
      background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.45);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      background: linear-gradient(135deg, #4b4b6b 0%, #3d3d5c 100%);
      box-shadow: none;
    }
  }
`;

export const RedButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    color: white;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #f87171 0%, #fca5a5 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

export const BlackButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #1f1f2e 0%, #2d2d44 100%);
    color: white;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #2d2d44 0%, #3d3d5c 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

export const DarkRedButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #991b1b 0%, #b91c1c 100%);
    color: white;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(153, 27, 27, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(185, 28, 28, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

export const BlueButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    color: #fff;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

export const PurpleButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #fff;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

export const LightPurpleButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff;
    padding: 12px 28px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    &:hover {
      background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.45);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      background: linear-gradient(135deg, #4b4b6b 0%, #3d3d5c 100%);
      box-shadow: none;
    }
  }
`;

export const GreenButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: #fff;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

export const BrownButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #92400e 0%, #b45309 100%);
    color: white;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(146, 64, 14, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(180, 83, 9, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

export const IndigoButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: white;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

// Outlined button variant
export const OutlinedButton = styled(Button)`
  && {
    background: transparent;
    color: #6366f1;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    border: 2px solid #6366f1;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(99, 102, 241, 0.1);
      border-color: #818cf8;
      color: #818cf8;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

// Ghost button variant
export const GhostButton = styled(Button)`
  && {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 500;
    text-transform: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;
