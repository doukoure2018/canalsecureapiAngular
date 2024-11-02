export interface Message {
  id?: number;
  recipientNumber?: string;
  message?: string;
  status?: string;
  sentAt?: Date;
  campaign_id?: number;
  id_user?: number;
}
