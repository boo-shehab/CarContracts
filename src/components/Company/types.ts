export interface Company {
  companyName: string;
  status: 'ACTIVE' | 'EXPIRED';
}
export interface CompanyFormData {
  companyName: string;
  ownerName: string;
  ownerContact: string;
  userCount: string;
  subscriptionDate: string;
  expirationDate: string;
  companyLocation: string;
  companyUsername: string;
  companyPassword: string;
  companyEmail: string;
}
