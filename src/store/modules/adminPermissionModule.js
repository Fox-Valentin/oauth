import Vue from "vue"
const state = {
  tableData:null
}

const getters = {
  getAdminTableData:state => state.tableData
}

const actions = {
  getpermissionlist({commit, state}){
      Vue.http.interceptors.push(function(request, next) {
        var token = "Bearer " + window.localStorage.getItem("currentUser_token")
        request.headers.set('Authorization', token)
        request.headers.set('Accept', "application/json")
        next()
      });
    Vue.http.post("http://192.168.1.75/admin/getpermissionlist").then(
    (res)=>{
      commit("upadtegetAdminTableData",__treeDataFormate(res.data))
    },(err)=>{
        console.log(err)
    })
  }  
}

const mutations = {
  upadtegetAdminTableData(state,data){
    state.tableData = data
  }
}

function __treeDataFormate(ary){
// 第一步 搜集所有的父id 确定树父级
      function setCidAry(ary){
          var temp = []
          var obj = {}
          for(var i in ary){
              temp.push(ary[i].cid)
              ary[i]["children"] = []
          }
          //数组去重
          temp = _.uniq(temp)
          for(i in temp){
              obj[temp[i]] = []
          }
          return obj
      }

      //第二步 根据搜集到的父id，对原始数据分层级
      function setLevelAry(cidary,ary){
          for(var i in ary){
              cidary[ary[i].cid].push(ary[i])
          }
          return cidary
      }
      //第三步 从分层数据开始，从后向前寻找对应的父节点，合并到父节点，并删除子节点
      function finalAry(levelAry,ary){
            _.forInRight(levelAry,function(val,key){
                  for(var i in ary){
                        if(ary[i].id == key){
                              for(var j in val){
                                    ary[i].children.push(val[j])
                              }
                        }
                  }
            })
            var obj = []
            for(var i = 0; i < levelAry[0].length; i++){
                  obj.push(ary[i])
            }
            return obj
      }
      var temp1 = setCidAry(ary)
      var temp2 = setLevelAry(temp1,ary)
      var temp3 = finalAry(temp2,ary)
      return temp3
}
export default {
  state,
  getters,
  actions,
  mutations
}