### 项目提交流程

- `git add ` 添加要提交的项目

- `npm run commit` 或者 `git commit -m"描述"`

  - 如果使用`npm run commit`，可以根据提示填写此次提交的描述
  - 如果使用`git commit -m"描述"`这种方式提交，请遵循`angular`规范

- 提交到本地仓库后，在`push`代码前，请使用`npm run release`，生成此次提交的日志文件

  - 可以使用`npm run release -- --release-as x.y.z`生成指定版本号

- `git push xxx` 提交到远程仓库
