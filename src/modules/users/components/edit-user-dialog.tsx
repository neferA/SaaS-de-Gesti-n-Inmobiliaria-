import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Mail } from "lucide-react"

import { Button } from "@/modules/core/components/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/modules/core/components/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/modules/core/components/form"
import { Input } from "@/modules/core/components/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/modules/core/components/select"

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  roleName: z.string(), // "admin", "staff", etc.
})

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any
}

export const EditUserDialog = ({ open, onOpenChange, data }: EditUserDialogProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", email: "", roleName: "staff" },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roleName: data.role, // Asumiendo que viene como 'role' en el objeto data
      })
    }
  }, [data, form])

  function onSubmit(values: any) {
    console.log("Editando Usuario:", values)
    setTimeout(() => onOpenChange(false), 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>Actualizar permisos o datos básicos.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="staff">Personal</SelectItem>
                        <SelectItem value="viewer">Observador</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}