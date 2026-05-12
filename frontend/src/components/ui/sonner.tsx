import { Toaster as SonnerToaster } from "sonner"

function Toaster({ ...props }: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      className="toaster group"
      richColors
      position="top-right"
      {...props}
    />
  )
}

export { Toaster }
