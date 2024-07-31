export type RegistrationBody = {
  email: string;
  phone: string;
  name: string;
  fullName: string;
  gender: Gender;
  dateIssue: string;
  password: string;
}

export type Gender = 'make' | 'female';
