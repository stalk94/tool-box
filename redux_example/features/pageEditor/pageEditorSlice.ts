// features/pageEditor/pageEditorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutVariant {
  layout: any[]; // можно уточнить тип
}

interface PageData {
  meta: { name: string };
  variants: Record<'lg' | 'md' | 'sm', LayoutVariant>;
}

interface PageEditorState {
  currentPage: string | null;
  data: PageData | null;
  selectedId: string | null;
  breakpoint: 'lg' | 'md' | 'sm';
}

const initialState: PageEditorState = {
  currentPage: null,
  data: null,
  selectedId: null,
  breakpoint: 'lg',
};

const pageEditorSlice = createSlice({
  name: 'pageEditor',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<string>) {
      state.currentPage = action.payload;
    },
    setPageData(state, action: PayloadAction<PageData>) {
      state.data = action.payload;
    },
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setBreakpoint(state, action: PayloadAction<'lg' | 'md' | 'sm'>) {
      state.breakpoint = action.payload;
    },
    updateLayout(state, action: PayloadAction<any[]>) {
      if (state.data) {
        state.data.variants[state.breakpoint].layout = action.payload;
      }
    }
  },
});

export const {
  setCurrentPage,
  setPageData,
  setSelectedId,
  setBreakpoint,
  updateLayout,
} = pageEditorSlice.actions;

export default pageEditorSlice.reducer;