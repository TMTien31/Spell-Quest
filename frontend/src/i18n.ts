import type { EntityConfig } from './assets/entities/entityRegistry';
import type { InventoryItem, Reward } from './models/types';

export type AppLanguage = 'en' | 'vi';

type CopyTree = typeof en;

const en = {
  common: {
    english: 'English',
    vietnamese: 'Vietnamese',
    cancel: 'CANCEL',
    ok: 'OK',
    settings: 'Settings',
    language: 'Language',
    close: 'Close'
  },
  landing: {
    subtitle: 'Embark on an epic journey of words and magic.',
    login: 'LOGIN',
    signup: 'SIGN UP',
    guest: 'Play as Guest'
  },
  auth: {
    loginTitle: 'Login',
    signupTitle: 'Sign Up',
    note: 'Note: This is a placeholder. You can enter anything to proceed.',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    createAccount: 'CREATE ACCOUNT',
    back: 'Back'
  },
  mode: {
    title: 'Select Game Mode',
    adventureTitle: 'Adventure Mode',
    adventureDescription: 'Explore ten themed worlds with kid-friendly English words and creature encounters.',
    sandboxTitle: 'Sandbox Mode',
    sandboxDescription: 'Play with your own custom vocabulary library. Add, edit, and master your own words.',
    back: 'Back to Landing'
  },
  nav: {
    adventure: 'Adventure',
    bestiary: 'Bestiary',
    shop: 'Shop',
    library: 'Library'
  },
  settings: {
    eyebrow: 'Settings',
    title: 'Journey Settings',
    description: 'Choose how the interface speaks to you. English learning content stays in English where it matters.',
    languageTitle: 'Display language',
    languageDescription: 'Vietnamese mode translates the app frame, buttons, guidance, shops, and lore while preserving English vocabulary practice.',
    englishDescription: 'Keep the interface in English.',
    vietnameseDescription: 'Let the journey speak in polished Vietnamese.'
  },
  worldSelect: {
    eyebrow: 'Adventure',
    title: 'Choose a World',
    description: 'Pick a main map to explore its sub-maps, creatures, and focused word set.',
    worlds: 'worlds',
    world: 'World',
    submaps: 'Sub-maps',
    encounters: 'Encounters',
    words: 'Words',
    vocabularyThemes: 'Vocabulary themes'
  },
  map: {
    noData: 'No map data found.',
    resetJourney: 'RESET JOURNEY',
    allWorlds: 'All Worlds',
    world: 'World',
    of: 'of',
    submap: 'Sub-map',
    tap: 'TAP!',
    boss: 'BOSS',
    objective: 'objective',
    completed: (name: string) => `${name} is complete. Return to all worlds or continue your journey.`,
    remaining: (count: number, name: string) => `Complete ${count} more encounters in ${name} to face the Boss!`,
    bossAwaits: (name: string) => `The Boss of ${name} awaits.`,
    resetMap: 'RESET MAP',
    softReset: 'SOFT RESET',
    hardReset: 'HARD RESET'
  },
  bestiary: {
    eyebrow: 'Bestiary',
    title: 'Spellquest Entities',
    description: 'A field guide grouped by world, with each creature linked to its sub-map appearances.',
    entries: 'entries',
    bosses: 'bosses',
    final: 'final',
    found: 'found',
    searchPlaceholder: 'Search entities...',
    noResults: 'No entities match this search.',
    filters: {
      all: 'All',
      creature: 'Creatures',
      miniboss: 'Minibosses',
      finalBoss: 'Final Bosses'
    },
    fallbackTitle: 'Arcane Crossroads',
    fallbackDescription: 'General entities and legacy guardians not assigned to a world map.',
    roles: {
      gate: 'gate',
      creature: 'creature',
      boss: 'boss',
      unknown: 'unknown',
      miniboss: 'Miniboss',
      finalBoss: 'Final Boss'
    }
  },
  combat: {
    hp: 'HP',
    shield: 'SHIELD',
    streak: 'STREAK',
    shieldBlock: 'shield block',
    miss: 'miss',
    timer: 'timer',
    boss: 'BOSS',
    hitsRemaining: (hits: number, total: number) => `${hits}/${total} hits remaining`,
    titles: {
      gate: 'Unlock the Gate',
      enemy: 'Defeat the Enemy',
      treasure: 'Unlock the Treasure',
      boss: 'BOSS BATTLE',
      encounter: 'Encounter'
    },
    word: 'WORD',
    you: 'YOU',
    wordAnalysis: 'Word Analysis',
    vietnamese: 'Vietnamese',
    detailedMeaning: 'Detailed meaning',
    englishDefinition: 'English Definition',
    continueJourney: 'CONTINUE JOURNEY',
    attack: 'ATTACK',
    returnToMap: 'Return to Map',
    gateLost: 'Gate Lost! You have lost this gate!',
    messages: {
      shieldActivated: 'SHIELD ACTIVATED!',
      shieldRestored: 'SHIELD RESTORED!',
      enemyDefeated: 'ENEMY DEFEATED!',
      hit: (current: number, total: number) => `HIT ${current}/${total}! New word incoming!`,
      gateLocked: 'GATE LOCKED! You have been defeated!',
      close: (attempts: number, total: number) => `Close! (${attempts}/${total})`,
      miss: (attempts: number, total: number) => `MISS! (${attempts}/${total})`
    }
  },
  library: {
    title: 'Word Library',
    readOnly: (name: string) => `${name} word set. View only in Adventure Mode.`,
    addPlaceholder: 'Add word...',
    import: 'Import',
    resetAll: 'Reset All',
    duplicate: 'Word already exists!',
    importEmpty: 'No valid words found. Please enter a comma-separated list of words.',
    importSuccess: (count: number) => `Successfully imported ${count} words!`,
    importFailed: 'Failed to import words. Please check the format.',
    selectedWorld: 'Selected Adventure World'
  },
  shop: {
    title: 'Magic Shop',
    items: {
      hint: { label: 'Hint Token', description: 'Reveals one random letter.' },
      shield: { label: 'Shield', description: 'Blocks one mistake damage.' },
      reveal_letter: { label: 'Reveal Letter', description: 'Reveals two random letters.' },
      lucky_spin: { label: 'Lucky Spin', description: 'Try your luck for big rewards!' },
      candy: { label: 'Magic Candy', description: 'A sweet treat for high scorers.' },
      chocolate: { label: 'Dark Chocolate', description: 'Premium energy booster.' },
      cake: { label: 'Victory Cake', description: 'The ultimate celebration treat.' },
      armor_plate: { label: 'Armor Plate', description: 'Restores a portion of your shield.' }
    }
  },
  gameover: {
    title: 'Defeated',
    subtitle: 'Your journey ends here... for now.',
    levelReached: 'Level Reached',
    unknownLevel: 'Unknown Level',
    tryAgain: 'TRY AGAIN'
  },
  reset: {
    title: 'Are you sure?',
    hard: 'This will completely reset your entire journey, including all items, coins, and HP. This action cannot be undone.',
    all: 'This will reset your map progress but keep your items, coins, and HP.',
    words: 'Are you sure you want to clear all imported words and reset your progress? This action cannot be undone.',
    map: 'This will reset your progress on the current map. You will keep your items and coins, but map progress will be lost.',
    confirm: 'CONFIRM RESET'
  },
  congrats: {
    title: 'Victory!',
    message: 'Congratulations! You have defeated all the bosses and completed the game!',
    reward: 'Reward',
    coins: 'Coins',
    continue: 'Continue Journey'
  },
  importModal: {
    title: 'Import Words',
    description: 'Paste a list of words separated by commas (e.g., apple, banana, cherry).',
    placeholder: 'Enter words here...',
    action: 'IMPORT WORDS'
  },
  lucky: {
    title: 'LUCKY SPIN',
    subtitle: 'Fortune favors the bold',
    coins: 'coins',
    spin: 'SPIN',
    rewardUnlocked: 'Reward Unlocked',
    claim: 'CLAIM REWARD',
    cost: 'Spin cost:',
    exit: 'EXIT',
    insufficient: "You don't have enough coins to spin!"
  }
};

