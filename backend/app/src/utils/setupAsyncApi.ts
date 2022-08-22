import { INestApplication } from '@nestjs/common'
import {
  AsyncApiDocumentBuilder,
  AsyncApiModule,
  AsyncServerObject,
} from 'nestjs-asyncapi'

export async function setupAsyncApi(app: INestApplication): Promise<void> {
  const server: AsyncServerObject = {
    url: 'http://localhost:3000/api/chat?uid={uid}',
    protocol: 'socket.io',
    protocolVersion: '4',
    description:
      'handshake의 **auth**에 **jwt token**을 담아주면 해당 내용으로 client의 uid를 구분합니다.',
    variables: {
      uid: {
        description: '테스트를 위해 url query로 uid를 넣을 수 있습니다',
        default: '1',
      },
    },
  }

  const options = new AsyncApiDocumentBuilder()
    .setTitle('SocketIO API for Chat')
    .setVersion('1.0')
    .addServer('', server)
    .build()

  const document = await AsyncApiModule.createDocument(app, options)
  await AsyncApiModule.setup('/api-ws', app, document)
}
