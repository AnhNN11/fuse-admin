export interface Club {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
}

export interface Notification {
  _id: string;
  createdAt: string;
  title: string;
  message: string;
  recipients: User[];
  club: Club;
  isPublic: boolean;
  sendEmail: boolean;
  status: string;
  type: string;
  viewAmount: number;
  isApproved: boolean;
  isOfAdmin: boolean;
  createdBy: User;
}
