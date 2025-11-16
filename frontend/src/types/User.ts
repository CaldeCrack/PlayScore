import type Comment from './Comment'
import type Completion from './Completion'
import type Rating from './Rating'


export default interface User {
  id: string
  name: string
  username: string
  email: string
  passwordHash: string
  ratings: Rating[]
  comments: Comment[]
  completions: Completion[]
}