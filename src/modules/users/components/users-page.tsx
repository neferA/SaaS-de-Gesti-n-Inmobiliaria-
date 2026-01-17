import { useState, useEffect } from "react"
// 👇 1. Importamos el icono Edit2
import { Search, Loader2, Shield, User as UserIcon, Trash2, UserCheck, Edit2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns" 
import { es } from "date-fns/locale"

import { Input } from "@/modules/core/components/input"
import { Button } from "@/modules/core/components/button"
import { Badge } from "@/modules/core/components/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/modules/core/components/table"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/modules/core/components/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/modules/core/components/alert-dialog"

import { usersService, type User } from "../services/users.service"
import { CreateUserDialog } from "./create-user-dialog"
// 👇 2. Importamos el Modal de Edición
import { EditUserDialog } from "./edit-user-dialog"

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // 👇 3. Estado para controlar qué usuario se está editando
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersService.getAll({ 
        page: 1, 
        limit: 100, 
        search: searchTerm 
      })
      setUsers(response.data) 
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchUsers()
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]) 

  const handleDelete = async (id: string) => {
    try {
      await usersService.delete(id)
      toast.success("Usuario eliminado correctamente")
      fetchUsers() 
    } catch (error) {
      console.error(error)
      toast.error("No se pudo eliminar el usuario")
    }
  }

  const renderRoleBadge = (roleName?: string) => {
    const r = roleName?.toLowerCase() || "";

    if (r.includes('admin')) {
        return <Badge className="bg-purple-600 hover:bg-purple-700"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>
    }
    if (r.includes('staff') || r.includes('personal')) {
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200"><UserCheck className="mr-1 h-3 w-3" /> Personal</Badge>
    }
    return <Badge variant="outline"><UserIcon className="mr-1 h-3 w-3" /> {roleName || "User"}</Badge>
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Administra el acceso y roles del personal.</p>
        </div>
        <CreateUserDialog onUserCreated={fetchUsers} />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Buscar por nombre, usuario o email..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
             Mostrando {users.length} resultados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                            {searchTerm 
                                ? "No se encontraron usuarios con esa búsqueda." 
                                : "No hay usuarios registrados."}
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    {user.username}
                                </span>
                                <span className="text-xs text-muted-foreground ml-6">{user.email}</span>
                            </div>
                        </TableCell>

                        <TableCell>
                            <span className="capitalize">
                                {user.firstName} {user.lastName}
                            </span>
                        </TableCell>

                        <TableCell>
                            {renderRoleBadge(user.role?.name)}
                        </TableCell>

                        <TableCell className="text-muted-foreground text-sm">
                            {user.createdAt 
                                ? format(new Date(user.createdAt), "dd MMM yyyy", { locale: es }) 
                                : "-"}
                        </TableCell>

                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                
                                {/* 👇 4. BOTÓN EDITAR */}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => setEditingUser(user)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>

                                {/* BOTÓN ELIMINAR */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Estás a punto de eliminar a <strong>{user.firstName} {user.lastName}</strong>.
                                                <br/>
                                                Esta acción eliminará su acceso al sistema permanentemente.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => handleDelete(user.id)} 
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Confirmar Eliminación
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <EditUserDialog 
        open={!!editingUser} 
        user={editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onUserUpdated={() => {
            fetchUsers()
            setEditingUser(null)
        }}
      />

    </div>
  )
}