"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import Link from "next/link"
import { useSignIn } from "./_hooks/useSignIn"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const AdminSignIn = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const mutation = useSignIn();
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex h-full items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Iniciar sesion</h1>
            <p className="text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta de <strong className="text-primary">usuario</strong>
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
                <div className="mt-4 text-center text-sm">
                  No tienes una cuenta?{" "}
                  <Link href="/admin/sign-up" className="underline">
                    Registrarte
                  </Link>
                </div>
                <Button type="submit">
                  {mutation.isLoading &&  <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mutation.isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="/auth/user1.jpg"
          alt="Image"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}

export default AdminSignIn;