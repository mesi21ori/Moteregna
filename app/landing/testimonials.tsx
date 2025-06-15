
import { Card, CardContent } from "components/ui/card"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fleet Manager",
      company: "Express Logistics",
      content:
        "MOTERGNA has transformed how we manage our fleet. The real-time alerts and fuel savings have made a significant impact on our bottom line.",
    },
    {
      name: "Michael Chen",
      role: "Delivery Driver",
      company: "Urban Eats",
      content:
        "As someone who drives all day, the MOTERGNA app has been a game-changer. I save time finding the best routes and money on fuel costs.",
    },
    {
      name: "David Rodriguez",
      role: "Operations Director",
      company: "City Transit",
      content:
        "The admin dashboard gives us insights we never had before. We've optimized our routes and reduced fuel consumption by 20%.",
    },
  ]

  return (
    <section id="testimonials" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Customers Say</h2>
          <div className="mb-2 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-lg font-medium">Rated 4.8/5 by 1,200+ users</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 text-gray-600">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