const vi: CopyTree = {
  common: {
    english: 'Tiếng Anh',
    vietnamese: 'Tiếng Việt',
    cancel: 'HỦY',
    ok: 'ĐÃ HIỂU',
    settings: 'Cài đặt',
    language: 'Ngôn ngữ',
    close: 'Đóng'
  },
  landing: {
    subtitle: 'Bước vào chuyến phiêu lưu của ngôn từ, phép thuật và những thử thách đánh vần.',
    login: 'ĐĂNG NHẬP',
    signup: 'TẠO TÀI KHOẢN',
    guest: 'Chơi thử với tư cách khách'
  },
  auth: {
    loginTitle: 'Đăng nhập',
    signupTitle: 'Tạo tài khoản',
    note: 'Ghi chú: đây là màn hình tạm. Bạn có thể nhập bất cứ thông tin nào để tiếp tục.',
    username: 'Tên người chơi',
    email: 'Email',
    password: 'Mật khẩu',
    createAccount: 'TẠO TÀI KHOẢN',
    back: 'Quay lại'
  },
  mode: {
    title: 'Chọn Hành Trình',
    adventureTitle: 'Chế Độ Phiêu Lưu',
    adventureDescription: 'Khám phá mười vùng đất chủ đề, chinh phục quái vật và luyện tiếng Anh qua từng trận đấu.',
    sandboxTitle: 'Chế Độ Tự Do',
    sandboxDescription: 'Tự xây thư viện từ vựng của riêng bạn, thêm từ mới và rèn luyện theo nhịp học cá nhân.',
    back: 'Quay về trang đầu'
  },
  nav: {
    adventure: 'Phiêu lưu',
    bestiary: 'Quái điển',
    shop: 'Cửa hàng',
    library: 'Thư viện'
  },
  settings: {
    eyebrow: 'Cài đặt',
    title: 'Điều Chỉnh Hành Trình',
    description: 'Chọn cách giao diện cất lời. Những phần quan trọng cho việc học tiếng Anh vẫn được giữ đúng bản chất.',
    languageTitle: 'Ngôn ngữ hiển thị',
    languageDescription: 'Chế độ tiếng Việt chuyển hóa khung giao diện, nút bấm, chỉ dẫn, cửa hàng và phần lore, đồng thời giữ nguyên nội dung luyện từ tiếng Anh.',
    englishDescription: 'Giữ giao diện bằng tiếng Anh.',
    vietnameseDescription: 'Để chuyến phiêu lưu ngân lên bằng tiếng Việt trau chuốt.'
  },
  worldSelect: {
    eyebrow: 'Phiêu lưu',
    title: 'Chọn Vùng Đất',
    description: 'Chọn một bản đồ lớn để mở các tiểu vùng, gặp sinh vật bản địa và luyện bộ từ vựng riêng của vùng ấy.',
    worlds: 'vùng đất',
    world: 'Vùng',
    submaps: 'Tiểu vùng',
    encounters: 'Chạm trán',
    words: 'Từ vựng',
    vocabularyThemes: 'Chủ đề từ vựng'
  },
  map: {
    noData: 'Không tìm thấy dữ liệu bản đồ.',
    resetJourney: 'LÀM MỚI HÀNH TRÌNH',
    allWorlds: 'Tất cả vùng đất',
    world: 'Vùng',
    of: 'trên',
    submap: 'Tiểu vùng',
    tap: 'CHỌN!',
    boss: 'TRÙM',
    objective: 'mục tiêu',
    completed: (name: string) => `${name} đã được chinh phục. Hãy trở về danh sách vùng đất hoặc tiếp tục mở lối mới.`,
    remaining: (count: number, name: string) => `Hoàn thành thêm ${count} cuộc chạm trán ở ${name} để diện kiến Trùm!`,
    bossAwaits: (name: string) => `Trùm của ${name} đang chờ bạn.`,
    resetMap: 'LÀM MỚI MAP',
    softReset: 'RESET NHẸ',
    hardReset: 'RESET TOÀN BỘ'
  },
  bestiary: {
    eyebrow: 'Quái điển',
    title: 'Sinh Vật Spellquest',
    description: 'Cuốn sổ thực địa được gom theo từng vùng đất, ghi lại nơi mỗi sinh vật xuất hiện.',
    entries: 'mục',
    bosses: 'trùm',
    final: 'trùm cuối',
    found: 'đã tìm thấy',
    searchPlaceholder: 'Tìm sinh vật...',
    noResults: 'Không tìm thấy sinh vật phù hợp.',
    filters: {
      all: 'Tất cả',
      creature: 'Sinh vật',
      miniboss: 'Á trùm',
      finalBoss: 'Trùm cuối'
    },
    fallbackTitle: 'Giao Lộ Huyền Thuật',
    fallbackDescription: 'Những thực thể chung và hộ vệ cũ chưa được gắn vào một bản đồ cụ thể.',
    roles: {
      gate: 'cổng ấn',
      creature: 'sinh vật',
      boss: 'trùm',
      unknown: 'ẩn ảnh',
      miniboss: 'Á Trùm',
      finalBoss: 'Trùm Cuối'
    }
  },
  combat: {
    hp: 'MÁU',
    shield: 'KHIÊN',
    streak: 'CHUỖI',
    shieldBlock: 'khiên chặn',
    miss: 'trượt',
    timer: 'thời gian',
    boss: 'TRÙM',
    hitsRemaining: (hits: number, total: number) => `còn ${hits}/${total} đòn`,
    titles: {
      gate: 'Mở Khóa Cánh Cổng',
      enemy: 'Đánh Bại Kẻ Địch',
      treasure: 'Mở Kho Báu',
      boss: 'ĐẠI CHIẾN TRÙM',
      encounter: 'Cuộc Chạm Trán'
    },
    word: 'TỪ',
    you: 'BẠN',
    wordAnalysis: 'Giải Mã Từ Vựng',
    vietnamese: 'Nghĩa tiếng Việt',
    detailedMeaning: 'Diễn giải chi tiết',
    englishDefinition: 'Định nghĩa tiếng Anh',
    continueJourney: 'TIẾP TỤC HÀNH TRÌNH',
    attack: 'TẤN CÔNG',
    returnToMap: 'Trở về bản đồ',
    gateLost: 'Cổng đã thất thủ! Bạn đã để mất lượt thử thách này.',
    messages: {
      shieldActivated: 'KHIÊN ĐÃ KHAI MỞ!',
      shieldRestored: 'KHIÊN ĐÃ ĐƯỢC HỒI PHỤC!',
      enemyDefeated: 'KẺ ĐỊCH ĐÃ BỊ ĐÁNH BẠI!',
      hit: (current: number, total: number) => `TRÚNG ĐÒN ${current}/${total}! Từ mới đang tới!`,
      gateLocked: 'CỔNG ĐÃ KHÓA! Bạn đã bị đánh bại!',
      close: (attempts: number, total: number) => `Gần đúng rồi! (${attempts}/${total})`,
      miss: (attempts: number, total: number) => `TRƯỢT! (${attempts}/${total})`
    }
  },
  library: {
    title: 'Thư Viện Từ Vựng',
    readOnly: (name: string) => `Bộ từ của ${name}. Trong Chế Độ Phiêu Lưu, thư viện chỉ dùng để xem.`,
    addPlaceholder: 'Thêm từ...',
    import: 'Nhập từ',
    resetAll: 'Xóa hết',
    duplicate: 'Từ này đã có trong thư viện!',
    importEmpty: 'Chưa tìm thấy từ hợp lệ. Hãy nhập danh sách từ, phân tách bằng dấu phẩy.',
    importSuccess: (count: number) => `Đã nhập thành công ${count} từ!`,
    importFailed: 'Không thể nhập từ. Vui lòng kiểm tra lại định dạng.',
    selectedWorld: 'Vùng phiêu lưu đã chọn'
  },
  shop: {
    title: 'Cửa Hàng Phép Thuật',
    items: {
      hint: { label: 'Bùa Gợi Ý', description: 'Mở một chữ cái ngẫu nhiên.' },
      shield: { label: 'Khiên Hộ Mệnh', description: 'Chặn một lần mất máu do sai sót.' },
      reveal_letter: { label: 'Ánh Sáng Chữ Cái', description: 'Mở ngay hai chữ cái ngẫu nhiên.' },
      lucky_spin: { label: 'Vòng Quay May Mắn', description: 'Thử vận may để nhận phần thưởng lớn.' },
      candy: { label: 'Kẹo Ma Thuật', description: 'Phần thưởng ngọt ngào cho người ghi điểm cao.' },
      chocolate: { label: 'Socola Đen', description: 'Nguồn năng lượng nhỏ mà sang.' },
      cake: { label: 'Bánh Chiến Thắng', description: 'Món ăn mừng dành cho khoảnh khắc huy hoàng.' },
      armor_plate: { label: 'Phiến Giáp', description: 'Hồi lại một phần khiên bảo vệ.' }
    }
  },
  gameover: {
    title: 'Thất Bại',
    subtitle: 'Hành trình khép lại ở đây... nhưng chỉ là tạm thời.',
    levelReached: 'Đã tới',
    unknownLevel: 'Vùng chưa rõ',
    tryAgain: 'THỬ LẠI'
  },
  reset: {
    title: 'Bạn chắc chứ?',
    hard: 'Thao tác này sẽ đặt lại toàn bộ hành trình, gồm vật phẩm, xu và máu. Một khi xác nhận, không thể hoàn tác.',
    all: 'Thao tác này sẽ đặt lại tiến trình bản đồ nhưng vẫn giữ vật phẩm, xu và máu.',
    words: 'Bạn có chắc muốn xóa toàn bộ từ đã nhập và đặt lại tiến trình không? Thao tác này không thể hoàn tác.',
    map: 'Thao tác này sẽ đặt lại tiến trình ở bản đồ hiện tại. Vật phẩm và xu vẫn được giữ, nhưng tiến độ map sẽ mất.',
    confirm: 'XÁC NHẬN RESET'
  },
  congrats: {
    title: 'Khải Hoàn!',
    message: 'Bạn đã đánh bại toàn bộ trùm và hoàn tất chuyến phiêu lưu!',
    reward: 'Phần thưởng',
    coins: 'Xu',
    continue: 'Tiếp tục hành trình'
  },
  importModal: {
    title: 'Nhập Từ Vựng',
    description: 'Dán danh sách từ, mỗi từ cách nhau bằng dấu phẩy, ví dụ: apple, banana, cherry.',
    placeholder: 'Nhập từ tại đây...',
    action: 'NHẬP TỪ'
  },
  lucky: {
    title: 'VÒNG QUAY MAY MẮN',
    subtitle: 'Vận may mỉm cười với người dám thử',
    coins: 'xu',
    spin: 'QUAY',
    rewardUnlocked: 'Phần Thưởng Đã Mở',
    claim: 'NHẬN THƯỞNG',
    cost: 'Phí quay:',
    exit: 'RỜI ĐI',
    insufficient: 'Bạn chưa có đủ xu để quay!'
  }
};

