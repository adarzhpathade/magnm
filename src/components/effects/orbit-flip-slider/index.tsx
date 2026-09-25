'use client';

// Built using Hyperiux Vault: https://vault.hyperiux.com
import React, { forwardRef } from 'react';
import OrbitFlipSliderComp, {
  type OrbitFlipSliderHandle,
  type OrbitFlipSliderCompProps,
  type OrbitFlipSliderItem,
  type OrbitFlipSliderMode,
} from './OrbitFlipSliderComp';

export type { OrbitFlipSliderHandle, OrbitFlipSliderCompProps, OrbitFlipSliderItem, OrbitFlipSliderMode };

export interface OrbitFlipSliderProps extends OrbitFlipSliderCompProps {}

const defaultItems: OrbitFlipSliderItem[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  image: `https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-${String((i % 10) + 1).padStart(2, '0')}.jpg`,
  alt: `Selected work ${i + 1}`,
}));

export const OrbitFlipSlider = forwardRef<OrbitFlipSliderHandle, OrbitFlipSliderProps>(
  (
    {
      items = defaultItems,
      backgroundColor = 'transparent',
      imageWidth = 190,
      imageHeight = 260,
      imageGap = 0,
      rounded = 'rounded-sm',
      enableHoverMovement = true,
      hoverMoveY = -12,
      perspectiveRotateValue = 160,
      perspectiveRotateDirection = 'right',
      rotate = true,
      rotateSpeed = 3,
      stopRotationOnHover = true,
      initialMode = 'ring',
      showModeControls = false,
      flatRadiusX = 1,
      flatRadiusY = 1,
      flatScale = 1,
      ringRotateX = 31,
      ringRotateY = 56,
      ringRotateZ = -25,
      ringRadiusX = 1.5,
      ringRadiusY = 0.65,
      ringScale = 0.6,
      tiltRotateX = 70,
      tiltRotateY = 0,
      tiltRotateZ = 0,
      tiltRadiusX = 1.2,
      tiltRadiusY = 1,
      tiltScale = 1,
      tiltMoveY = 325,
      galleryRotateX = 10,
      galleryRotateY = 0,
      galleryRotateZ = 0,
      galleryRadiusX = 1,
      galleryRadiusY = 1,
      galleryScale = 1,
      ...props
    },
    ref
  ) => {
    return (
      <OrbitFlipSliderComp
        ref={ref}
        items={items}
        backgroundColor={backgroundColor}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        imageGap={imageGap}
        rounded={rounded}
        enableHoverMovement={enableHoverMovement}
        hoverMoveY={hoverMoveY}
        perspectiveRotateValue={perspectiveRotateValue}
        perspectiveRotateDirection={perspectiveRotateDirection}
        rotate={rotate}
        rotateSpeed={rotateSpeed}
        stopRotationOnHover={stopRotationOnHover}
        initialMode={initialMode}
        showModeControls={showModeControls}
        flatRadiusX={flatRadiusX}
        flatRadiusY={flatRadiusY}
        flatScale={flatScale}
        ringRotateX={ringRotateX}
        ringRotateY={ringRotateY}
        ringRotateZ={ringRotateZ}
        ringRadiusX={ringRadiusX}
        ringRadiusY={ringRadiusY}
        ringScale={ringScale}
        tiltRotateX={tiltRotateX}
        tiltRotateY={tiltRotateY}
        tiltRotateZ={tiltRotateZ}
        tiltRadiusX={tiltRadiusX}
        tiltRadiusY={tiltRadiusY}
        tiltScale={tiltScale}
        tiltMoveY={tiltMoveY}
        galleryRotateX={galleryRotateX}
        galleryRotateY={galleryRotateY}
        galleryRotateZ={galleryRotateZ}
        galleryRadiusX={galleryRadiusX}
        galleryRadiusY={galleryRadiusY}
        galleryScale={galleryScale}
        {...props}
      />
    );
  }
);

OrbitFlipSlider.displayName = 'OrbitFlipSlider';
export default OrbitFlipSlider;
