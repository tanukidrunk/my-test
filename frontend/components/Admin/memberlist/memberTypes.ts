export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type Member = {
  id: number;
  email: string;
  username: string;
  gender: Gender;
};