export const uiCopy: Record<AppLanguage, CopyTree> = { en, vi };

export const getCopy = (language: AppLanguage) => uiCopy[language];

export const localizeWorldDescription = (worldName: string | undefined, fallback: string | undefined, language: AppLanguage) => {
  if (language === 'en') return fallback;
  return worldDescriptionVi[worldName ?? ''] ?? fallback;
};

export const localizeWorldName = (worldName: string | undefined, language: AppLanguage) => {
  if (!worldName || language === 'en') return worldName;
  return worldNameVi[worldName] ?? worldName;
};

export const localizeSubmapName = (submapName: string | undefined, language: AppLanguage) => {
  if (!submapName || language === 'en') return submapName;
  return submapNameVi[submapName] ?? submapName;
};

export const localizeEntityName = (entity: EntityConfig, language: AppLanguage) => {
  if (language === 'en') return entity.displayName;
  const vietnameseName = entityNameVi[entity.id];
  return vietnameseName ? `${entity.displayName} - ${vietnameseName}` : entity.displayName;
};

export const localizeEntityDescription = (entity: EntityConfig, language: AppLanguage) => {
  if (language === 'en') return entity.description;
  return entityDescriptionVi[entity.id] ?? entity.description;
};

export const getRoleLabel = (entity: EntityConfig, language: AppLanguage) => {
  const roles = uiCopy[language].bestiary.roles;
  if (entity.role === 'boss') return entity.bossTier === 'final' ? roles.finalBoss : roles.miniboss;
  return roles[entity.role];
};

