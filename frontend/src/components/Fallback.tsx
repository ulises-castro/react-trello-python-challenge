import { Button } from "@/components/ui/button";
import { FallbackProps } from "react-error-boundary";

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div className="w-full flex flex-col items-center gap-4 p-4 " role="alert">
			<div>
				<h1 className="text-2xl">Something went wrong:</h1>
				<pre style={{ color: "red" }}>{error.message}</pre>
			</div>
			<div>

				<Button onClick={resetErrorBoundary}>Try again</Button>
			</div>
		</div>
	);
}
