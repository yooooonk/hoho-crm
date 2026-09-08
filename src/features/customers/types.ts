export type CustomerFormValues = {
  name: string;
  genderOption: string;
  genderOther: string;
  phone: string;
  birthDate: string;
  address: string;
  constitutionTag: string;
  memo: string;
};

export type CustomerFormState = {
  error: string | null;
  field: "name" | "phone" | "birthDate" | null;
  values: CustomerFormValues | null;
};

export const initialCustomerFormState: CustomerFormState = {
  error: null,
  field: null,
  values: null,
};
