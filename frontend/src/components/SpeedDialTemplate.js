/**
 * SpeedDialTemplate Component
 * 
 * A floating action button with expandable action menu.
 * Features a modern purple/indigo gradient FAB with glassmorphic action buttons.
 * 
 * Key Features:
 * - Fixed position in bottom-right corner
 * - Expandable actions that appear from the left
 * - Gradient FAB with hover scale animation
 * - Glassmorphic action buttons with backdrop blur
 * - Tooltips for each action item
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.actions - Array of action objects, each with: name (string), icon (element), action (function)
 * @returns {JSX.Element} The rendered speed dial
 * 
 * @example
 * const actions = [
 *   { name: 'Add', icon: <AddIcon />, action: () => console.log('Add clicked') },
 *   { name: 'Delete', icon: <DeleteIcon />, action: () => console.log('Delete clicked') }
 * ];
 * <SpeedDialTemplate actions={actions} />
 */

import React from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import styled from 'styled-components';

const SpeedDialTemplate = ({ actions }) => {
  return (
    <CustomSpeedDial
      ariaLabel="SpeedDial actions"
      icon={<TuneIcon />}
      direction="left"
    >
      {/* Render each action as a speed dial option */}
      {actions.map((action) => (
        <StyledSpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.action}
        />
      ))}
    </CustomSpeedDial>
  )
}

export default SpeedDialTemplate;

/**
 * ============================================
 * STYLED COMPONENTS
 * ============================================
 */

/**
 * CustomSpeedDial - The main FAB container
 * Features gradient background and fixed positioning
 */
const CustomSpeedDial = styled(SpeedDial)`
  && {
    position: fixed;
    bottom: 20px;
    right: 20px;
    
    .MuiSpeedDial-fab {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      
      &:hover {
        background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
        transform: scale(1.05);
        box-shadow: 0 12px 30px rgba(99, 102, 241, 0.5);
      }
    }
  }
`;

const StyledSpeedDialAction = styled(SpeedDialAction)`
  && {
    .MuiFab-root {
      background: rgba(30, 30, 60, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(40, 40, 70, 0.95);
        border-color: rgba(255, 255, 255, 0.2);
        transform: scale(1.08);
      }
    }
    
    .MuiSpeedDialAction-staticTooltipLabel {
      background: rgba(30, 30, 60, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      white-space: nowrap;
    }
  }
`;