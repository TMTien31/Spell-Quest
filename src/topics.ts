import { Word } from './types';

export interface Topic {
  id: string;
  name: string;
  description: string;
  words: Word[];
}

export const TOPICS: Topic[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    description: 'Learn words about delicious fruits!',
    words: [
      { id: 'f1', text: 'Apple', difficulty: 'easy', vietnameseMeaning: 'Quả táo' },
      { id: 'f2', text: 'Banana', difficulty: 'easy', vietnameseMeaning: 'Quả chuối' },
      { id: 'f3', text: 'Orange', difficulty: 'easy', vietnameseMeaning: 'Quả cam' },
      { id: 'f4', text: 'Grape', difficulty: 'medium', vietnameseMeaning: 'Quả nho' },
      { id: 'f5', text: 'Mango', difficulty: 'medium', vietnameseMeaning: 'Quả xoài' },
      { id: 'f6', text: 'Pineapple', difficulty: 'hard', vietnameseMeaning: 'Quả dứa' },
      { id: 'f7', text: 'Watermelon', difficulty: 'hard', vietnameseMeaning: 'Quả dưa hấu' },
      { id: 'f8', text: 'Strawberry', difficulty: 'hard', vietnameseMeaning: 'Quả dâu tây' },
      { id: 'f9', text: 'Cherry', difficulty: 'medium', vietnameseMeaning: 'Quả anh đào' },
      { id: 'f10', text: 'Peach', difficulty: 'medium', vietnameseMeaning: 'Quả đào' },
      { id: 'f11', text: 'Lemon', difficulty: 'easy', vietnameseMeaning: 'Quả chanh' },
      { id: 'f12', text: 'Avocado', difficulty: 'hard', vietnameseMeaning: 'Quả bơ' },
      { id: 'f13', text: 'Papaya', difficulty: 'medium', vietnameseMeaning: 'Quả đu đủ' },
      { id: 'f14', text: 'Kiwi', difficulty: 'easy', vietnameseMeaning: 'Quả kiwi' },
      { id: 'f15', text: 'Pomegranate', difficulty: 'hard', vietnameseMeaning: 'Quả lựu' },
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Discover creatures from around the world!',
    words: [
      { id: 'a1', text: 'Dog', difficulty: 'easy', vietnameseMeaning: 'Con chó' },
      { id: 'a2', text: 'Cat', difficulty: 'easy', vietnameseMeaning: 'Con mèo' },
      { id: 'a3', text: 'Bird', difficulty: 'easy', vietnameseMeaning: 'Con chim' },
      { id: 'a4', text: 'Elephant', difficulty: 'hard', vietnameseMeaning: 'Con voi' },
      { id: 'a5', text: 'Lion', difficulty: 'medium', vietnameseMeaning: 'Con sư tử' },
      { id: 'a6', text: 'Tiger', difficulty: 'medium', vietnameseMeaning: 'Con hổ' },
      { id: 'a7', text: 'Monkey', difficulty: 'medium', vietnameseMeaning: 'Con khỉ' },
      { id: 'a8', text: 'Giraffe', difficulty: 'hard', vietnameseMeaning: 'Con hươu cao cổ' },
      { id: 'a9', text: 'Zebra', difficulty: 'medium', vietnameseMeaning: 'Con ngựa vằn' },
      { id: 'a10', text: 'Kangaroo', difficulty: 'hard', vietnameseMeaning: 'Con chuột túi' },
      { id: 'a11', text: 'Penguin', difficulty: 'hard', vietnameseMeaning: 'Chim cánh cụt' },
      { id: 'a12', text: 'Dolphin', difficulty: 'hard', vietnameseMeaning: 'Cá heo' },
      { id: 'a13', text: 'Shark', difficulty: 'medium', vietnameseMeaning: 'Cá mập' },
      { id: 'a14', text: 'Whale', difficulty: 'medium', vietnameseMeaning: 'Cá voi' },
      { id: 'a15', text: 'Bear', difficulty: 'easy', vietnameseMeaning: 'Con gấu' },
    ]
  }
];
