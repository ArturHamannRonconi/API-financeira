import Statement from '../../@types/Statement'

interface Account
{
  name: string
  id: string
  cpf: string
  statement: Statement[]
}

export default Account