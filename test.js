var ary2 = [
    {cid:0,id:1,children:[],label:"01"},
    {cid:1,id:2,children:[],label:"21"},
    {cid:1,id:3,children:[],label:"31"},
    {cid:1,id:4,children:[],label:"41"},
    {cid:2,id:5,children:[],label:"52"},
    {cid:3,id:6,children:[],label:"63"},
    {cid:4,id:7,children:[],label:"74"},
    {cid:4,id:8,children:[],label:"84"}
]
var ary1 = [ 
{ "id": 14, "name": "权限管理",children:[], "label": "权限", "description": "权限管理权限管理权限管理", "cid": 0, "icon": "", "created_at": "2017-06-29 07:28:24", "updated_at": "2017-06-29 07:28:24" }, 
{ "id": 15, "name": "菜单管理",children:[], "label": "菜单管理", "description": "菜单管理菜单管理菜单管理", "cid": 14, "icon": "", "created_at": "2017-06-29 07:29:09", "updated_at": "2017-06-29 07:29:09" }, 
{ "id": 16, "name": "站点管理",children:[], "label": "用户管理", "description": "站点管理站点管理站点管理", "cid": 14, "icon": "", "created_at": "2017-06-29 07:29:57", "updated_at": "2017-06-29 07:29:57" } 
]
// 第一步 搜集所有的父id 确定树父级
var cidAry = setCidAry(ary1)
function setCidAry(ary){
    var temp = []
    for(var i in ary){
        temp.push(ary[i].cid)
    }
    //数组去重
    temp = _.uniq(temp)
    for(i in temp){
        temp[i] = []
    }
    return temp
}

//第二步 根据搜集到的父id，对原始数据分层级
var levelAry = setLevelAry(cidAry,ary1)
function setLevelAry(cidary,ary){
    for(var i in ary){
        cidary[ary[i].cid].push(ary[i])
    }
    return cidary
}
//第三步 从分层数据开始，从后向前寻找对应的父节点，合并到父节点，并删除子节点
function finalAry(levelAry,callback){
    var aryNum = levelAry.length - 1
    if(aryNum === 0){
        callback(levelAry)
        return levelAry
    }
    for(var i = 0, len1 = levelAry.length; i < len1;i++){
        for(var j = 0, len2 = levelAry[i].length; j < len2;j++){
            if(levelAry[i][j].id === aryNum){
                levelAry[i][j].children.push(levelAry[aryNum])
            }
        }
    }
    finalAry(_.dropRight(levelAry),callback)
}
var temp
finalAry(levelAry,function(ary){ temp = ary})