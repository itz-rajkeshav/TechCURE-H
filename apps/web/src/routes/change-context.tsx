import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/change-context')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/change-context"!</div>
}