export const getInventoryLabel = (type: InventoryItem['type'], language: AppLanguage) =>
  uiCopy[language].shop.items[type]?.label ?? type.replace('_', ' ');

export const getInventoryDescription = (type: InventoryItem['type'], language: AppLanguage) =>
  uiCopy[language].shop.items[type]?.description ?? '';

export const getRewardLabel = (reward: Reward, language: AppLanguage) => {
  const item = uiCopy[language].shop.items[reward.type as InventoryItem['type']];
  if (reward.type === 'coin') return language === 'vi' ? 'Xu' : reward.label;
  if (reward.type === 'life') return language === 'vi' ? 'Hồi Máu' : reward.label;
  return item?.label ?? reward.label;
};

const worldNameVi: Record<string, string> = {
  'The Verdant Wilds': 'Miền Hoang Xanh Thẳm',
  'The Drowned Archives': 'Thư Viện Chìm',
  'The Ashen Badlands': 'Hoang Mạc Tro Tàn',
  'The Celestial Observatory': 'Thiên Văn Đài Tinh Tú',
  "The Merchant's Labyrinth": 'Mê Cung Thương Nhân',
  'The Dreamweave Sanctum': 'Thánh Địa Mộng Dệt',
  'The Tidal Crypts': 'Hầm Mộ Triều Cường',
  'The Iron Citadel': 'Pháo Đài Sắt',
  'The Carnival of Thorns': 'Lễ Hội Gai Nhọn',
  'The Shattered Pantheon': 'Điện Thờ Vỡ Vụn'
};

