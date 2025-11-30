import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    
    constructor(private readonly prisma: PrismaService){}
        
    async findAll() {
    const users = await this.prisma.user.findMany();
    
        return { users: users };
    }
    async create(){
        return{message:'usuario creado'};
    }

    async update(){
        return{message:'usuario actualizado'};
    }
    
    async remove(){
        return{message:'usuario eliminado'};
    }
}
