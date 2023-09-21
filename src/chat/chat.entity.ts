import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  // ... any other fields you may want to add later
}