const submapNameVi: Record<string, string> = {
  'Mossy Gate': 'Cổng Rêu Phủ',
  'Canopy Labyrinth': 'Mê Lộ Tán Rừng',
  'The Ancient Grove': 'Lùm Cây Cổ Đại',
  'The Flooded Entrance': 'Lối Vào Ngập Nước',
  'The Reading Hall': 'Đại Sảnh Đọc Sách',
  'The Sunken Vault': 'Kho Tàng Chìm Sâu',
  'Cinder Outpost': 'Tiền Đồn Tàn Than',
  'The Salt Flats': 'Cánh Đồng Muối',
  'The Furnace Core': 'Lõi Lò Lửa',
  'The Stargate Passage': 'Hành Lang Cổng Sao',
  'The Lens Chamber': 'Phòng Thấu Kính',
  'The Void Throne': 'Ngai Hư Không',
  'The Bazaar Gate': 'Cổng Chợ Phiên',
  'The Black Market': 'Chợ Đen',
  'The Vault of Greed': 'Kho Tham Vọng',
  'The Twilight Shore': 'Bờ Chạng Vạng',
  'The Nightmare Corridor': 'Hành Lang Ác Mộng',
  'The Lucid Core': 'Lõi Mộng Tỉnh',
  'The Drowned Docks': 'Bến Cảng Chìm',
  'The Coral Labyrinth': 'Mê Cung San Hô',
  'The Sunken Throne': 'Ngai Vàng Đáy Biển',
  'The Outer Walls': 'Tường Thành Ngoại',
  'The Armory': 'Kho Vũ Khí',
  'The Command Tower': 'Tháp Chỉ Huy',
  'The Big Top': 'Lều Xiếc Lớn',
  'The Hall of Mirrors': 'Hành Lang Gương',
  'The Grand Finale Stage': 'Sân Khấu Màn Kết',
  'The Crumbling Altar': 'Bàn Thờ Sụp Đổ',
  "The Oracle's Chamber": 'Phòng Tiên Tri',
  'The Throne of Echoes': 'Ngai Vàng Vang Vọng'
};

