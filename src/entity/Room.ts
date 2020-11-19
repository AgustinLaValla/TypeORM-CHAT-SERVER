import { IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, JoinTable, ManyToMany } from "typeorm";
import { Message } from "./Message";
import { User } from "./User";

@Entity()
@Unique(['name'])
export class Room {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    @IsNotEmpty()
    @IsString()
    name: string;

    @CreateDateColumn()
    createdAt: string;

    @Column()
    ownerId: number;
    @ManyToOne(() => User, user => user.roomsOwned)
    @JoinTable({ name: 'ownerId' })
    owner: User;


    @ManyToMany(() => User, user => user.roomsSubscribed, { cascade: false, primary: false })
    @JoinTable({ name: 'room_members' })
    users: User[];

    @OneToMany(() => Message, message => message.room, { eager: true, cascade: true })
    messages: Message[];
}