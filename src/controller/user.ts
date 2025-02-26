import { Prisma, User } from '@prisma/client'
import { argon2i, hash, verify } from 'argon2'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../database/db-client'

export class UserController {
  public async createUser(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.UserCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { password, ...body } = request.body

      const existingUser = await prisma.user.findFirst({
        where: {
          username: body.username,
        },
      })

      if (existingUser) {
        return reply.code(409).send({ error: 'User already exists' })
      }

      const hashPassword = await hash(String(password), {
        type: argon2i,
        hashLength: 64,
      })

      await prisma.user.create({
        data: {
          ...body,
          password: hashPassword,
        },
      })

      reply.code(201).send({ message: 'User created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async loginUser(
    this: FastifyInstance,
    request: FastifyRequest<{
      Body: Pick<Prisma.UserCreateInput, 'username' | 'password'>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { password, username } = request.body

      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      })

      if (!user) {
        return reply.code(404).send({ error: 'User not found' })
      }

      const isValidPassword = await verify(
        String(user.password),
        String(password)
      )

      if (!isValidPassword) {
        return reply.code(400).send({ error: 'Invalid Password' })
      }

      const token = this.jwt.sign(
        {
          username: user.username,
          id: user.id,
        },
        {
          expiresIn: '30d',
        }
      )

      reply.code(200).send({
        message: 'User logged in successfully',
        accessToken: token,
      })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async resetPassword(
    this: FastifyInstance,
    request: FastifyRequest<{
      Body: { newPassword: string; token: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { newPassword, token } = request.body

      const decodedToken = this.jwt.verify<User>(token)

      if (!decodedToken) {
        throw new Error('Invalid token')
      }

      const hashedPassword = await hash(newPassword, {
        type: argon2i,
        hashLength: 64,
      })

      await prisma.user.update({
        where: { id: decodedToken.id },
        data: { password: hashedPassword },
      })

      reply.code(200).send({
        message: 'Password reset successfully',
      })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getUser(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const body = request.authenticatedUser

      if (!body) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(body.id) },
        include: { role: { select: { type: true } } },
        omit: {
          password: true,
          roleId: true,
        },
      })

      if (!user) {
        return reply.code(404).send({ error: 'User not found' })
      }

      reply.code(200).send({ response: user })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAllUsers(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const users = await prisma.user.findMany({
        include: { role: { select: { type: true } } },
        omit: { password: true, roleId: true },
        orderBy: { id: 'asc' },
      })

      reply.code(200).send({ response: users })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
  public async deleteUser(
    this: FastifyInstance,
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) },
      })

      if (!existingUser) {
        return reply.code(404).send({ error: 'User not found' })
      }

      await prisma.user.delete({
        where: { id: Number(id) },
      })

      reply.code(200).send({ message: 'User deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
