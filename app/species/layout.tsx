import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Direktori Spesies',
};

export default function SpeciesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
