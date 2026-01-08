// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando sembrado de datos...');

  // 1. Crear el ROL de Administrador (Si no existe, falla la creación del usuario)
  // Usamos upsert para que no de error si ya existe
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Super Administrador del Sistema',
    },
  });

  console.log('✅ Rol ADMIN verificado/creado');

  // 2. Crear el Usuario Admin
  const email = 'admin@admin.com';
  const passwordRaw = 'admin123'; // <--- ESTA SERÁ TU CONTRASEÑA PARA ENTRAR
  
  // Encriptamos la contraseña igual que en tu AuthService
  const hashedPassword = await bcrypt.hash(passwordRaw, 10);

  const userAdmin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword, // Guardamos el hash
      firstName: 'Super',
      lastName: 'Admin',
      username: 'admin',
      roleId: roleAdmin.id,
    },
  });

  console.log(`✅ Usuario creado: ${userAdmin.email}`);
  console.log(`🔑 Contraseña: ${passwordRaw}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });