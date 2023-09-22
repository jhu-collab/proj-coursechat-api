import { Message } from 'src/message/message.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
