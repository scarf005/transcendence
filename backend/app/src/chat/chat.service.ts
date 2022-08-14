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
import { User } from 'user/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
    private readonly userService: UserService,
  ) {}

  async getAllChatrooms(): Promise<ChatRoom[]> {
    return await this.chatRoomRepository.find({
      select: ['id', 'name', 'roomtype'],
      where: { roomtype: Not(RoomType.PRIVATE) },
    })
  }

  // roomType 은 type 넣는 것이 구현되면 ? 지워야 한다.
  async createChatroom(
    creatorId: number,
    roomTitle: string,
    roomType?: RoomType,
    password?: string,
  ): Promise<ChatRoom> {
    const room = new ChatRoom()
    let chatuser = new ChatUser()
    const user = await this.userService.findSimpleOneByUid(creatorId)
    chatuser.user = user
    chatuser.isAdmin = true
    chatuser.isOwner = true
    chatuser = await this.chatUserRepository.save(chatuser).catch(() => {
      throw new InternalServerErrorException('ChatUser not created')
    })
    if (password) room.password = await bcrypt.hash(password, 10)
    room.name = roomTitle
    room.chatUser = []
    room.roomtype = roomType
    room.chatUser.push(chatuser)
    return await this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('Room not created')
    })
  }

  async addUserToRoom(
    uid: number,
    roomId: number,
    password?: string,
  ): Promise<ChatRoom> {
    const room = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found')
    if (room.bannedIds.includes(uid)) {
      throw new BadRequestException('User is banned')
    }
    if (password) {
      if (!(await bcrypt.compare(password, room.password)))
        throw new BadRequestException('Password is wrong')
    }
    const user = await this.userService.findSimpleOneByUid(uid)
    if (!user) throw new NotFoundException('User not found')
    room.chatUser.map((chatUser) => {
      if (chatUser.user.uid === user.uid && !chatUser.isOwner) {
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
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found or User not in room')
    return await this.chatUserRepository
      .delete({ id: room.chatUser[0].id })
      .catch(() => {
        throw new InternalServerErrorException('user not removed')
      })
  }

  async addUserAsAdmin(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found or User not in room')
    room.chatUser[0].isAdmin = true
    return this.chatUserRepository.save(room.chatUser[0])
  }

  async removeUserAsAdmin(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found or User not in room')
    room.chatUser[0].isAdmin = false
    return this.chatUserRepository.save(room.chatUser[0])
  }

  async isAdmin(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found or User not in room')
    if (!room.chatUser[0].isAdmin)
      throw new UnauthorizedException('User is not admin')
    return true
  }

  async findRoomByRoomid(id: number): Promise<ChatRoom> {
    const room = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select([
        'chatRoom.id',
        'chatRoom.name',
        'chatRoom.type',
        'chatUser.isAdmin',
        'chatUser.isOwner',
        'user.uid',
        'user.nickname',
      ])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .where('chatRoom.id = :id', { id })
      .getOne()
    if (!room) throw new NotFoundException('Room not found')
    return room
  }

  async findRoomsByUserId(id: number): Promise<ChatRoom[]> {
    const rooms = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select(['chatRoom.id', 'chatRoom.name', 'chatRoom.type'])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .where('user.id = :id', { id })
      .getMany()
    if (!rooms) throw new NotFoundException('Room not found')
    return rooms
  }

  async addMuteUser(uid: number, roomId: number, muteTime: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found or User not in room')
    room.chatUser[0].endOfMute = new Date(Date.now() + muteTime * 1000)
    return this.chatUserRepository.save(room.chatUser[0])
  }

  async isMuted(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found or User not in room')
    if (room.chatUser[0].endOfMute > new Date()) return true
    return false
  }

  async findOneByuid(uid: number): Promise<User> {
    return await this.userService.findOneByUid(uid)
  }
}
