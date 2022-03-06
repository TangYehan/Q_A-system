export interface stateProp {
  userInfo: {accountId: number | string; college: string}
  isLogin: boolean
}

export interface accountInfoProp {
  userName: string
  college: string
  imgPath: string
  introduce: string
  questionCount: number
  role: number
  score: number
  solveCount: number
  agreeCount: number
  answerCount: number
  collectionCount: number
}
