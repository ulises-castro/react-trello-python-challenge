import { BoardProviderProps } from "@/types";
import { createContext } from "react";

export const BoardContext = createContext<BoardProviderProps | null>(null)