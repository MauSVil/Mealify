"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { AdminSignUp, AdminSignUpSchema } from "@/lib/types/Zod/AdminSignUp"
import { useSignUp } from "./_hooks/useSignUp"
import { Loader2 } from "lucide-react"

const SignUpPage = () => {
  const form = useForm<AdminSignUp>({
    resolver: zodResolver(AdminSignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const mutation = useSignUp();
 
  function onSubmit(values: AdminSignUp) {
    mutation.mutate(values)
  }

  return (
    <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex h-full items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Registrarse</h1>
            <p className="text-muted-foreground">
              Escribe tu correo y contraseña para registrarte como <strong className="text-primary">repartidor</strong>
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Escribe tu correo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Escribe tu contraseña..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                >
                  {mutation.isPending &&  <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mutation.isPending ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="/auth/delivery.jpg"
          alt="Image"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}

export default SignUpPage;