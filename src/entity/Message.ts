import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    senderId: number;
    @OneToOne(() => User)
    @JoinTable({name: 'senderId'})
    sender:User;

    @Column({ type: "text", nullable: false })
    @IsString()
    @IsNotEmpty()
    message: string;

    @CreateDateColumn({ nullable: false })
    createdAt: string;

    @Column({nullable: false})
    roomId: number;
    @ManyToOne(() => Room, room => room.messages)
    @JoinTable({ name: 'roomId' })
    room: Room;

}