const entityNameVi: Record<string, string> = {
  gate: 'Vệ Cổng Cổ Ngữ',
  spore_puff: 'Bụi Bào Tử Mơ Màng',
  vine_crawler: 'Kẻ Bò Dây Leo',
  bark_golem: 'Hộ Vệ Vỏ Cây',
  thornmaw: 'Hàm Gai Tím',
  sylvanus: 'Sylvanus, Vương Miện Rễ',
  pyraxis: 'Pyraxis, Cánh Lửa Than',
  lexicon: 'Từ Điển Sống',
  whisperwind: 'Gió Thì Thầm',
  hollow_owl: 'Cú Rỗng Mắt',
  ink_blob: 'Giọt Mực Sống',
  paper_golem: 'Người Giấy Chú Thích',
  ripple_watcher: 'Mắt Gợn Nước',
  dust_specter: 'Bóng Ma Bụi Cũ',
  cataloguer: 'Kẻ Lưu Mục',
  cipher_shade: 'Bóng Mã Ký Tự',
  ember_rat: 'Chuột Tàn Lửa',
  dust_wraith: 'Oán Hồn Cát Tro',
  scorch: 'Vết Cháy Không Nguội',
  salt_crab: 'Cua Giáp Muối',
  mirage: 'Ảo Ảnh Vàng',
  cinder_golem: 'Khổng Lồ Than Vỡ',
  nebula_wisp: 'Linh Khói Tinh Vân',
  comet_shard: 'Mảnh Sao Băng',
  parallax: 'Kẻ Lệch Tầm Nhìn',
  prism_sprite: 'Tinh Linh Lăng Kính',
  umbra: 'Bóng Nhật Thực',
  void_tendril: 'Xúc Tu Hư Không',
  solaris: 'Solaris, Sao Tàn Hấp Hối',
  pickpocket: 'Tay Móc Túi Bóng Chợ',
  huckster: 'Gã Rao Hàng Giả Hiệu',
  tollkeeper: 'Kẻ Giữ Phí Cổng',
  debt_collector: 'Kẻ Đòi Nợ Sổ Đỏ',
  broker: 'Nhà Môi Giới Khế Ước',
  counterfeit_golem: 'Khổng Lồ Tiền Giả',
  mammon: 'Mammon, Bạo Chúa Hoàng Kim',
  sleep_wisp: 'Linh Quang Ngủ Gật',
  doubt_shadow: 'Bóng Nghi Hoặc',
  somnos: 'Somnos, Khúc Ru Sương Mù',
  fear_wraith: 'Ác Linh Khiếp Sợ',
  dread: 'Nỗi Kinh Hoàng Vô Diện',
  memory_leech: 'Đỉa Ký Ức',
  phantasma: 'Phantasma, Kẻ Nuốt Mộng',
  barnacle_husk: 'Xác Hài Hà Bám',
  tide_wraith: 'Oán Hồn Triều Nước',
  riptide: 'Dòng Chảy Ngược',
  ink_squid: 'Mực Chiến Binh',
  abyssal_eye: 'Con Mắt Vực Thẳm',
  deep_lurker: 'Kẻ Rình Dưới Sâu',
  leviathan: 'Leviathan, Vua Triều Cường',
  rust_sentinel: 'Lính Canh Hoen Rỉ',
  bolt_crawler: 'Nhện Ốc Vít',
  rampart: 'Thành Lũy Biết Đi',
  cannon_shell: 'Đạn Pháo Chưa Nổ',
  warden: 'Quản Ngục Sắt',
  steel_colossus: 'Khổng Lồ Thép',
  bastion: 'Bastion, Tư Lệnh Cuối Cùng',
  jester_puppet: 'Búp Bê Hề',
  mirror_mime: 'Diễn Viên Câm Trong Gương',
  patchwork: 'Mảnh Vá Hỗn Mang',
  laughter_shade: 'Bóng Cười Méo Mó',
  kaleidoscope: 'Kính Vạn Hoa',
  crescendo: 'Nốt Nhạc Phát Điên',
  ringmaster: 'Ông Bầu Xiếc',
  faith_fragment: 'Mảnh Niềm Tin',
  rune_specter: 'Hồn Ma Cổ Tự',
  vestige: 'Tàn Tích Thần Quyền',
  prophecy_wisp: 'Linh Quang Tiên Tri',
  oracle: 'Kẻ Tiên Tri',
  godless_colossus: 'Khổng Lồ Vô Thần',
  oblivion: 'Oblivion, Thần Quên Lãng',
  fallback: 'Bóng Chưa Gọi Tên'
};

const worldDescriptionVi: Record<string, string> = {
  'The Verdant Wilds': 'Khu rừng cổ nơi mọi sinh linh đều biết cất lời, dù sự thật thường bị giấu dưới tán lá.',
  'The Drowned Archives': 'Thư viện cổ chìm dưới làn nước lạnh, nơi tri thức cũ trôi lặng lẽ qua từng kệ sách.',
  'The Ashen Badlands': 'Một sa mạc từng là đô thành rực rỡ, nay chỉ còn tro tàn và những bóng hình không chịu yên nghỉ.',
  'The Celestial Observatory': 'Đài quan sát trên cao nơi các vì sao được đặt tên, và mỗi cái tên đều mang quyền năng thật sự.',
  "The Merchant's Labyrinth": 'Mê cung chợ ngầm nơi mọi thứ đều có giá, kể cả những điều đáng lẽ không bao giờ được đem bán.',
  'The Dreamweave Sanctum': 'Thánh địa mộng dệt, nơi ranh giới giữa giấc mơ và đời thực mỏng như làn sương.',
  'The Tidal Crypts': 'Hầm mộ cổ ngập lụt theo chu kỳ triều cường, nơi những gì chìm xuống không phải lúc nào cũng chịu nằm yên.',
  'The Iron Citadel': 'Pháo đài quân sự bỏ hoang, nơi vũ khí vẫn còn thức dù chẳng còn bàn tay nào điều khiển.',
  'The Carnival of Thorns': 'Rạp xiếc ma ám không có lối ra, nơi mỗi tiết mục rực rỡ đều che giấu một cái bẫy đầy gai.',
  'The Shattered Pantheon': 'Điện thờ của các vị thần bị lãng quên, nơi quyền năng cũ rò rỉ qua đá vỡ, lời cầu và những câu hỏi không thể trả lời.'
};

