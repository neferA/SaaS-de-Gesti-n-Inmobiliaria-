import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { UnitsModule } from './units/units.module';
import { TransactionsModule } from './transactions/transactions.module';


@Module({
  imports: [UsersModule, PrismaModule, TenantsModule, UnitsModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
