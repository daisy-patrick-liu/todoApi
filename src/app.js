const express = require('express')
const bodyParser = require('body-parser')
const models = require('../db/models')

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: true }))

/** 查询任务列表 */
// app.get('/list/:status/:page', async (req, res, next) => {
//     // 状态： 1->待办，2->已完成，3->已删除，-1->全部
//     const {status, page} = req.params;
//     const limit = 10 // 每页数据条数
//     let offset = (page - 1) * 10 // 起始角标
//     let where = {}
//     if(status != -1) {
//         where.status = status
//     }
//     try{
//         let list = await models.Todo.findAndCountAll({
//             where,
//             offset,
//             limit
//         })
//         res.json({
//             list
//         })
//     } catch(error) {
//         next(error)
//     }
// })

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

/** 查询任务列表（不分页版） */
app.get('/list', async (req, res, next) => {
    // 状态： 1->待办，2->已完成，3->已删除，-1->全部
    try {
        let list = await models.Todo.findAndCountAll()
        res.json({
            list
        })
    } catch (error) {
        next(error)
    }
})

/** 新建一个任务 */
app.post('/create', async (req, res, next) => {
    const { content } = req.body
    try {
        let todo = await models.Todo.create({
            content
        })
        res.json({
            todo,
            message: "任务创建成功"
        })
    } catch (err) {
        next(err)
    }

})

/** 修改一个任务，包括修改状态，删除 */
app.post('/update', async (req, res, next) => {
    const { id, content, status } = req.body
    try {
        let todo = await models.Todo.findOne({
            where: {
                id
            }
        })
        if (todo) {
            todo.update({
                content,
                status
            })
        }
        res.json({
            todo
        })
    } catch (err) {
        next(err)
    }
})

/** 错误处理 */
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

app.listen(3000, () => {
    console.log("服务已启动")
})