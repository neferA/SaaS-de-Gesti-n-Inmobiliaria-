import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { UnitsModule } from './units/units.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { HistoryModule } from './history/history.module';


@Module({
  imports: [UsersModule, PrismaModule, TenantsModule, UnitsModule, TransactionsModule, AuthModule, EventsModule, HistoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
