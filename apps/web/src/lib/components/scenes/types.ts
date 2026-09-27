import type { HomeQueryResult } from '@dhonaadhi/sanity-types';

type Home = NonNullable<HomeQueryResult>;
export type HomeSection = NonNullable<Home['sections']>[number];
export type Section<T extends HomeSection['_type']> = Extract<HomeSection, { _type: T }>;
