export default {
  pages: [
    'pages/index/index',
    'pages/message/index',
    'pages/question/index',
    'pages/email/index',
    'pages/personal/index',
    'pages/personal/pages/about/index',
    'pages/personal/pages/feedback/index',
    'pages/personal/pages/rank/index',
    'pages/personal/pages/edit/index',
    'pages/question/pages/choose_category/index',
    'pages/message/pages/message_detail/index',
    'pages/index/pages/show_more_course/index',
    'pages/index/pages/question_list/index',
    'pages/index/pages/question_detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#30CB88',
    navigationBarTitleText: '邮问必答',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'img/tabBar/index.png',
        selectedIconPath: 'img/tabBar/active_index.png'
      },
      {
        pagePath: 'pages/message/index',
        text: '资讯',
        iconPath: 'img/tabBar/msg.png',
        selectedIconPath: 'img/tabBar/active_msg.png'
      },
      {
        pagePath: 'pages/question/index',
        text: '提问',
        iconPath: 'img/tabBar/question.png',
        selectedIconPath: 'img/tabBar/active_question.png'
      },
      {
        pagePath: 'pages/email/index',
        text: '邮件',
        iconPath: 'img/tabBar/email.png',
        selectedIconPath: 'img/tabBar/active_email.png'
      },
      {
        pagePath: 'pages/personal/index',
        text: '我的',
        iconPath: 'img/tabBar/personal.png',
        selectedIconPath: 'img/tabBar/active_personal.png'
      }
    ]
  }
}
