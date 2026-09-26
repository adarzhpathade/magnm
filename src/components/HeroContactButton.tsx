'use client';

import React from 'react';
import { KineticShiftButton, type KineticShiftButtonProps } from './KineticShiftButton';

export type HeroContactButtonProps = KineticShiftButtonProps;

/**
 * HeroContactButton — Backwards-compatible alias for KineticShiftButton.
 * See KineticShiftButton for full implementation and props documentation.
 */
export const HeroContactButton: React.FC<HeroContactButtonProps> = (props) => {
  return <KineticShiftButton {...props} />;
};

export default HeroContactButton;

