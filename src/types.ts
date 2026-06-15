/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'sq' | 'en';

export interface MenuItem {
  id: string;
  nameSq: string;
  nameEn: string;
  descriptionSq: string;
  descriptionEn: string;
  price: number;
  category: MenuCategory;
  image: string;
  isByKg?: boolean;
}

export type MenuCategory =
  | 'mengjesi'
  | 'mengjesi_anglez'
  | 'tava_familjare'
  | 'pasta_rizoto'
  | 'gjelle_ndryshme'
  | 'supa'
  | 'shoqeruese'
  | 'sallata'
  | 'tava_tradicionale'
  | 'zgare'
  | 'embelsira'
  | 'specialitete';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number; // For non-kg items
  weightKg?: number; // Represent weight for by-kg items
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  timeSq: string;
  timeEn: string;
  textSq: string;
  textEn: string;
  avatarColor: string;
  photos?: string[];
}
