/* ---------------------------
   Contact person inside company
--------------------------- */
export interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

/* ---------------------------
   Internal note for company
--------------------------- */
export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

/* ---------------------------
   Company (Customer)
--------------------------- */
export interface CustomerType {
  id: string;
  companyName: string;
  companyEmail?: string;
  companyPhone?: string;
  contacts: ContactPerson[];
  notes: Note[];
}