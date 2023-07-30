'use client';

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

import { Button } from '@/components/ui/button';

interface ButtonListProps {
  icon: string;
  setIcon: (icon: string) => void;
}

const ButtonList = ({ icon, setIcon }: ButtonListProps) => {
  const buttons = [
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
  ];

  return (
    <div className='grid grid-cols-8 pt-4 gap-y-4 place-items-center'>
      {buttons.map((btn) => (
        <Button
          suppressHydrationWarning
          key={btn.value}
          type={'button'}
          size={'icon'}
          variant={icon === `${btn.value}` ? 'default' : 'outline'}
          onClick={() => setIcon(btn.value)}
        >
          {<btn.icon size={24} />}
        </Button>
      ))}
    </div>
  );
};

export default ButtonList;
