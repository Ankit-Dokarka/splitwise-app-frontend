export type AuthForm = {
  username: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type LoginResponse = {
  success: boolean;
  message: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type LoginData = AuthForm;
