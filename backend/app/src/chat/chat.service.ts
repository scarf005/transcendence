import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { ChatRoom } from './chatroom.entity'
import { ChatUser } from './chatuser.entity'
import { UserService } from 'user/user.service'
import { RoomType } from './roomtype.enum'
import { User } from 'user/user.entity'
import * as bcrypt from 'bcryptjs'
import { Status } from 'user/status.enum'
import { Server } from 'socket.io'
import { BanUser } from './banuser.entity'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
    @InjectRepository(BanUser)
    private banUserRepository: Repository<BanUser>,
    private readonly userService: UserService,
  ) {}

  async getAllChatrooms(): Promise<ChatRoom[]> {
    return await this.chatRoomRepository.find({
      select: ['id', 'name', 'roomtype'],
      where: { roomtype: Not(RoomType.PRIVATE) },
    })
  }

  async getJoinChatrooms(uid: number): Promise<ChatRoom[]> {
    const room = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select(['chatRoom.id', 'chatRoom.name', 'chatRoom.roomtype'])
      .where('user.uid = (:uid)', {
        uid: uid,
      })
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .orderBy('chatRoom.id', 'ASC')
      .getMany()
    const roomIds = room.map((r) => r.id)
    return await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select(['chatRoom.id', 'chatRoom.name', 'chatRoom.roomtype'])
      .where('chatRoom.id != ALL(:roomIds)', { roomIds: roomIds })
      .andWhere('chatRoom.roomtype != ALL(:roomtype)', {
        roomtype: [RoomType.DM, RoomType.PRIVATE],
      })
      .orderBy('chatRoom.id', 'ASC')
      .getMany()
  }

  async createChatroom(
    creatorId: number,
    roomTitle: string,
    roomType: RoomType,
    password?: string,
  ): Promise<ChatRoom> {
    if (roomTitle.search(/^\w{2,30}$/) === -1)
      throw new BadRequestException('RoomTitle is invalid')
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
    room.banUser = []
    room.roomtype = roomType
    room.chatUser.push(chatuser)
    return await this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('Room not created')
    })
  }

  async deleteChatroom(ownerId: number, roomId: number) {
    if (!this.isOwner(ownerId, roomId)) return
    return await this.chatRoomRepository.delete(roomId).catch(() => {
      throw new InternalServerErrorException('chatroom not deleted')
    })
  }

  async addUserToRoom(
    uid: number,
    roomId: number,
    password?: string,
    isInvite?: boolean,
  ): Promise<ChatRoom> {
    const room = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['chatUser', 'chatUser.user', 'banUser', 'banUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found')
    room.banUser.map((banUser) => {
      if (banUser.user.uid === uid) {
        throw new BadRequestException('User is banned from this room')
      }
    })
    if (password && !isInvite) {
      if (!(await bcrypt.compare(password, room.password)))
        throw new BadRequestException('Password is wrong')
    } else if (room.roomtype === RoomType.PROTECTED) {
      throw new BadRequestException('Room need password')
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

  async createDmRoom(
    uid1: number,
    uid2: number,
    roomTitle: string,
  ): Promise<ChatRoom> {
    if (roomTitle.search(/^\w{2,30}$/) === -1)
      throw new BadRequestException('RoomTitle is invalid')
    const room = new ChatRoom()
    const chatuser1 = new ChatUser()
    chatuser1.user = await this.userService.findSimpleOneByUid(uid1)
    await this.chatUserRepository.save(chatuser1).catch(() => {
      throw new InternalServerErrorException('ChatUser not created')
    })
    const chatuser2 = new ChatUser()
    chatuser2.user = await this.userService.findSimpleOneByUid(uid2)
    await this.chatUserRepository.save(chatuser2).catch(() => {
      throw new InternalServerErrorException('ChatUser not created')
    })
    room.name = roomTitle
    room.chatUser = []
    room.roomtype = RoomType.DM
    room.chatUser.push(chatuser1, chatuser2)
    room.dmParticipantsUid = [uid1, uid2]
    return await this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('Room not created')
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
        throw new InternalServerErrorException('User not removed')
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
    return this.chatUserRepository.save(room.chatUser[0]).catch(() => {
      throw new InternalServerErrorException('ChatUser not updated')
    })
  }

  async removeUserAsAdmin(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found or User not in room')
    room.chatUser[0].isAdmin = false
    return this.chatUserRepository.save(room.chatUser[0]).catch(() => {
      throw new InternalServerErrorException('ChatUser not updated')
    })
  }

  async isOwner(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) return false
    if (room.chatUser[0].isOwner) return true
    return false
  }

  async isAdmin(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) return false
    if (room.chatUser[0].isAdmin) return true
    return false
  }

  async findRoomByRoomid(id: number): Promise<ChatUser[]> {
    const room = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select([
        'chatRoom.id',
        'chatUser.isAdmin',
        'chatUser.isOwner',
        'chatUser.endOfMute',
        'user.uid',
        'user.nickname',
        'user.avatar',
        'user.status',
        'stat.win',
        'stat.lose',
        'stat.rating',
      ])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .leftJoin('user.stat', 'stat')
      .where('chatRoom.id = :id', { id })
      .getOne()
    if (!room) throw new NotFoundException('Room not found')
    return room.chatUser
  }

  async findBanUserByRoomid(id: number): Promise<BanUser[]> {
    const room = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select([
        'chatRoom.id',
        'banUser',
        'user.uid',
        'user.nickname',
        'user.avatar',
        'user.status',
        'stat.win',
        'stat.lose',
        'stat.rating',
      ])
      .leftJoin('chatRoom.banUser', 'banUser')
      .leftJoin('banUser.user', 'user')
      .leftJoin('user.stat', 'stat')
      .where('chatRoom.id = :id', { id })
      .getOne()
    if (!room) throw new NotFoundException('Room not found')
    return room.banUser
  }

  async findRoomsByUserId(uid: number): Promise<ChatRoom[]> {
    const rooms = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select(['chatRoom.id', 'chatRoom.name', 'chatRoom.roomtype'])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .where('user.uid = :uid', { uid })
      .getMany()
    if (!rooms) throw new NotFoundException('Room not found')
    return rooms
  }

  async addMuteUser(uid: number, roomId: number, muteTimeSec: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found or User not in room')
    room.chatUser[0].endOfMute = new Date(Date.now() + muteTimeSec * 1000)
    return this.chatUserRepository.save(room.chatUser[0]).catch(() => {
      throw new InternalServerErrorException('mutetime not set')
    })
  }

  async addBannedUser(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['banUser', 'banUser.user', 'chatUser', 'chatUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found')
    let chatuser: ChatUser
    if (
      !room.chatUser.find((chatUser) => {
        if (chatUser.user.uid === uid) {
          chatuser = chatUser
          return true
        }
      })
    )
      throw new NotFoundException('User not in room')
    let banuser = new BanUser()
    banuser.user = chatuser.user
    banuser = await this.banUserRepository.save(banuser).catch(() => {
      throw new InternalServerErrorException('banuser not created')
    })
    room.banUser.push(banuser)
    await this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('banuser not saved')
    })
    return await this.chatUserRepository.delete(chatuser.id).catch(() => {
      throw new InternalServerErrorException('chatuser not deleted')
    })
  }

  async deleteBannedUser(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['banUser', 'banUser.user'],
    })
    if (!room) throw new NotFoundException('Room not found')
    let banuser: BanUser
    if (
      !room.banUser.map((banUser) => {
        if (banUser.user.uid === uid) {
          banuser = banUser
          return true
        }
      })
    )
      throw new NotFoundException('User not banned')
    return await this.banUserRepository.delete(banuser.id).catch(() => {
      throw new InternalServerErrorException('banuser not deleted')
    })
  }

  // FIXEDME 이거 필요한가? 사용하는 곳이 없다.
  async isBanned(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['banUser'],
      where: { id: roomId, banUser: { user: { uid } } },
      relations: ['banUser', 'banUser.user'],
    })
    if (!room) false
    return true
  }

  async isMuted(uid: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['chatUser'],
      where: { id: roomId, chatUser: { user: { uid } } },
      relations: ['chatUser', 'chatUser.user'],
    })
    if (!room) false
    if (room.chatUser[0].endOfMute > new Date()) return true
    return false
  }

  async findOneByuid(uid: number): Promise<User> {
    return await this.userService.findOneByUid(uid)
  }

  async findUidByNickname(nickname: string): Promise<number> {
    return await this.userService.findUidByNickname(nickname)
  }

  async findBlockedMeUsers(uid: number): Promise<number[]> {
    return await this.userService.findBlockedByUid(uid)
  }

  async changeRoomPassword(uid: number, roomId: number, password: string) {
    if ((await this.isOwner(uid, roomId)) === false)
      throw new ForbiddenException('User is not Owner')
    const room = await this.chatRoomRepository.findOne({
      select: ['id', 'password'],
      where: { id: roomId },
    })
    if (!room) throw new NotFoundException('Room not found')
    room.password = await bcrypt.hash(password, 10)
    return this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('Password not changed')
    })
  }

  async deleteRoomPassword(uid: number, roomId: number) {
    if ((await this.isOwner(uid, roomId)) === false)
      throw new ForbiddenException('User is not Owner')
    const room = await this.chatRoomRepository.findOne({
      select: ['id', 'password', 'roomtype'],
      where: { id: roomId },
    })
    if (!room) throw new NotFoundException('Room not found')
    room.password = null
    room.roomtype = RoomType.PUBLIC
    return this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('Password not deleted')
    })
  }

  async createRoomPassword(uid: number, roomId: number, password: string) {
    if ((await this.isOwner(uid, roomId)) === false)
      throw new ForbiddenException('User is not Owner')
    const room = await this.chatRoomRepository.findOne({
      select: ['id', 'password', 'roomtype'],
      where: { id: roomId },
    })
    if (!room) throw new NotFoundException('Room not found')
    room.password = await bcrypt.hash(password, 10)
    room.roomtype = RoomType.PROTECTED
    return this.chatRoomRepository.save(room).catch(() => {
      throw new InternalServerErrorException('Password not created')
    })
  }

  async changeStatus(uid: number, status: Status) {
    return await this.userService.changeStatus(uid, status)
  }

  async getSocketByUid(server: Server, uid: number) {
    const clients = await server.fetchSockets()
    return clients.filter(
      (soc) => soc.data && soc.data.uid && soc.data.uid === uid,
    )
  }

  async getRoomDmByUid(uid1: number, uid2: number) {
    const room = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .where('chatRoom.roomtype = :roomtype', { roomtype: RoomType.DM })
      .andWhere('chatRoom.dmParticipantsUid <@ :uids', { uids: [uid1, uid2] })
      .getOne()
    if (!room) return null
    return room
  }

  async getDmRoomByRoomId(roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['id', 'roomtype', 'dmParticipantsUid'],
      where: { id: roomId, roomtype: RoomType.DM },
    })
    if (!room) return null
    return room
  }

  // FIXEDME 이거 필요한가? 사용하는 곳이 없다.
  async isDmRoom(roomId: number) {
    const room = await this.chatRoomRepository.findOne({
      select: ['id', 'roomtype'],
      where: { id: roomId, roomtype: RoomType.DM },
    })
    if (!room) return false
    return true
  }

  // FIXEDME 이거 필요한가? 사용하는 곳이 없다.
  async getDmRoomParticipants(roomId: number): Promise<number[]> {
    const room = await this.chatRoomRepository.findOne({
      select: ['id', 'roomtype', 'dmParticipantsUid'],
      where: { id: roomId, roomtype: RoomType.DM },
    })
    if (!room) throw new NotFoundException('Dm not found')
    return room.dmParticipantsUid
  }

  async isUserInRoom(uid: number, roomId: number) {
    const room = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select(['chatRoom.id', 'user.uid'])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .where('chatRoom.id = :id', { id: roomId })
      .andWhere('user.uid = (:uid)', { uid: uid })
      .getOne()
    if (room) return true
    return false
  }
}
