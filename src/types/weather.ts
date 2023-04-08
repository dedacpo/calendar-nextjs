export type Weather = {
  temp: {
    min: number;
    max: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    id: number;
    main: string;
  }>;
};
