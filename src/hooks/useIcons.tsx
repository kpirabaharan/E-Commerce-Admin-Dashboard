'use client';

import { useState, useEffect } from 'react';
import {
  StoreIcon,
  ShoppingBagIcon,
  ShirtIcon,
  ClapperboardIcon,
  BookIcon,
  BeerIcon,
  CoffeeIcon,
  CakeSliceIcon,
  WrenchIcon,
  HomeIcon,
  SmartphoneIcon,
  HeadphonesIcon,
  BedIcon,
  BikeIcon,
  GemIcon,
} from 'lucide-react';
import { MdSportsSoccer, MdOutlineFastfood } from 'react-icons/md';
import { PiSneakerBold, PiGameControllerBold } from 'react-icons/pi';
import { MdOutlineLaptop } from 'react-icons/md';
import { TbPerfume } from 'react-icons/tb';
import { PiCarBold } from 'react-icons/pi';

export const useIcons = () => {
  const [isMounted, setIsMounted] = useState(false);

  const icons =
    typeof window != 'undefined'
      ? [
          {
            icon: StoreIcon,
            value: 'store',
          },
          {
            icon: ShoppingBagIcon,
            value: 'shopping',
          },
          {
            icon: ShirtIcon,
            value: 'shirt',
          },
          {
            icon: PiSneakerBold,
            value: 'shoe',
          },
          {
            icon: GemIcon,
            value: 'jewelry',
          },
          {
            icon: TbPerfume,
            value: 'fragrance',
          },
          {
            icon: BookIcon,
            value: 'book',
          },
          {
            icon: ClapperboardIcon,
            value: 'movie',
          },
          {
            icon: MdOutlineLaptop,
            value: 'computer',
          },
          {
            icon: SmartphoneIcon,
            value: 'phone',
          },
          {
            icon: HeadphonesIcon,
            value: 'headphone',
          },
          {
            icon: PiGameControllerBold,
            value: 'game',
          },
          {
            icon: MdSportsSoccer,
            value: 'sport',
          },
          {
            icon: MdOutlineFastfood,
            value: 'food',
          },
          {
            icon: BeerIcon,
            value: 'beer',
          },
          {
            icon: CoffeeIcon,
            value: 'coffee',
          },
          {
            icon: CakeSliceIcon,
            value: 'desert',
          },
          {
            icon: HomeIcon,
            value: 'home',
          },
          {
            icon: BedIcon,
            value: 'bed',
          },
          {
            icon: PiCarBold,
            value: 'car',
          },
          {
            icon: BikeIcon,
            value: 'bicyle',
          },
          {
            icon: WrenchIcon,
            value: 'tool',
          },
        ]
      : [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return [];
  }

  return icons;
};
