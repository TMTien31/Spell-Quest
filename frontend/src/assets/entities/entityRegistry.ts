import type { ComponentType } from 'react';
import { GateIcon } from './svgEntities/GateIcon';
import { SporeWisp } from './svgEntities/SporeWisp';
import { VineCrawler } from './svgEntities/VineCrawler';
import { BarkGolem } from './svgEntities/BarkGolem';
import { Thornmaw } from './svgEntities/Thornmaw';
import { SylvanusEntity } from './svgEntities/SylvanusEntity';
import { PyraxisEntity } from './svgEntities/PyraxisEntity';
import { LexiconEntity } from './svgEntities/LexiconEntity';
import { FallbackEntity } from './svgEntities/FallbackEntity';
import {
  CipherShade,
  CinderGolem,
  CometShard,
  CounterfeitGolem,
  DebtCollector,
  DoubtShadow,
  DreadEntity,
  DustSpecter,
  DustWraith,
  EmberRat,
  FearWraith,
  HollowOwl,
  Huckster,
  InkBlob,
  MammonEntity,
  MemoryLeech,
  Mirage,
  NebulaWisp,
  PaperGolem,
  Parallax,
  PhantasmaEntity,
  Pickpocket,
  PrismSprite,
  RippleWatcher,
  SaltCrab,
  Scorch,
  SleepWisp,
  SolarisEntity,
  SomnosEntity,
  TheBroker,
  TheCataloguer,
  Tollkeeper,
  Umbra,
  VoidTendril,
  Whisperwind
} from './svgEntities/WorldMapEntities';
import {
  AbyssalEye,
  BarnacleHusk,
  BastionEntity,
  BoltCrawler,
  CannonShell,
  CrescendoEntity,
  DeepLurker,
  FaithFragment,
  GodlessColossus,
  InkSquid,
  JesterPuppet,
  KaleidoscopeEntity,
  LaughterShade,
  LeviathanEntity,
  MirrorMime,
  OblivionEntity,
  OracleEntity,
  PatchworkEntity,
  ProphecyWisp,
  RampartEntity,
  RingmasterEntity,
  RiptideEntity,
  RuneSpecter,
  RustSentinel,
  SteelColossus,
  TideWraith,
  VestigeEntity,
  WardenEntity
} from './svgEntities/LateWorldEntities';

export type AssetType = 'svg' | 'sprite' | 'lottie';
export type EntityState = 'idle' | 'hit' | 'dead' | 'attack';
export type IdleAnim = 'float' | 'pulse' | 'breathe' | 'none';

export interface SVGEntityProps {
  width: number;
  height: number;
  state: EntityState;
}

export interface EntityConfig {
  id: string;
  displayName: string;
  description: string;
  habitat: 'Whispering Woods' | 'Crystal Caverns' | 'Dragon Peak' | 'Arcane Crossroads' | 'Others';
  role: 'gate' | 'creature' | 'boss' | 'unknown';
  bossTier?: 'miniboss' | 'final';
  assetType: AssetType;
  svgComponent?: ComponentType<SVGEntityProps>;
  spriteSrc?: string;
  spriteFrameWidth?: number;
  spriteFrameHeight?: number;
  spriteFrameCount?: number;
  lottieData?: object;
  idleAnimation: IdleAnim;
  hitAnimation: 'flash' | 'shake' | 'none';
}

