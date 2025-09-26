
import React, { createContext, useState, ReactNode } from "react";

export interface Candidate {
  id: number;
  name: string;
  profile_picture: string;
  qualification: string;
  candidate_age: number;
  party_name: string;
  experience: string;
  previous_positions: string;
  achievements: string;
  candidate_state: string;
  candidate_city: string;
  candidate_district: string;
  manifesto: string;
  election_id: number;
}

interface CandidateContextType {
  candidates: Candidate[];
  fetchAdminCandidates: () => Promise<void>;
}

export const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const fetchAdminCandidates = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/admin/get-candidates", {
        method: "GET",
        credentials: "include", // 👈 include cookies in request
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Error fetching admin candidates:", error);
    }
  };

  return (
    <CandidateContext.Provider value={{ candidates, fetchAdminCandidates }}>
      {children}
    </CandidateContext.Provider>
  );
};
