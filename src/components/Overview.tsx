'use client';

import { useTheme } from 'next-themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface OverviewProps {
  data: any[];
}

const Overview = ({ data }: OverviewProps) => {
  const { theme } = useTheme();

  return (
    <ResponsiveContainer width={'100%'} height={350}>
      <LineChart width={500} height={300} margin={{ left: -20 }} data={data}>
        <XAxis
          dataKey={'name'}
          stroke={theme === 'dark' ? '#bbbbbb' : '#666666'}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={theme === 'dark' ? '#bbbbbb' : '#666666'}
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `$${value}`}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            borderWidth: theme === 'dark' ? '0px' : '1px',
            borderRadius: '10px 10px 10px 10px',
            backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
          }}
          formatter={(value: number) => `$${value.toFixed(2)}`}
        />
        <Line
          type='monotone'
          dataKey='Total'
          stroke={theme === 'dark' ? '#ffffff' : '#18181b'}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Overview;
