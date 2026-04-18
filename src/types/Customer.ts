/* ---------------------------
   Contact person inside company
--------------------------- */
export interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes: Note[];
}

/* ---------------------------
   Internal note
--------------------------- */
export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export type CustomerStatus = "lead" | "customer" | "inactive";

/* ---------------------------
   Company (Customer)
--------------------------- */
export interface CustomerType {
  id: string;
  companyName: string;
  companyEmail?: string;
  companyPhone?: string;
  status?: CustomerStatus;
  contacts: ContactPerson[];
  notes: Note[];
}
