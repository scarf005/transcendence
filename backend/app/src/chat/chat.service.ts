import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { ChatRoom } from './chatroom.entity'
import { ChatUser } from './chatuser.entity'
import { UserService } from 'user/user.service'
import { RoomType } from './roomtype.enum'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
    private readonly userService: UserService,
  ) {}

  getAllChatrooms(): Promise<ChatRoom[]> {
    return this.chatRoomRepository.find({
      select: ['id', 'name', 'roomtype'],
      where: { roomtype: Not(RoomType.PRIVATE) },
    })
  }

  async createChatroom(
    creatorId: number,
    roomTitle: string,
  ): Promise<ChatRoom> {
    const room = new ChatRoom()
    let chatuser = new ChatUser()
    const user = await this.userService
      .findSimpleOneByUid(creatorId)
      .catch(() => {
        throw new NotFoundException('User not found')
      })
    chatuser.user = user
    chatuser.isAdmin = true
    chatuser.isOwner = true
    chatuser = await this.chatUserRepository.save(chatuser).catch(() => {
      throw new InternalServerErrorException('ChatUser not created')
    })
    room.name = roomTitle
    room.chatUser = []
    room.chatUser.push(chatuser)
    return await this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('Room not created')
    })
  }

  async addUserToRoom(uid: number, roomId: number): Promise<ChatRoom> {
    const room = await this.chatRoomRepository
      .findOne({
        where: { id: roomId },
        relations: ['chatUser', 'chatUser.user'],
      })
      .catch(() => {
        throw new NotFoundException('Room not found')
      })
    if (room.bannedIds.includes(uid)) {
      throw new BadRequestException('User is banned')
    }
    const user = await this.userService.findSimpleOneByUid(uid).catch(() => {
      throw new NotFoundException('User not found')
    })
    room.chatUser.map((chatUser) => {
      if (chatUser.user.uid === user.uid) {
        throw new BadRequestException('User already in room')
      }
    })
    let chatuser = new ChatUser()
    chatuser.user = user
    chatuser = await this.chatUserRepository.save(chatuser).catch(() => {
      throw new InternalServerErrorException('ChatUser not created')
    })
    room.chatUser.push(chatuser)
    return await this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('Room not updated')
    })
  }

  async removeUserFromRoom(uid: number, roomId: number) {
    const room = await this.chatRoomRepository
      .findOne({
        select: ['chatUser'],
        where: { id: roomId, chatUser: { user: { uid } } },
        relations: ['chatUser', 'chatUser.user'],
      })
      .catch(() => {
        throw new NotFoundException('Room not found or User not in room')
      })
    return await this.chatUserRepository
      .delete({ id: room.chatUser[0].id })
      .catch(() => {
        throw new InternalServerErrorException('user not removed')
      })
  }

  async addUserAsAdmin(uid: number, roomId: number) {
    const room = await this.chatRoomRepository
      .findOne({
        select: ['chatUser'],
        where: { id: roomId, chatUser: { user: { uid } } },
        relations: ['chatUser', 'chatUser.user'],
      })
      .catch(() => {
        throw new NotFoundException('Room not found or User not in room')
      })
    room.chatUser[0].isAdmin = true
  }

  async removeUserAsAdmin(uid: number, roomId: number) {
    const room = await this.chatRoomRepository
      .findOne({
        select: ['chatUser'],
        where: { id: roomId, chatUser: { user: { uid } } },
        relations: ['chatUser', 'chatUser.user'],
      })
      .catch(() => {
        throw new NotFoundException('Room not found or User not in room')
      })
    room.chatUser[0].isAdmin = false
  }

  async isAdmin(uid: number, roomId: number) {
    const room = await this.chatRoomRepository
      .findOne({
        select: ['chatUser'],
        where: { id: roomId, chatUser: { user: { uid } } },
        relations: ['chatUser', 'chatUser.user'],
      })
      .catch(() => {
        throw new NotFoundException('Room not found or User not in room')
      })
    if (!room.chatUser[0].isAdmin)
      throw new UnauthorizedException('User is not admin')
    return true
  }

  async findRoomByRoomid(id: number): Promise<ChatRoom> {
    return await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select([
        'chatRoom.id',
        'chatRoom.name',
        'chatRoom.type',
        'chatUser.isAdmin',
        'chatUser.isOwner',
        'user.id',
      ])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .where('chatRoom.id = :id', { id })
      .getOne()
  }

  async findRoomsByUserId(id: number): Promise<ChatRoom[]> {
    return await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select(['chatRoom.id', 'chatRoom.name', 'chatRoom.type'])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .where('user.id = :id', { id })
      .getMany()
  }
}