const entityDescriptionVi: Record<string, string> = {
  gate: 'Một cánh cửa phong ấn bằng cổ ngữ, thử thách lữ khách trước khi cho họ bước sâu hơn.',
  spore_puff: 'Một đốm linh khí rừng xanh, trôi lững lờ và rắc bào tử buồn ngủ khi bị làm giật mình.',
  vine_crawler: 'Một rắn rễ uốn lượn dưới lối rêu, chực cắn vào những âm tiết sai.',
  bark_golem: 'Hộ vệ vai vuông được đẽo từ vỏ cây già và đá cứng đầu.',
  thornmaw: 'Kẻ săn mồi hàm gai, nở nụ cười tím ngắt đầy hiểm ý.',
  sylvanus: 'Trùm rừng cổ đại, thân quấn đầy rễ sống và những quy tắc ngữ pháp bị lãng quên.',
  pyraxis: 'Rồng hình học rực lửa, biến mọi do dự thành tia than hồng.',
  lexicon: 'Cuốn sách sống luôn dõi mắt, từng trang chớp sáng bằng vốn từ cổ xưa.',
  whisperwind: 'Luồng gió rừng không mặt, nói bằng lá xào xạc và tiếng vọng nửa nghe thấy.',
  hollow_owl: 'Cú rỗng mắt, lắng nghe ý nghĩ trước cả khi chúng kịp thành lời.',
  ink_blob: 'Vết mực sống bò qua những kệ sách bị nước nuốt.',
  paper_golem: 'Cấu thể giấy gấp từ trang rách, lề sách và những chú thích ngoan cố.',
  ripple_watcher: 'Con mắt mặt nước, phản chiếu mọi lỗi sai thành một nụ cười méo mó.',
  dust_specter: 'Hồn ma kho lưu trữ kết từ bụi cũ và những dòng chú giải bị quên.',
  cataloguer: 'Thủ thư bất tử vẫn xếp mọi lữ khách vào mục phiền toái quá hạn.',
  cipher_shade: 'Bóng mã hóa tự bẻ mình thành ký hiệu trước khi tung đòn.',
  ember_rat: 'Chuột than đỏ, chạy đến đâu vẩy tia lửa nhỏ đến đó.',
  dust_wraith: 'Linh hồn hoang mạc quấn trong cát, tro và những oán hờn còn dang dở.',
  scorch: 'Á trùm sinh ra từ một vết cháy không chịu nguội.',
  salt_crab: 'Cua giáp tinh thể, lách cách qua đồng muối như nắm xương khô.',
  mirage: 'Ảo ảnh vàng đứng ngay tại nơi nó không nên hiện hữu.',
  cinder_golem: 'Cấu thể cháy dở, được giữ lại bằng than nứt và cơn giận âm ỉ.',
  nebula_wisp: 'Làn khói sao trôi nổi, bên trong lập lòe những ánh sáng nhỏ.',
  comet_shard: 'Mảnh sao băng có ý thức, vẫn kéo theo dáng rơi của chính mình.',
  parallax: 'Sinh thể thấu kính luôn lệch khỏi vị trí mà đôi mắt tưởng thấy.',
  prism_sprite: 'Tinh linh lăng kính tinh nghịch, chẻ ánh sáng thành cạnh sắc đầy màu.',
  umbra: 'Nhật thực sống được tạo nên từ sự hiện diện của bóng tối thuần khiết.',
  void_tendril: 'Sợi hư vô vươn ra từ khoảng trống giữa các vì sao.',
  solaris: 'Trùm sao hấp hối, thứ ánh sáng cuối cùng còn nguy hiểm hơn thời hoàng kim.',
  pickpocket: 'Kẻ móc túi nhanh tay, xem mọi chiếc túi như một lời mời.',
  huckster: 'Thương nhân giả hiệu bọc trong nụ cười, túi xách và những món hời tồi tệ.',
  tollkeeper: 'Á trùm thu phí cổng, tin rằng mỗi bước tiến đều phải trả giá.',
  debt_collector: 'Kẻ đòi nợ mắt đỏ, mang cuốn sổ đầy những khoản cân bằng bất khả thi.',
  broker: 'Kẻ môi giới để hợp đồng và lưỡi dao thuê thay mình chiến đấu.',
  counterfeit_golem: 'Gã khổng lồ đóng từ tiền giả và những lời hứa rỗng.',
  mammon: 'Trùm tham lam mạ vàng, biết chính xác giá trị của mọi thứ bạn sở hữu.',
  sleep_wisp: 'Ánh sáng buồn ngủ khiến mi mắt nặng trĩu và nhịp thời gian trơn trượt.',
  doubt_shadow: 'Cái bóng hình dấu hỏi, sống bằng sự ngập ngừng.',
  somnos: 'Á trùm thần ngủ, hát ru khiến từng giây hóa thành sương mù.',
  fear_wraith: 'Ác mộng sắc cạnh khoác hình dáng của điều khiến bạn sợ nhất.',
  dread: 'Á trùm không có khuôn mặt cố định, được dựng nên từ chính ý niệm hoảng loạn.',
  memory_leech: 'Ký sinh hồng cắn vào hồi ức và chỉ để lại tiếng vọng.',
  phantasma: 'Trùm mộng cổ đại đã học ngôn ngữ bằng cách nuốt những giấc ngủ.',
  barnacle_husk: 'Vỏ hà bám chết chìm trên gỗ mục, cào mình qua bến cảng bằng những chi thể cứng muối.',
  tide_wraith: 'Linh hồn thủy thủ bị kéo mỏng bởi dòng triều và những chuyến hải trình chưa khép lại.',
  riptide: 'Dòng nước ngược có ý thức, lôi mọi bước chân bất cẩn trở lại lòng sâu.',
  ink_squid: 'Chiến binh mực phun mây đen rối mắt để che giấu đòn tấn công kế tiếp.',
  abyssal_eye: 'Con mắt khổng lồ trồi lên từ đáy biển, kiên nhẫn nhìn đến khi ý nghĩ cũng trôi đi.',
  deep_lurker: 'Sinh vật vực sâu im lặng, chờ dưới từng gợn nước cho khoảnh khắc người học lơ là.',
  leviathan: 'Chúa tể biển cổ đại, mỗi hơi thở có thể nâng triều lên rồi kéo cả thế giới xuống.',
  rust_sentinel: 'Lính gác tự động vẫn chào những mệnh lệnh đã kết thúc từ nhiều thế kỷ trước.',
  bolt_crawler: 'Nhện ốc vít lách cách, ghép từ bu lông rời, dây thép và ý đồ chẳng lành.',
  rampart: 'Bức tường biết đi, thắng trận bằng cách ép đối thủ đến mức không còn chỗ thở.',
  cannon_shell: 'Quả đạn pháo chưa nổ lăn tới với một mục đích đáng lo hơn vẻ ngoài của nó.',
  warden: 'Quản ngục kho vũ khí, thân thể hòa vào xích sắt, thép lạnh và thói quen ra lệnh.',
  steel_colossus: 'Người khổng lồ tự vận hành bằng giáp thép và những mệnh lệnh chiến trường cũ.',
  bastion: 'Trí tuệ chỉ huy của pháo đài, đã quên mọi mục đích ngoài việc tiếp tục cuộc chiến.',
  jester_puppet: 'Búp bê hề vẫn nhảy múa ngay cả khi những sợi dây điều khiển đã bị cắt đứt.',
  mirror_mime: 'Diễn viên câm trong gương, trả lại mọi cử chỉ bằng một lưỡi sắc hơn ban đầu.',
  patchwork: 'Á trùm sân khấu được khâu từ những bộ trang phục từng phản bội chủ nhân của chúng.',
  laughter_shade: 'Một tràng cười được nặn thành bóng, rực sáng ở viền ngoài và độc ác ở bên trong.',
  kaleidoscope: 'Thực thể gương với nghìn phiên bản, mỗi phiên bản gần đúng đến mức có thể ra đòn.',
  crescendo: 'Nốt nhạc hóa điên, phồng lớn theo từng nhịp cho đến khi âm thanh trở thành vũ khí.',
  ringmaster: 'Bậc thầy nghi lễ đã biểu diễn lâu đến mức chính thực tại cũng thành một màn xiếc.',
  faith_fragment: 'Mảnh niềm tin bị bỏ lại, vẫn phát sáng ở nơi lòng sùng kính từng vỡ ra.',
  rune_specter: 'Hồn ma cổ tự trôi qua đền vỡ, nói bằng thứ ngữ pháp mà thời gian đã quên.',
  vestige: 'Tàn dư thần quyền, quá yếu để làm thần nhưng vẫn quá mạnh để biến mất.',
  prophecy_wisp: 'Lời tiên tri sống lập lòe bằng những tương lai có thể đã đến quá muộn.',
  oracle: 'Kẻ tiên tri biết lỗi sai tiếp theo trước cả khi bàn tay người chơi bắt đầu chuyển động.',
  godless_colossus: 'Người khổng lồ được dựng nên để thờ phụng, nay quỳ gối trước hư vô.',
  oblivion: 'Vị thần vô danh có quyền năng cuối cùng là khiến không ai có thể nhớ trọn vẹn về mình.',
  fallback: 'Bóng dáng vô danh xuất hiện khi hệ thống chưa tìm thấy thực thể tương ứng.'
};
