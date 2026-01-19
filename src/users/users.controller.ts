import { Controller, Patch, Post, Get, Delete, Body, ParseUUIDPipe, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestFiltersDto } from '../common/dto/request-filters.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  create(@Body() createUserDto: CreateUserDto){
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query() filters: RequestFiltersDto) {
    // filters ya contiene: { page: 1, limit: 10, search: "..." }
    // gracias a las validaciones automáticas.
    return this.usersService.findAll(filters);
  }
  @Patch(':id') // 👈 La ruta será /users/uuid-aqui
  update(
    @Param('id', ParseUUIDPipe) id: string, // Valida que sea UUID
    @Body() updateUserDto: UpdateUserDto    // Valida el cuerpo
  ) {
    return this.usersService.update(id, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

}
