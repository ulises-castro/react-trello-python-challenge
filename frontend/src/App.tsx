import Board from "@/components/board/Board"
import { Suspense } from "react"
import BoardSkeleton from "./components/board/BoardSkeleton"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <>
      <div className="bg-primary p-4 text-center w-full text-xl md:text-5xl text-white mb-4"> Board </div>
      <Suspense fallback={<BoardSkeleton />}>
        <Board />
      </Suspense>
      <Toaster />
    </>
  )
}

export default App
