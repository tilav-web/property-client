import { create } from "zustand";
import { inquiryResponseService } from "@/services/inquiry-response.service";
import type { IInquiryResponse } from "@/interfaces/inquiry/inquiry-response.interface";

interface InquiryResponseState {
  inquiryResponses: IInquiryResponse[];
  isLoading: boolean;
  fetchMyInquiryResponses: () => Promise<void>;
}

export const useInquiryResponseStore = create<InquiryResponseState>((set) => ({
  inquiryResponses: [],
  isLoading: false,
  fetchMyInquiryResponses: async () => {
    set({ isLoading: true });
    try {
      const responses = await inquiryResponseService.findMyInquiryResponses();
      set({ inquiryResponses: responses });
    } catch (error) {
      console.error("Failed to fetch inquiry responses", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
