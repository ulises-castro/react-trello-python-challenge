import Board from "@/components/board/Board";
import { Toaster } from "./components/ui/toaster";
import { ErrorBoundary } from "react-error-boundary";
import { Fallback } from "./components/Fallback";
import { logErrorToSentry } from "./lib/utils";


function App() {
  const handleOnResetApp = () => {
    window.location.reload()
  }

  return (
    <>
      <div className="bg-primary p-4 text-center w-full text-xl md:text-5xl text-white mb-4"> Board </div>
      <ErrorBoundary onReset={handleOnResetApp} FallbackComponent={Fallback} onError={logErrorToSentry}>
        <Board />
        <Toaster />
      </ErrorBoundary>
    </>
  )
}

export default App
