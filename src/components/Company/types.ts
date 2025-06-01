export interface Company {
  companyName: string;
  status: 'ACTIVE' | 'EXPIRED';
}
export interface CompanyFormData {
  companyName: string;
  ownerName: string;
  ownerContact: string;
  userCount: number;
  subscriptionDate: string;
  expirationDate: string;
  companyLocation: string;
}