export const entityRegistry: Record<string, EntityConfig> = {
  gate: {
    id: 'gate',
    displayName: 'Runegate Sentinel',
    description: 'A sealed spell-door that tests travelers before letting them deeper into the path.',
    habitat: 'Arcane Crossroads',
    role: 'gate',
    assetType: 'svg',
    svgComponent: GateIcon,
    idleAnimation: 'pulse',
    hitAnimation: 'flash'
  },
  spore_puff: {
    id: 'spore_puff',
    displayName: 'Spore Puff',
    description: 'A drifting woodland wisp that scatters sleepy spores when startled.',
    habitat: 'Whispering Woods',
    role: 'creature',
    assetType: 'svg',
    svgComponent: SporeWisp,
    idleAnimation: 'float',
    hitAnimation: 'shake'
  },
  vine_crawler: {
    id: 'vine_crawler',
    displayName: 'Vine Crawler',
    description: 'A twisting root-serpent that hides under mossy paths and snaps at wrong syllables.',
    habitat: 'Whispering Woods',
    role: 'creature',
    assetType: 'svg',
    svgComponent: VineCrawler,
    idleAnimation: 'float',
    hitAnimation: 'shake'
  },
  bark_golem: {
    id: 'bark_golem',
    displayName: 'Bark Golem',
    description: 'A square-shouldered guardian carved from old bark and stubborn stone.',
    habitat: 'Crystal Caverns',
    role: 'creature',
    assetType: 'svg',
    svgComponent: BarkGolem,
    idleAnimation: 'breathe',
    hitAnimation: 'shake'
  },
  thornmaw: {
    id: 'thornmaw',
    displayName: 'Thornmaw',
    description: 'A jagged cave predator with a grin full of violet thorns.',
    habitat: 'Crystal Caverns',
    role: 'boss',
    bossTier: 'miniboss',
    assetType: 'svg',
    svgComponent: Thornmaw,
    idleAnimation: 'pulse',
    hitAnimation: 'flash'
  },
  sylvanus: {
    id: 'sylvanus',
    displayName: 'Sylvanus, Root-Crowned',
    description: 'The ancient forest boss, grown around forgotten grammar and living roots.',
    habitat: 'Whispering Woods',
    role: 'boss',
    bossTier: 'final',
    assetType: 'svg',
    svgComponent: SylvanusEntity,
    idleAnimation: 'breathe',
    hitAnimation: 'flash'
  },
  pyraxis: {
    id: 'pyraxis',
    displayName: 'Pyraxis, Ember-Wing',
    description: 'A geometric dragon boss that burns hesitation into sparks.',
    habitat: 'Dragon Peak',
    role: 'boss',
    bossTier: 'final',
    assetType: 'svg',
    svgComponent: PyraxisEntity,
    idleAnimation: 'breathe',
    hitAnimation: 'flash'
  },
  lexicon: {
    id: 'lexicon',
    displayName: 'The Living Lexicon',
    description: 'A watchful book-boss whose pages blink with ancient vocabulary.',
    habitat: 'Crystal Caverns',
    role: 'boss',
    bossTier: 'final',
    assetType: 'svg',
    svgComponent: LexiconEntity,
    idleAnimation: 'float',
    hitAnimation: 'flash'
  },
  whisperwind: { id: 'whisperwind', displayName: 'Whisperwind', description: 'A faceless forest draft that speaks in rustling leaves and half-heard echoes.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: Whisperwind, idleAnimation: 'float', hitAnimation: 'shake' },
  hollow_owl: { id: 'hollow_owl', displayName: 'Hollow Owl', description: 'An empty-eyed owl that listens for thoughts before they become words.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: HollowOwl, idleAnimation: 'float', hitAnimation: 'flash' },
  ink_blob: { id: 'ink_blob', displayName: 'Ink Blob', description: 'A living stain of library ink that crawls between drowned shelves.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: InkBlob, idleAnimation: 'breathe', hitAnimation: 'shake' },
  paper_golem: { id: 'paper_golem', displayName: 'Paper Golem', description: 'A folded construct made from torn pages, margins, and stubborn footnotes.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: PaperGolem, idleAnimation: 'breathe', hitAnimation: 'shake' },
  ripple_watcher: { id: 'ripple_watcher', displayName: 'Ripple Watcher', description: 'A still-water eye that reflects every mistake back with a distorted grin.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: RippleWatcher, idleAnimation: 'pulse', hitAnimation: 'flash' },
  dust_specter: { id: 'dust_specter', displayName: 'Dust Specter', description: 'A quiet archive ghost formed from old dust and forgotten annotations.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: DustSpecter, idleAnimation: 'float', hitAnimation: 'flash' },
  cataloguer: { id: 'cataloguer', displayName: 'The Cataloguer', description: 'An undead librarian who still files every traveler under overdue trouble.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: TheCataloguer, idleAnimation: 'breathe', hitAnimation: 'shake' },
  cipher_shade: { id: 'cipher_shade', displayName: 'Cipher Shade', description: 'A coded shadow that breaks itself into symbols before striking.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: CipherShade, idleAnimation: 'pulse', hitAnimation: 'flash' },
  ember_rat: { id: 'ember_rat', displayName: 'Ember Rat', description: 'A coal-bright scavenger that leaves tiny sparks wherever it runs.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: EmberRat, idleAnimation: 'float', hitAnimation: 'shake' },
  dust_wraith: { id: 'dust_wraith', displayName: 'Dust Wraith', description: 'A badlands spirit wrapped in sand, ash, and unfinished grudges.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: DustWraith, idleAnimation: 'float', hitAnimation: 'flash' },
  scorch: { id: 'scorch', displayName: 'Scorch', description: 'A miniboss born from a burn mark that refused to cool.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: Scorch, idleAnimation: 'pulse', hitAnimation: 'flash' },
  salt_crab: { id: 'salt_crab', displayName: 'Salt Crab', description: 'A crystal-armored crab that clacks across dry flats like a handful of bones.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: SaltCrab, idleAnimation: 'breathe', hitAnimation: 'shake' },
  mirage: { id: 'mirage', displayName: 'Mirage', description: 'A golden illusion that stands exactly where it should not be.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: Mirage, idleAnimation: 'pulse', hitAnimation: 'flash' },
  cinder_golem: { id: 'cinder_golem', displayName: 'Cinder Golem', description: 'A half-burned construct held together by cracked charcoal and rage.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: CinderGolem, idleAnimation: 'breathe', hitAnimation: 'shake' },
  nebula_wisp: { id: 'nebula_wisp', displayName: 'Nebula Wisp', description: 'A drifting puff of star smoke with small lights moving inside it.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: NebulaWisp, idleAnimation: 'float', hitAnimation: 'flash' },
  comet_shard: { id: 'comet_shard', displayName: 'Comet Shard', description: 'A conscious meteor fragment still trailing the shape of its fall.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: CometShard, idleAnimation: 'float', hitAnimation: 'shake' },
  parallax: { id: 'parallax', displayName: 'Parallax', description: 'A shifting lens-being that is never quite where the eye says it is.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: Parallax, idleAnimation: 'pulse', hitAnimation: 'flash' },
  prism_sprite: { id: 'prism_sprite', displayName: 'Prism Sprite', description: 'A bright little trickster that splits light into sharp, colorful edges.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: PrismSprite, idleAnimation: 'float', hitAnimation: 'flash' },
  umbra: { id: 'umbra', displayName: 'Umbra', description: 'A living eclipse made from the presence of pure shadow.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: Umbra, idleAnimation: 'pulse', hitAnimation: 'flash' },
  void_tendril: { id: 'void_tendril', displayName: 'Void Tendril', description: 'A reaching strand of nothingness that curls out from between stars.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: VoidTendril, idleAnimation: 'float', hitAnimation: 'shake' },
  solaris: { id: 'solaris', displayName: 'Solaris the Dying Star', description: 'A collapsing star-boss whose final light is more dangerous than its prime.', habitat: 'Others', role: 'boss', bossTier: 'final', assetType: 'svg', svgComponent: SolarisEntity, idleAnimation: 'pulse', hitAnimation: 'flash' },
  pickpocket: { id: 'pickpocket', displayName: 'Pickpocket', description: 'A quick-handed market sneak who treats every pocket like an invitation.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: Pickpocket, idleAnimation: 'float', hitAnimation: 'shake' },
  huckster: { id: 'huckster', displayName: 'Huckster', description: 'A counterfeit merchant wrapped in smiles, bags, and very bad deals.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: Huckster, idleAnimation: 'breathe', hitAnimation: 'shake' },
  tollkeeper: { id: 'tollkeeper', displayName: 'Tollkeeper', description: 'A gate-fee miniboss who believes every step forward has a price.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: Tollkeeper, idleAnimation: 'pulse', hitAnimation: 'flash' },
  debt_collector: { id: 'debt_collector', displayName: 'Debt Collector', description: 'A red-eyed enforcer carrying a ledger full of impossible balances.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: DebtCollector, idleAnimation: 'breathe', hitAnimation: 'shake' },
  broker: { id: 'broker', displayName: 'The Broker', description: 'A dealmaker miniboss who lets contracts and hired blades do the fighting.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: TheBroker, idleAnimation: 'pulse', hitAnimation: 'flash' },
  counterfeit_golem: { id: 'counterfeit_golem', displayName: 'Counterfeit Golem', description: 'A plated brute stamped from false coins and hollow promises.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: CounterfeitGolem, idleAnimation: 'breathe', hitAnimation: 'shake' },
  mammon: { id: 'mammon', displayName: 'Mammon the Gold Tyrant', description: 'A gilded greed-boss that knows the exact value of everything you own.', habitat: 'Others', role: 'boss', bossTier: 'final', assetType: 'svg', svgComponent: MammonEntity, idleAnimation: 'pulse', hitAnimation: 'flash' },
  sleep_wisp: { id: 'sleep_wisp', displayName: 'Sleep Wisp', description: 'A drowsy glow that makes eyelids heavy and timing slippery.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: SleepWisp, idleAnimation: 'float', hitAnimation: 'flash' },
  doubt_shadow: { id: 'doubt_shadow', displayName: 'Doubt Shadow', description: 'A question-shaped shadow that feeds on hesitation.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: DoubtShadow, idleAnimation: 'breathe', hitAnimation: 'flash' },
  somnos: { id: 'somnos', displayName: 'Somnos', description: 'A sleep-god miniboss whose lullaby turns seconds into fog.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: SomnosEntity, idleAnimation: 'float', hitAnimation: 'shake' },
  fear_wraith: { id: 'fear_wraith', displayName: 'Fear Wraith', description: 'A sharp-edged nightmare that wears the outline of whatever frightens you.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: FearWraith, idleAnimation: 'float', hitAnimation: 'flash' },
  dread: { id: 'dread', displayName: 'Dread', description: 'A miniboss without one fixed face, built from the idea of panic itself.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: DreadEntity, idleAnimation: 'pulse', hitAnimation: 'flash' },
  memory_leech: { id: 'memory_leech', displayName: 'Memory Leech', description: 'A pink parasite that bites into recollection and leaves only echoes.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: MemoryLeech, idleAnimation: 'float', hitAnimation: 'shake' },
  phantasma: { id: 'phantasma', displayName: 'Phantasma the Dream Eater', description: 'An ancient dream-boss that has learned language by eating sleepers stories.', habitat: 'Others', role: 'boss', bossTier: 'final', assetType: 'svg', svgComponent: PhantasmaEntity, idleAnimation: 'breathe', hitAnimation: 'flash' },
  barnacle_husk: { id: 'barnacle_husk', displayName: 'Barnacle Husk', description: 'A drowned dock-shell clinging to old wreckwood, scraping forward with salt-stiff limbs.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: BarnacleHusk, idleAnimation: 'breathe', hitAnimation: 'shake' },
  tide_wraith: { id: 'tide_wraith', displayName: 'Tide Wraith', description: 'A drowned sailor-spirit pulled thin by moonlit currents and unfinished voyages.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: TideWraith, idleAnimation: 'float', hitAnimation: 'flash' },
  riptide: { id: 'riptide', displayName: 'Riptide', description: 'A conscious reverse-current that drags every careless step back into the deep.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: RiptideEntity, idleAnimation: 'pulse', hitAnimation: 'shake' },
  ink_squid: { id: 'ink_squid', displayName: 'Ink Squid', description: 'A warrior squid whose ink blooms into confusing black clouds around its prey.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: InkSquid, idleAnimation: 'float', hitAnimation: 'flash' },
  abyssal_eye: { id: 'abyssal_eye', displayName: 'Abyssal Eye', description: 'A giant eye rising from the seafloor, patient enough to make thoughts drift away.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: AbyssalEye, idleAnimation: 'pulse', hitAnimation: 'flash' },
  deep_lurker: { id: 'deep_lurker', displayName: 'Deep Lurker', description: 'A silent trench-creature that waits below every ripple for the moment attention slips.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: DeepLurker, idleAnimation: 'breathe', hitAnimation: 'shake' },
  leviathan: { id: 'leviathan', displayName: 'Leviathan the Tide Sovereign', description: 'An ancient sea ruler whose breath raises and withdraws the tides themselves.', habitat: 'Others', role: 'boss', bossTier: 'final', assetType: 'svg', svgComponent: LeviathanEntity, idleAnimation: 'breathe', hitAnimation: 'flash' },
  rust_sentinel: { id: 'rust_sentinel', displayName: 'Rust Sentinel', description: 'An automatic guard still saluting commands that ended centuries ago.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: RustSentinel, idleAnimation: 'breathe', hitAnimation: 'shake' },
  bolt_crawler: { id: 'bolt_crawler', displayName: 'Bolt Crawler', description: 'A skittering screw-spider assembled from loose bolts, wire, and bad intent.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: BoltCrawler, idleAnimation: 'float', hitAnimation: 'shake' },
  rampart: { id: 'rampart', displayName: 'Rampart', description: 'A walking wall that wins fights by leaving no room to breathe.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: RampartEntity, idleAnimation: 'breathe', hitAnimation: 'shake' },
  cannon_shell: { id: 'cannon_shell', displayName: 'Cannon Shell', description: 'An unexploded artillery round that rolls with a deeply worrying sense of purpose.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: CannonShell, idleAnimation: 'pulse', hitAnimation: 'flash' },
  warden: { id: 'warden', displayName: 'The Warden', description: 'An armory keeper fused with chains, steel, and the habit of command.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: WardenEntity, idleAnimation: 'breathe', hitAnimation: 'shake' },
  steel_colossus: { id: 'steel_colossus', displayName: 'Steel Colossus', description: 'A self-operating giant of plated metal and old battlefield orders.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: SteelColossus, idleAnimation: 'breathe', hitAnimation: 'shake' },
  bastion: { id: 'bastion', displayName: 'Bastion the Last Commander', description: 'A fortress-command AI that forgot every purpose except continuing the war.', habitat: 'Others', role: 'boss', bossTier: 'final', assetType: 'svg', svgComponent: BastionEntity, idleAnimation: 'pulse', hitAnimation: 'flash' },
  jester_puppet: { id: 'jester_puppet', displayName: 'Jester Puppet', description: 'A clown puppet that keeps moving after the strings have been cut.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: JesterPuppet, idleAnimation: 'float', hitAnimation: 'shake' },
  mirror_mime: { id: 'mirror_mime', displayName: 'Mirror Mime', description: 'A silent performer that reflects gestures back with a sharper edge.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: MirrorMime, idleAnimation: 'breathe', hitAnimation: 'flash' },
  patchwork: { id: 'patchwork', displayName: 'Patchwork', description: 'A stitched-together stage thing made from every costume that ever failed its owner.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: PatchworkEntity, idleAnimation: 'breathe', hitAnimation: 'shake' },
  laughter_shade: { id: 'laughter_shade', displayName: 'Laughter Shade', description: 'A laugh given shape, bright at the edges and cruel in the middle.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: LaughterShade, idleAnimation: 'float', hitAnimation: 'flash' },
  kaleidoscope: { id: 'kaleidoscope', displayName: 'Kaleidoscope', description: 'A mirror-being of a thousand versions, each one almost true enough to strike.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: KaleidoscopeEntity, idleAnimation: 'pulse', hitAnimation: 'flash' },
  crescendo: { id: 'crescendo', displayName: 'Crescendo', description: 'A music note gone wild, swelling louder until it becomes a weapon.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: CrescendoEntity, idleAnimation: 'pulse', hitAnimation: 'flash' },
  ringmaster: { id: 'ringmaster', displayName: 'The Ringmaster', description: 'A master of ceremonies who performed so long that reality became part of the act.', habitat: 'Others', role: 'boss', bossTier: 'final', assetType: 'svg', svgComponent: RingmasterEntity, idleAnimation: 'breathe', hitAnimation: 'flash' },
  faith_fragment: { id: 'faith_fragment', displayName: 'Faith Fragment', description: 'A splinter of abandoned belief, still glowing where devotion broke away.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: FaithFragment, idleAnimation: 'float', hitAnimation: 'flash' },
  rune_specter: { id: 'rune_specter', displayName: 'Rune Specter', description: 'A carved-word ghost that drifts through broken temples in forgotten grammar.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: RuneSpecter, idleAnimation: 'float', hitAnimation: 'flash' },
  vestige: { id: 'vestige', displayName: 'Vestige', description: 'A remnant of divinity, too weak to be a god and too strong to disappear.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: VestigeEntity, idleAnimation: 'pulse', hitAnimation: 'flash' },
  prophecy_wisp: { id: 'prophecy_wisp', displayName: 'Prophecy Wisp', description: 'A living prediction, flickering with futures that may already be too late.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: ProphecyWisp, idleAnimation: 'float', hitAnimation: 'flash' },
  oracle: { id: 'oracle', displayName: 'The Oracle', description: 'A seer who knows the next mistake before the hand begins to move.', habitat: 'Others', role: 'boss', bossTier: 'miniboss', assetType: 'svg', svgComponent: OracleEntity, idleAnimation: 'breathe', hitAnimation: 'flash' },
  godless_colossus: { id: 'godless_colossus', displayName: 'Godless Colossus', description: 'A giant built for worship that now kneels to nothing at all.', habitat: 'Others', role: 'creature', assetType: 'svg', svgComponent: GodlessColossus, idleAnimation: 'breathe', hitAnimation: 'shake' },
  oblivion: { id: 'oblivion', displayName: 'Oblivion the Forgotten God', description: 'A nameless god whose last power is being impossible to fully remember.', habitat: 'Others', role: 'boss', bossTier: 'final', assetType: 'svg', svgComponent: OblivionEntity, idleAnimation: 'pulse', hitAnimation: 'flash' },
  fallback: {
    id: 'fallback',
    displayName: 'Unknown Shade',
    description: 'A nameless silhouette used when an entity id is missing from the registry.',
    habitat: 'Arcane Crossroads',
    role: 'unknown',
    assetType: 'svg',
    svgComponent: FallbackEntity,
    idleAnimation: 'none',
    hitAnimation: 'none'
  },
};
