import type { EntityConfig, EntityState } from '../assets/entities/entityRegistry';
import { entityRegistry } from '../assets/entities/entityRegistry';
import { FallbackEntity } from '../assets/entities/svgEntities/FallbackEntity';
import { cn } from '../utils/gameUtils';

type EntitySize = 'sm' | 'md' | 'lg' | 'xl';

interface EntityDisplayProps {
  entityId: string;
  size?: EntitySize;
  state?: EntityState;
  className?: string;
}

const sizeMap: Record<EntitySize, number> = { sm: 48, md: 72, lg: 96, xl: 128 };

const getIdleAnimationClass = (config: EntityConfig, state: EntityState) => {
  if (state !== 'idle' || config.idleAnimation === 'none') return null;
  return `anim-${config.idleAnimation}`;
};

const getHitAnimationClass = (config: EntityConfig, state: EntityState) => {
  if (state !== 'hit' || config.hitAnimation === 'none') return null;
  return `anim-hit-${config.hitAnimation}`;
};

export function EntityDisplay({ entityId, size = 'md', state = 'idle', className }: EntityDisplayProps) {
  const config = entityRegistry[entityId] ?? entityRegistry.fallback;
  const px = sizeMap[size];
  const animationClass = cn(getIdleAnimationClass(config, state), getHitAnimationClass(config, state));

  if (config.assetType === 'svg' && config.svgComponent) {
    const SVGComponent = config.svgComponent;

    return (
      <div
        className={cn('entity-display inline-flex items-center justify-center', animationClass, className)}
        style={{ width: px, height: px }}
        aria-label={config.displayName}
      >
        <SVGComponent width={px} height={px} state={state} />
      </div>
    );
  }

  if (config.assetType === 'sprite' && config.spriteSrc) {
    return (
      <div
        className={cn('entity-display inline-flex items-center justify-center bg-center bg-no-repeat', animationClass, className)}
        style={{
          width: px,
          height: px,
          backgroundImage: `url(${config.spriteSrc})`,
          backgroundSize: `${config.spriteFrameWidth ?? px}px ${config.spriteFrameHeight ?? px}px`,
        }}
        aria-label={config.displayName}
      />
    );
  }

  if (config.assetType === 'lottie' && config.lottieData) {
    return (
      <div
        className={cn('entity-display inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-[10px] uppercase text-slate-500', animationClass, className)}
        style={{ width: px, height: px }}
        aria-label={config.displayName}
      >
        lottie
      </div>
    );
  }

  return (
    <div className={cn('entity-display inline-flex items-center justify-center', className)} style={{ width: px, height: px }}>
      <FallbackEntity width={px} height={px} state={state} />
    </div>
  );
}
