// contexts/RegisterFlowContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Step1 = {
  fullName: string;
  email: string;
  phone: string; // (99)99999-9999
  birthdate: string; // dd/mm/aaaa
  height: string; // "175" ou "1.75"
  weight: string; // "70"
};
type Step2 = { password: string; confirmPassword: string };
type RegisterData = Step1 & Step2;

type Ctx = {
  data: Partial<RegisterData>;
  setStep1: (s: Step1) => void;
  setStep2: (s: Step2) => void;
  reset: () => void;
};

const RegisterFlowContext = createContext<Ctx>({} as Ctx);

export const RegisterFlowProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [data, setData] = useState<Partial<RegisterData>>({});
  const setStep1 = (s: Step1) => setData(d => ({ ...d, ...s }));
  const setStep2 = (s: Step2) => setData(d => ({ ...d, ...s }));
  const reset = () => setData({});
  return (
    <RegisterFlowContext.Provider value={{ data, setStep1, setStep2, reset }}>
      {children}
    </RegisterFlowContext.Provider>
  );
};

export const useRegisterFlow = () => useContext(RegisterFlowContext);
