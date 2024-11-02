import { DataState } from '../enum/datastate.enum';
import { Campaign } from './campaign';
import { Compte } from './compte';
import { Events } from './event';
import { Message } from './message';
import { Role } from './role';
import { Stats } from './stats';
import { User } from './User';

export interface LoginState {
  dataState?: DataState;
  loginSuccess?: boolean;
  error?: string;
  message?: string;
  isUsingMfa?: boolean;
  phone?: string;
}

export interface CustomHttpResponse<T> {
  timeStamp?: Date;
  statusCode?: number;
  status?: string;
  message?: string;
  reason?: string;
  developerMessage?: string;
  data?: T;
}

export interface Profile {
  user?: User;
  roles?: Role[];
  events?: Events[];
  access_token?: string;
  refresh_token?: string;
}

export interface CompteState {
  user?: User;
  comptes?: Compte[];
  roles?: Role[];
}

export interface DetailCompteState {
  user?: User;
  compte?: Compte;
  roles?: Role[];
  events?: Events[];
}

export interface HomeState {
  user?: User;
  stats?: Stats;
  campaigns?: Campaign[];
}

export interface MessageState {
  user?: User;
  campaign?: Campaign;
  messages?: Message[];
  balanceSms?: number;
}

export interface Page<T> {
  content?: T[];
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  size?: number;
  number?: number;
}

export interface PaginationMessageState {
  page?: Page<Message>;
  user?: User;
  campaign?: Campaign;
  messages?: Message[];
}

export type accountType = 'account' | 'password';
export interface verifyState {
  dataState: DataState;
  verifySuccess?: boolean;
  message?: string;
  error?: string;
  title?: string;
  type?: accountType;
}
