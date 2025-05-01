import MotoristRegistrationForm from "components/motorist-registration-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Motorist Registration",
  description: "Create a new motorist account",
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-white py-10">
      <div className="container max-w-6xl mx-auto px-4">
        <MotoristRegistrationForm />
      </div>
    </main>
  )
}
